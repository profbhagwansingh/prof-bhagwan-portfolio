// ─── Shared TypeScript Type Definitions ──────────────────────────

// ─── Auth ────────────────────────────────────────────────────────
export type Role = "SUPER_ADMIN" | "ADMIN" | "EDITOR";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
}

// ─── Content ─────────────────────────────────────────────────────
export interface HeroSection {
  id: string;
  title: string;
  subtitle: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  sortOrder: number;
  isActive: boolean;
  images: HeroImage[];
}

export interface HeroImage {
  id: string;
  heroSectionId: string;
  imageUrl: string;
  altText: string;
  sortOrder: number;
}

export interface AboutContent {
  id: string;
  sectionKey: string;
  title: string;
  content: string;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface TimelineEntry {
  id: string;
  title: string;
  subtitle: string | null;
  organization: string;
  location: string | null;
  dateRange: string;
  externalLink: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface Course {
  id: string;
  name: string;
  syllabusUrl: string | null;
  category: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  year: number | null;
  category: string;
  sortOrder: number;
  isActive: boolean;
}

export interface PhdScholar {
  id: string;
  name: string;
  imageUrl: string | null;
  status: "AWARDED" | "PURSUING" | "POST_DOC";
  researchTopic: string | null;
  currentPosition: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  iconSvg: string | null;
  sortOrder: number;
  isActive: boolean;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  isActive: boolean;
  publishDate: string;
  expiryDate: string | null;
  createdAt: string;
}

// ─── Publications ────────────────────────────────────────────────
export type PublicationTag = "SCOPUS" | "PEER_REVIEWED" | "UGC_CARE" | "CONFERENCE";

export interface Publication {
  id: string;
  title: string;
  journal: string | null;
  year: number;
  tag: PublicationTag;
  doi: string | null;
  externalUrl: string | null;
  abstractText: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  year: number;
  subtitle: string | null;
  coverImageUrl: string | null;
  purchaseUrl: string | null;
  isbn: string | null;
  sortOrder: number;
  isActive: boolean;
}

// ─── Gallery ─────────────────────────────────────────────────────
export type MediaType = "PHOTO" | "VIDEO" | "CLIPPING";

export interface GalleryCategory {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
  items?: GalleryItem[];
}

export interface GalleryItem {
  id: string;
  categoryId: string;
  mediaType: MediaType;
  mediaUrl: string;
  thumbnailUrl: string | null;
  caption: string | null;
  altText: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

// ─── Submissions ─────────────────────────────────────────────────
export type SubmissionStatus = "NEW" | "READ" | "REPLIED" | "ARCHIVED";
export type AlumniStatus = "NEW" | "REVIEWED" | "APPROVED" | "ARCHIVED";

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  whatsapp: string | null;
  message: string;
  status: SubmissionStatus;
  createdAt: string;
}

export interface AlumniSubmission {
  id: string;
  fullName: string;
  email: string;
  whatsapp: string | null;
  teachingMode: string | null;
  degreeProgram: string | null;
  institute: string | null;
  batchYear: number | null;
  rollNumber: string | null;
  pictureUrl: string | null;
  message: string | null;
  status: AlumniStatus;
  createdAt: string;
}

// ─── Settings ────────────────────────────────────────────────────
export interface SiteSetting {
  id: string;
  key: string;
  value: string;
  category: string;
}

export interface SeoMetadata {
  id: string;
  pageSlug: string;
  metaTitle: string | null;
  metaDescription: string | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  canonicalUrl: string | null;
  structuredData: Record<string, unknown> | null;
}

// ─── Audit Logs ──────────────────────────────────────────────────
export interface AuditLog {
  id: string;
  userId: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  previousData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  ipAddress: string | null;
  createdAt: string;
}

// ─── API Response Wrappers ───────────────────────────────────────
export interface ApiListResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface DashboardStats {
  totalPublications: number;
  totalBooks: number;
  totalScholars: number;
  pendingContacts: number;
  pendingAlumni: number;
  totalGalleryItems: number;
}
