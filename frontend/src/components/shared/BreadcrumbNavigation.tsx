import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
  /** Optional CSS class for the container */
  className?: string;
}

/**
 * Breadcrumb navigation with JSON-LD structured data.
 * The last item is always rendered as plain text (current page).
 *
 * @example
 * <BreadcrumbNavigation items={[
 *   { label: "Home", href: "/" },
 *   { label: "About" },
 * ]} />
 */
export function BreadcrumbNavigation({ items, className = "" }: BreadcrumbNavigationProps) {
  // JSON-LD BreadcrumbList structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: item.href } : {}),
    })),
  };

  return (
    <>
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Visual breadcrumb */}
      <nav aria-label="Breadcrumb" className={`flex items-center gap-1.5 text-sm ${className}`}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <span key={index} className="flex items-center gap-1.5">
              {index === 0 && (
                <Home className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0" />
              )}

              {index > 0 && (
                <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] flex-shrink-0" />
              )}

              {isLast || !item.href ? (
                <span className="text-[var(--text-primary)] font-medium truncate">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-[var(--text-muted)] hover:text-primary-500 transition-colors truncate"
                >
                  {item.label}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    </>
  );
}
