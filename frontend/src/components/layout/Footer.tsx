import Link from "next/link";
import { GraduationCap, Mail, Phone, MapPin } from "lucide-react";

const quickLinks = [
  { href: "/",             label: "Home" },
  { href: "/about",        label: "About" },
  { href: "/publications", label: "Publications" },
  { href: "/gallery",      label: "Gallery" },
  { href: "/contact",      label: "Talk to Prof" },
  { href: "/alumni",       label: "Alumni Connect" },
];

const socialLinks = [
  { href: "https://www.facebook.com/bhagwansinghdsmm", label: "Facebook" },
  { href: "https://x.com/bhagwansinghdsmm", label: "X (Twitter)" },
  { href: "https://www.instagram.com/bhagwansinghdsmm", label: "Instagram" },
  { href: "https://dsmmclub.com", label: "DSMM Club" },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--bg-secondary)] border-t border-[var(--border)] mt-auto">
      <div className="container-academic py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-500 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-display font-semibold text-[var(--text-primary)]">
                  Prof. (Dr.) Bhagwan Singh
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Management Faculty & Researcher
                </p>
              </div>
            </div>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-6 max-w-sm italic font-display">
              "Care for People, Planet &amp; Peace"
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              <a
                href="mailto:bhagwansingh@dsmm.ac.in"
                className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-primary-500 transition-colors"
              >
                <Mail className="w-4 h-4 flex-shrink-0" />
                bhagwansingh@dsmm.ac.in
              </a>
              <div className="flex items-start gap-2 text-sm text-[var(--text-muted)]">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>DSMM College, India</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-sm font-semibold text-[var(--text-primary)] mb-4 uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[var(--text-muted)] hover:text-primary-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-display text-sm font-semibold text-[var(--text-primary)] mb-4 uppercase tracking-wider">
              Connect
            </h3>
            <ul className="space-y-2">
              {socialLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--text-muted)] hover:text-primary-500 transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="https://orcid.org/0000-0000-0000-0000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--text-muted)] hover:text-primary-500 transition-colors"
                >
                  ORCID Profile
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-muted)]">
            © {currentYear} Prof. (Dr.) Bhagwan Singh. All rights reserved.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            Designed &amp; developed with care by the dev team.
          </p>
        </div>
      </div>
    </footer>
  );
}