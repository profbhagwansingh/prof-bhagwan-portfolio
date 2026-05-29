import { SITE_NAME, SITE_URL, SITE_DESCRIPTION } from "@/lib/constants";

// ─── Person Schema (used on Home + About pages) ──────────────────

export function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Prof. (Dr.) Bhagwan Singh",
    jobTitle: "Professor & Researcher",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    sameAs: [], // Populated from social links API at runtime
    affiliation: {
      "@type": "EducationalOrganization",
      name: "DSMM College",
    },
    alumniOf: [],
    knowsAbout: [
      "Management",
      "Research Methodology",
      "Business Administration",
      "Higher Education",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── WebSite Schema (used on Home page) ──────────────────────────

export function WebSiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: {
      "@type": "Person",
      name: "Prof. (Dr.) Bhagwan Singh",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── ScholarlyArticle Schema (used on Publications page) ─────────

interface ArticleJsonLdProps {
  title: string;
  journal?: string;
  year: number;
  doi?: string;
  url?: string;
  abstract?: string;
}

export function ScholarlyArticleJsonLd({
  title,
  journal,
  year,
  doi,
  url,
  abstract,
}: ArticleJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    headline: title,
    author: {
      "@type": "Person",
      name: "Prof. (Dr.) Bhagwan Singh",
    },
    ...(journal ? { isPartOf: { "@type": "Periodical", name: journal } } : {}),
    datePublished: `${year}`,
    ...(doi ? { identifier: { "@type": "PropertyValue", propertyID: "DOI", value: doi } } : {}),
    ...(url ? { url } : {}),
    ...(abstract ? { description: abstract } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── Book Schema (used on Publications / About page) ─────────────

interface BookJsonLdProps {
  title: string;
  year: number;
  isbn?: string;
  coverImage?: string;
  purchaseUrl?: string;
}

export function BookJsonLd({ title, year, isbn, coverImage, purchaseUrl }: BookJsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Book",
    name: title,
    author: {
      "@type": "Person",
      name: "Prof. (Dr.) Bhagwan Singh",
    },
    datePublished: `${year}`,
    ...(isbn ? { isbn } : {}),
    ...(coverImage ? { image: coverImage } : {}),
    ...(purchaseUrl ? { url: purchaseUrl } : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── CollectionPage Schema (used on Gallery page) ────────────────

export function GalleryJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Photo Gallery — Prof. (Dr.) Bhagwan Singh",
    description:
      "Photos, videos, and newspaper cuttings from the academic journey of Prof. (Dr.) Bhagwan Singh.",
    url: `${SITE_URL}/gallery`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ─── ContactPage Schema (used on Contact page) ──────────────────

export function ContactPageJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Talk to Prof — Prof. (Dr.) Bhagwan Singh",
    description:
      "Get in touch with Prof. (Dr.) Bhagwan Singh — send a message or find contact details.",
    url: `${SITE_URL}/contact`,
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
