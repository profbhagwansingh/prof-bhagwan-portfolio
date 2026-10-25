#!/usr/bin/env bash
# ==============================================================================
# Automated Database Backup & Multi-Tier Retention to Cloudflare R2
#
# Generates a compressed pg_dump, encrypts with GPG (AES-256), and uploads
# to Cloudflare R2 (S3-compatible).
#
# Retention policy:
#   - Daily: Keeps last 7 daily backups
#   - Weekly: Keeps last 4 weekly backups (captured every Sunday)
#   - Monthly: Keeps last 6 monthly backups (captured on 1st of month)
# ==============================================================================

set -euo pipefail

# 1. Validate required environment variables (never print their values)
for var in DATABASE_URL BACKUP_ENCRYPTION_KEY R2_ACCOUNT_ID R2_ACCESS_KEY_ID R2_SECRET_ACCESS_KEY R2_BUCKET_NAME; do
  if [ -z "${!var:-}" ]; then
    echo "::error::Required environment variable $var is not set."
    exit 1
  fi
done

# 2. Setup dates and endpoints
TIMESTAMP=$(date -u +%Y-%m-%d_%H%M%SZ)
DAY_OF_WEEK=$(date -u +%u) # 1 = Monday, 7 = Sunday
DAY_OF_MONTH=$(date -u +%d)

R2_ENDPOINT="https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
export AWS_ACCESS_KEY_ID="$R2_ACCESS_KEY_ID"
export AWS_SECRET_ACCESS_KEY="$R2_SECRET_ACCESS_KEY"
export AWS_DEFAULT_REGION="auto"

BACKUP_DIR=$(mktemp -d)
trap 'rm -rf "$BACKUP_DIR"' EXIT

SQL_FILE="${BACKUP_DIR}/dump_${TIMESTAMP}.sql"
GZ_FILE="${SQL_FILE}.gz"
ENC_FILE="${GZ_FILE}.gpg"

echo "==> Running pg_dump against PostgreSQL database..."
pg_dump "$DATABASE_URL" \
  --no-owner \
  --no-privileges \
  --clean \
  --if-exists \
  --format=plain \
  > "$SQL_FILE"

FILE_SIZE=$(wc -c < "$SQL_FILE")
if [ "$FILE_SIZE" -lt 500 ]; then
  echo "::error::pg_dump produced an empty or suspiciously small dump ($FILE_SIZE bytes)."
  exit 1
fi
echo "==> Raw dump generated successfully: $(du -h "$SQL_FILE" | cut -f1)"

echo "==> Compressing SQL dump with gzip..."
gzip -9 -c "$SQL_FILE" > "$GZ_FILE"
echo "==> Compressed dump size: $(du -h "$GZ_FILE" | cut -f1)"

echo "==> Encrypting archive with GPG (AES-256)..."
gpg --batch --yes --passphrase "$BACKUP_ENCRYPTION_KEY" \
  --symmetric --cipher-algo AES256 \
  -o "$ENC_FILE" "$GZ_FILE"
echo "==> Encrypted archive ready: $(du -h "$ENC_FILE" | cut -f1)"

# 3. Upload to Daily tier
DAILY_KEY="daily/backup_${TIMESTAMP}.sql.gz.gpg"
echo "==> Uploading daily tier backup to s3://${R2_BUCKET_NAME}/${DAILY_KEY}..."
aws s3 cp "$ENC_FILE" "s3://${R2_BUCKET_NAME}/${DAILY_KEY}" --endpoint-url "$R2_ENDPOINT"

# 4. Upload to Weekly tier on Sundays
if [ "$DAY_OF_WEEK" -eq 7 ] || [ "${FORCE_WEEKLY:-false}" = "true" ]; then
  WEEKLY_KEY="weekly/backup_${TIMESTAMP}.sql.gz.gpg"
  echo "==> Capturing weekly tier backup: s3://${R2_BUCKET_NAME}/${WEEKLY_KEY}..."
  aws s3 cp "$ENC_FILE" "s3://${R2_BUCKET_NAME}/${WEEKLY_KEY}" --endpoint-url "$R2_ENDPOINT"
fi

# 5. Upload to Monthly tier on the 1st of the month
if [ "$DAY_OF_MONTH" -eq "01" ] || [ "${FORCE_MONTHLY:-false}" = "true" ]; then
  MONTHLY_KEY="monthly/backup_${TIMESTAMP}.sql.gz.gpg"
  echo "==> Capturing monthly tier backup: s3://${R2_BUCKET_NAME}/${MONTHLY_KEY}..."
  aws s3 cp "$ENC_FILE" "s3://${R2_BUCKET_NAME}/${MONTHLY_KEY}" --endpoint-url "$R2_ENDPOINT"
fi

# 6. Retention pruning function
prune_tier() {
  local prefix="$1"
  local keep="$2"
  echo "==> Checking retention for tier '${prefix}/' (target: keep latest $keep)..."
  
  # List all keys under tier, sorted oldest to newest
  local keys
  keys=$(aws s3 ls "s3://${R2_BUCKET_NAME}/${prefix}/" --endpoint-url "$R2_ENDPOINT" 2>/dev/null | awk '{print $4}' | grep '\.gpg$' | sort || true)
  
  if [ -z "$keys" ]; then
    echo "    Tier '${prefix}/' is empty."
    return 0
  fi

  local count
  count=$(echo "$keys" | grep -c '\.gpg$' || true)
  echo "    Found $count item(s) in tier '${prefix}/'."

  if [ "$count" -gt "$keep" ]; then
    local to_delete_count=$(( count - keep ))
    echo "    Pruning $to_delete_count expired backup(s) from '${prefix}/'..."
    local to_delete
    to_delete=$(echo "$keys" | head -n "$to_delete_count")
    for k in $to_delete; do
      echo "    - Deleting expired backup: s3://${R2_BUCKET_NAME}/${prefix}/${k}"
      aws s3 rm "s3://${R2_BUCKET_NAME}/${prefix}/${k}" --endpoint-url "$R2_ENDPOINT"
    done
  else
    echo "    No pruning needed for '${prefix}/' ($count <= $keep)."
  fi
}

echo "==> Running retention policy pruning..."
prune_tier "daily" 7
prune_tier "weekly" 4
prune_tier "monthly" 6

echo "==> Database backup & retention cycle completed successfully."
