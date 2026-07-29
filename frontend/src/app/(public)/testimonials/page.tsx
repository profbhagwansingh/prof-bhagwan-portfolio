"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Quote } from "lucide-react";

interface Testimonial {
  id: string;
  authorName: string;
  authorTitle: string | null;
  authorImage: string | null;
  content: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/testimonials")
      .then(res => setTestimonials(res.data))
      .catch(err => console.error("Error loading testimonials", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <section className="page-header" style={{ 
        padding: '6rem 2rem 3rem', 
        background: 'linear-gradient(to right, var(--bg-secondary), var(--bg-primary))',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
            What People Say
          </h1>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Discover how Prof. (Dr.) Bhagwan Singh's mentorship, teaching, and research have positively impacted students and colleagues.
          </p>
        </div>
      </section>

      <section style={{ padding: '4rem 2rem', background: 'var(--bg-primary)', minHeight: '60vh' }}>
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading testimonials...</div>
          ) : testimonials.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No testimonials available at this time.</div>
          ) : (
            <div className="flex flex-col md:flex-row gap-6">
              {/* Masonry Columns Implementation */}
              {[0, 1, 2].map((colIndex) => {
                const colItems = testimonials.filter((_, i) => i % 3 === colIndex);
                if (colItems.length === 0) return null;
                return (
                  <div key={colIndex} className="flex flex-col gap-6 flex-1">
                    {colItems.map((t) => (
                      <div 
                        key={t.id} 
                        className="testimonial-card"
                        style={{
                          background: 'var(--bg-secondary)',
                          borderRadius: '16px',
                          padding: '2rem',
                          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
                          position: 'relative'
                        }}
                      >
                        <Quote size={40} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', opacity: 0.05, color: 'var(--text-primary)' }} />
                        <p style={{ 
                          fontSize: '1.05rem', 
                          lineHeight: 1.7, 
                          color: 'var(--text-primary)', 
                          fontStyle: 'italic',
                          marginBottom: '2rem',
                          position: 'relative',
                          zIndex: 1
                        }}>
                          "{t.content}"
                        </p>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          {t.authorImage ? (
                            <img 
                              src={t.authorImage} 
                              alt={t.authorName} 
                              style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{ 
                              width: '50px', 
                              height: '50px', 
                              borderRadius: '50%', 
                              background: 'var(--primary-color, #2563eb)', 
                              color: 'white',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '1.2rem',
                              fontWeight: 'bold'
                            }}>
                              {t.authorName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                              {t.authorName}
                            </h4>
                            {t.authorTitle && (
                              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                {t.authorTitle}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
