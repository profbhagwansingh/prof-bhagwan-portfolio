"use client";

import { useState, useEffect } from "react";
import { BookOpen, FileText, Bookmark, Mic, ExternalLink, FileArchive, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

interface Publication { id: string; title: string; journal: string; year: number; tag: string; authors: string; doi: string; externalUrl: string; abstractText: string; }
interface Book { id: string; title: string; year: number; subtitle: string; coverImageUrl: string; purchaseUrl: string; isbn: string; }
interface Chapter { id: string; slNo: number; title: string; authors: string; publisher: string; isbn: string; year: number; }
interface Lecture { id: string; slNo: number; title: string; conferenceDetails: string; category: string; lectureDate: string; }

export function PublicationsPage() {
  const [activeTab, setActiveTab] = useState<"papers" | "books" | "chapters" | "lectures">("papers");
  const [publications, setPublications] = useState<Publication[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pubRes, bookRes, chapRes, lecRes] = await Promise.all([
          api.get("/api/publications").catch(() => ({ data: [] })),
          api.get("/api/publications/books").catch(() => ({ data: [] })),
          api.get("/api/publications/chapters").catch(() => ({ data: [] })),
          api.get("/api/content/invited-lectures").catch(() => ({ data: [] }))
        ]);
        setPublications(pubRes.data || []);
        setBooks(bookRes.data || []);
        setChapters(chapRes.data || []);
        setLectures(lecRes.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const tabs = [
    { id: "papers", label: "Research Papers", icon: FileText, count: publications.length },
    { id: "books", label: "Books Authored", icon: BookOpen, count: books.length },
    { id: "chapters", label: "Book Chapters", icon: Bookmark, count: chapters.length },
    { id: "lectures", label: "Invited Lectures", icon: Mic, count: lectures.length },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pt-24 pb-16">
      {/* Hero Header */}
      <div className="relative py-16 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/5 border-b border-primary/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-6 animate-fade-in-up">
            <BookOpen className="w-4 h-4" /> Research Portfolio
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Publications & Academic Impact
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            A comprehensive collection of peer-reviewed research papers, books, scholarly chapters, and international lectures.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-12 border-b border-gray-200 dark:border-gray-800 pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-t-xl font-medium transition-all",
                activeTab === tab.id
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <span className={cn(
                "ml-2 text-xs py-0.5 px-2 rounded-full",
                activeTab === tab.id ? "bg-white/20" : "bg-gray-200 dark:bg-gray-800"
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p>Loading academic records...</p>
          </div>
        ) : (
          <div className="animate-fade-in">
            {/* Research Papers */}
            {activeTab === "papers" && (
              <div className="space-y-6">
                {publications.length === 0 ? <EmptyState icon={FileText} /> : publications.map(pub => (
                  <div key={pub.id} className="group p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all">
                    <div className="flex justify-between items-start gap-4 mb-3">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                        {pub.title}
                      </h3>
                      {pub.externalUrl && (
                        <a href={pub.externalUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-gray-50 hover:bg-primary/10 text-gray-500 hover:text-primary transition-colors flex-shrink-0">
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {pub.authors && <span className="font-medium text-gray-800 dark:text-gray-300">👥 {pub.authors}</span>}
                      {pub.journal && <span>📝 {pub.journal}</span>}
                      <span>📅 {pub.year}</span>
                      {pub.tag && (
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs font-semibold">
                          {pub.tag.replace(/_/g, " ")}
                        </span>
                      )}
                    </div>
                    {pub.abstractText && (
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">Abstract: </span>
                        {pub.abstractText}
                      </p>
                    )}
                    {pub.doi && (
                      <a href={pub.doi.startsWith('http') ? pub.doi : `https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
                        <FileArchive className="w-4 h-4" /> DOI: {pub.doi}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Books */}
            {activeTab === "books" && (
              <div className="grid md:grid-cols-2 gap-6">
                {books.length === 0 ? <div className="col-span-2"><EmptyState icon={BookOpen} /></div> : books.map(book => (
                  <div key={book.id} className="flex gap-6 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl transition-all">
                    {book.coverImageUrl && (
                      <div className="w-24 md:w-32 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-800 bg-gray-50 shadow-sm">
                        <img src={book.coverImageUrl} alt={book.title} className="w-full h-auto object-cover" />
                      </div>
                    )}
                    <div className="flex flex-col flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{book.title}</h3>
                      {book.subtitle && <p className="text-gray-600 dark:text-gray-400 font-medium mb-3">{book.subtitle}</p>}
                      <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400 mb-4 flex-1">
                        <p>📅 Year: {book.year}</p>
                        {book.isbn && <p>📚 ISBN: {book.isbn}</p>}
                      </div>
                      {book.purchaseUrl && (
                        <a href={book.purchaseUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 w-full px-4 py-2 bg-primary/10 text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition-colors">
                          <ExternalLink className="w-4 h-4" /> View / Purchase
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Book Chapters */}
            {activeTab === "chapters" && (
              <div className="space-y-6">
                {chapters.length === 0 ? <EmptyState icon={Bookmark} /> : chapters.map((chap, i) => (
                  <div key={chap.id} className="flex gap-4 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-xl font-bold text-gray-400">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{chap.title}</h3>
                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                        {chap.authors && <span className="font-medium text-gray-800 dark:text-gray-300">👥 {chap.authors}</span>}
                        {chap.publisher && <span>🏢 {chap.publisher}</span>}
                        <span>📅 {chap.year}</span>
                        {chap.isbn && <span>📚 ISBN: {chap.isbn}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Invited Lectures */}
            {activeTab === "lectures" && (
              <div className="space-y-6">
                {lectures.length === 0 ? <EmptyState icon={Mic} /> : lectures.map((lec, i) => (
                  <div key={lec.id} className="flex gap-4 p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Mic className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{lec.title}</h3>
                        <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-xs font-semibold whitespace-nowrap">
                          {lec.category}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 font-medium">🏢 {lec.conferenceDetails}</p>
                      {lec.lectureDate && (
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                          📅 {new Date(lec.lectureDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyState({ icon: Icon }: { icon: any }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 text-gray-400">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No records found</h3>
      <p className="text-gray-500 max-w-sm">There are currently no records available in this section. Please check back later.</p>
    </div>
  );
}
