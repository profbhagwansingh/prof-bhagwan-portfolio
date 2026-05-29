"use client";

import { useEffect, useRef, useState } from "react";
import { BookOpen, ExternalLink } from "lucide-react";

import api from "@/lib/api";

interface Book {
  id: string;
  title: string;
  year: number;
  subtitle: string | null;
  isbn: string | null;
  purchaseUrl: string | null;
  coverImageUrl: string | null;
}

const bookColors = [
  "from-primary-500 to-primary-700",
  "from-emerald-500 to-emerald-700",
  "from-amber-500 to-amber-700",
  "from-rose-500 to-rose-700",
];

export function BooksSection() {
  const [localBooks, setLocalBooks] = useState<Book[]>([]);

  useEffect(() => {
    api.get("/api/publications/books").then(res => {
      setLocalBooks(Array.isArray(res.data) ? res.data : []);
    }).catch(console.error);
  }, []);

  if (localBooks.length === 0) return null;

  return (
    <section className="py-section bg-[var(--bg-secondary)] overflow-hidden">
      <div className="container-academic">
        <div className="mb-14">
          <div className="accent-line">
            <p className="text-xs font-medium uppercase tracking-widest text-primary-500 mb-2">Authored Works</p>
          </div>
          <h2 className="font-display text-display-md text-[var(--text-primary)]">
            Books Published
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {localBooks.map((book, i) => {
            const bgGradient = bookColors[i % bookColors.length];
            return (
              <div
                key={book.id}
                className="group card-base overflow-hidden"
              >
                {/* Book Cover */}
                <div className={`h-48 bg-gradient-to-br ${bgGradient} flex items-center justify-center relative`}>
                  {book.coverImageUrl && (book.coverImageUrl.startsWith('http') || book.coverImageUrl.startsWith('/')) ? (
                    <img 
                      src={book.coverImageUrl} 
                      alt={book.title} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <BookOpen className="w-16 h-16 text-white/40" />
                      <span className="absolute top-3 right-3 font-display text-white/80 text-sm font-bold">
                        {book.year}
                      </span>
                    </>
                  )}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-display text-sm font-semibold text-[var(--text-primary)] leading-snug mb-2">
                    {book.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed mb-4">
                    {book.subtitle}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[var(--text-muted)]">ISBN: {book.isbn || "N/A"}</span>
                    {book.purchaseUrl && (
                      <a href={book.purchaseUrl} target="_blank" rel="noopener noreferrer" className="w-7 h-7 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-primary-500 hover:border-primary-300 transition-all">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}