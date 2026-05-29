import { z } from "zod";

// ─── Shared Validation Schemas ──────────────────────────────────

/**
 * Contact form validation schema
 */
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(200, "Subject is too long"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(5000, "Message is too long"),
});
export type ContactFormData = z.infer<typeof contactFormSchema>;

/**
 * Alumni registration form validation schema
 */
export const alumniFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long")
    .optional()
    .or(z.literal("")),
  graduationYear: z
    .string()
    .min(4, "Enter a valid graduation year")
    .max(4, "Enter a valid graduation year"),
  degree: z.string().min(1, "Please select a degree"),
  department: z.string().min(1, "Please enter your department"),
  currentPosition: z.string().optional().or(z.literal("")),
  currentOrganization: z.string().optional().or(z.literal("")),
  message: z.string().max(2000, "Message is too long").optional().or(z.literal("")),
});
export type AlumniFormData = z.infer<typeof alumniFormSchema>;

/**
 * Admin login form validation schema
 */
export const loginFormSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});
export type LoginFormData = z.infer<typeof loginFormSchema>;

export const publicationFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(500, "Title is too long"),
  journal: z.string().min(2, "Journal/Conference name is required"),
  year: z.number().min(1950, "Year must be after 1950").max(2050, "Invalid year"),
  tag: z.enum(["SCOPUS", "PEER_REVIEWED", "UGC_CARE", "CONFERENCE"]),
  url: z.string().optional().or(z.literal("")),
  authors: z.string().optional().or(z.literal("")),
  abstract: z.string().optional().or(z.literal("")),
});
export type PublicationFormData = z.infer<typeof publicationFormSchema>;

export const galleryItemFormSchema = z.object({
  caption: z.string().min(2, "Caption must be at least 2 characters").max(200, "Caption is too long"),
  mediaUrl: z.string().min(1, "Media is required"),
  mediaType: z.enum(["PHOTO", "VIDEO", "CLIPPING"]),
  categoryId: z.string().optional().or(z.literal("")),
  sortOrder: z.number().int().min(0).optional(),
});
export type GalleryItemFormData = z.infer<typeof galleryItemFormSchema>;

/**
 * User management form validation schema
 */
export const userFormSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Password must contain uppercase, lowercase, and a number"
    ),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR"]),
});
export type UserFormData = z.infer<typeof userFormSchema>;

/**
 * SEO metadata form validation schema
 */
export const seoFormSchema = z.object({
  pageSlug: z.string().min(1, "Page slug is required"),
  metaTitle: z.string().max(70, "Meta title should be under 70 characters").optional().or(z.literal("")),
  metaDescription: z.string().max(160, "Meta description should be under 160 characters").optional().or(z.literal("")),
  ogTitle: z.string().optional().or(z.literal("")),
  ogDescription: z.string().optional().or(z.literal("")),
  ogImageUrl: z.string().optional().or(z.literal("")),
  canonicalUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});
export type SeoFormData = z.infer<typeof seoFormSchema>;
