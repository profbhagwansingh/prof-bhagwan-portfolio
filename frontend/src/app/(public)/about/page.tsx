"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface TimelineItem {
  id: string;
  title: string;
  subtitle: string | null;
  organization: string;
  location: string | null;
  dateRange: string;
  externalLink: string | null;
}

export default function AboutPage() {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [scholars, setScholars] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [publicationsCount, setPublicationsCount] = useState<number>(0);
  const [chaptersCount, setChaptersCount] = useState<number>(0);
  const [lecturesCount, setLecturesCount] = useState<number>(0);
  
  // Dynamic About Content State
  const [aboutData, setAboutData] = useState({
    title: "Care for People, Planet & Peace",
    subtitle: "Distinguished Professor of Management",
    paragraphs: [
      "With a career spanning over 25 years, Prof. (Dr.) Bhagwan Singh is a renowned academic in the field of management. He currently serves as a Professor in the Department of Business Administration (DBA), School of Management Sciences(SMS) at the Central University of Jharkhand (CUJ), where he has also held key positions including Dean, Head of Department, and Finance Officer(I/c).",
      "His research primarily focuses on the intersection of Marketing and Information Technology. He has published over 54 papers in esteemed journals and has authored two influential books on digital and internet marketing."
    ],
    imageUrl: "/media/img/slideshow/img_8_1743658756162.jpg",
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImg, setModalImg] = useState("");
  const [modalCaption, setModalCaption] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/api/content/timeline").catch(() => ({ data: [] })),
      api.get("/api/content/scholars").catch(() => ({ data: [] })),
      api.get("/api/content/books").catch(() => ({ data: [] })),
      api.get(`/api/content/about?t=${Date.now()}`).catch(() => ({ data: [] })),
      api.get("/api/publications").catch(() => ({ data: { value: [] } })),
      api.get("/api/publications/chapters").catch(() => ({ data: { value: [] } })),
      api.get("/api/content/invited-lectures").catch(() => ({ data: [] })),
      api.get("/api/content/courses").catch(() => ({ data: [] })),
    ]).then(([timelineRes, scholarsRes, booksRes, aboutRes, pubRes, chapterRes, lectureRes, coursesRes]) => {
      setTimeline(Array.isArray(timelineRes.data) ? timelineRes.data : []);
      setScholars(Array.isArray(scholarsRes.data) ? scholarsRes.data : []);
      setBooks(Array.isArray(booksRes.data) ? booksRes.data : []);
      
      const cData = coursesRes?.data;
      const fetchedCourses = Array.isArray(cData) ? cData : (cData?.data ?? cData?.items ?? []);
      setCourses(fetchedCourses.filter((c: any) => c.isActive !== false));
      
      let pubCount = 0;
      if (Array.isArray(pubRes.data?.value)) pubCount = pubRes.data.value.length;
      else if (Array.isArray(pubRes.data)) pubCount = pubRes.data.length;
      setPublicationsCount(pubCount);
      
      let chapCount = 0;
      if (Array.isArray(chapterRes.data?.value)) chapCount = chapterRes.data.value.length;
      else if (Array.isArray(chapterRes.data)) chapCount = chapterRes.data.length;
      setChaptersCount(chapCount);
      
      let lecCount = 0;
      if (Array.isArray(lectureRes.data)) lecCount = lectureRes.data.length;
      setLecturesCount(lecCount);
      
      const aboutItems = Array.isArray(aboutRes.data) ? aboutRes.data : [];
      const mainAbout = aboutItems.find((item: any) => item.sectionKey === "main_about");
      if (mainAbout) {
        let parsedSubtitle = "";
        let parsedParagraphs: string[] = [];
        try {
          const parsed = JSON.parse(mainAbout.content);
          parsedSubtitle = parsed.subtitle;
          parsedParagraphs = parsed.text.split("\n").filter((p: string) => p.trim() !== "");
        } catch(e) {
          parsedParagraphs = [mainAbout.content];
        }
        
        setAboutData({
          title: mainAbout.title,
          subtitle: parsedSubtitle,
          paragraphs: parsedParagraphs.map(p => 
            p.replace(/over \d+ papers in esteemed journals/, `over ${pubCount > 0 ? pubCount : 54} papers in esteemed journals`)
             .replace(/over \d+ publications/, `over ${pubCount > 0 ? pubCount : 54} publications`)
          ),
          imageUrl: mainAbout.imageUrl || "/media/img/slideshow/img_8_1743658756162.jpg",
        });
      }
    });
  }, []);

  const openPhdModal = (src: string, caption: string) => {
    setModalImg(src);
    setModalCaption(caption);
    setModalOpen(true);
  };

  const closePhdModal = () => {
    setModalOpen(false);
  };

  return (
    <main>
      <section className="about-me">
        <div className="container">
          <h2>{aboutData.title}</h2>
          <div className="about-content">
            <img src={aboutData.imageUrl} alt="Prof. (Dr.) Bhagwan Singh" className="animate-on-scroll" />
            <div className="about-text animate-on-scroll">
              {aboutData.subtitle && <h3>{aboutData.subtitle}</h3>}
              {aboutData.paragraphs.map((para, index) => (
                <p key={index}>{para}</p>
              ))}
            </div>
          </div>
          
          <section className="full-page">
            {/* Professional Experience Section */}
            <section className="full-page">
              <div className="experience-section animate-on-scroll">
                <h3 className="section-title">Professional Experience</h3>
                <div className="experience-timeline">
                  {timeline.length > 0 ? (
                    timeline.map((item, index) => (
                      <div key={item.id} className="timeline-item">
                        {item.externalLink ? (
                          <a href={item.externalLink} target="_blank" rel="noopener noreferrer" aria-label="profile" className="profile-link" style={{ textDecoration: 'none' }}>
                            <div className="timeline-content">
                              <h4>{item.title}</h4>
                              <p>{item.organization}</p>
                              {item.location && <p>{item.location}</p>}
                              <span className="timeline-date">{item.dateRange}</span>
                            </div>
                          </a>
                        ) : (
                          <div className="timeline-content">
                            <h4>{item.title}</h4>
                            {item.subtitle && <p style={{ color: '#5061C4', margin: '5px 0' }}>{item.subtitle}</p>}
                            <p>{item.organization}</p>
                            {item.location && <p>{item.location}</p>}
                            <span className="timeline-date">{item.dateRange}</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p>Loading timeline...</p>
                  )}
                </div>
              </div>
            </section>

            {/* Courses Section */}
            <div className="courses-section animate-on-scroll">
              <h3 className="section-title">Courses Taught</h3>
              
              <div className="marquee-container">
                <div className="marquee-track scroll-left">
                  <ul className="courses-list">
                    {courses.slice(0, Math.ceil(courses.length / 2)).map(c => (
                      <li key={c.id} onClick={() => c.syllabusUrl ? window.open(c.syllabusUrl, '_blank') : null}>{c.name}</li>
                    ))}
                  </ul>
                  <ul className="courses-list">
                    {courses.slice(0, Math.ceil(courses.length / 2)).map(c => (
                      <li key={`dup-${c.id}`} onClick={() => c.syllabusUrl ? window.open(c.syllabusUrl, '_blank') : null}>{c.name}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {courses.length > 1 && (
                <div className="marquee-container">
                  <div className="marquee-track scroll-right">
                    <ul className="courses-list">
                      {courses.slice(Math.ceil(courses.length / 2)).map(c => (
                        <li key={c.id} onClick={() => c.syllabusUrl ? window.open(c.syllabusUrl, '_blank') : null}>{c.name}</li>
                      ))}
                    </ul>
                    <ul className="courses-list">
                      {courses.slice(Math.ceil(courses.length / 2)).map(c => (
                        <li key={`dup-${c.id}`} onClick={() => c.syllabusUrl ? window.open(c.syllabusUrl, '_blank') : null}>{c.name}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* ... other marquee tracks can be added here if needed ... */}
            </div>

            <section className="horizontal">
              {/* PhD Supervision Section */}
              <div className="supervision-section animate-on-scroll">
                <h3 className="section-title">PhD Supervision</h3>
                <p className="intro-text text-center">
                  Mentored {scholars.filter(s => s.status === 'POST_DOC').length > 0 ? `${scholars.filter(s => s.status === 'POST_DOC').length} Post-Doctoral, ` : ''}
                  {scholars.filter(s => s.status === 'AWARDED' || s.status === 'PURSUING').length} doctoral students, 
                  with {scholars.filter(s => s.status === 'AWARDED').length} awarded and {scholars.filter(s => s.status === 'PURSUING').length} currently pursuing their research.
                </p>
                
                <div className="phd-grid">
                  {scholars.length > 0 ? (
                    scholars.map((scholar) => (
                      <div 
                        key={scholar.id} 
                        className={`phd-card ${scholar.status.toLowerCase()}`}
                        onClick={() => openPhdModal(scholar.imageUrl || '/media/img/research-scholars/default.png', scholar.name)}
                      >
                        {scholar.name}
                      </div>
                    ))
                  ) : (
                    <p>Loading scholars...</p>
                  )}
                </div>
              </div>

              {/* Achievements Section */}
              <div className="achievements-section animate-on-scroll">
                <h3 className="section-title">Key Achievements & Awards</h3>
                <div className="achievements-grid">
                  <div className="achievement-card">
                    <h4>Developed CRISP Model</h4>
                    <p>Developed the CRISP Model for presentation of RTP (Research/Thesis/Project), appreciated and adopted by reputed national universities.</p>
                  </div>
                  <div className="achievement-card">
                    <h4>Best Teacher Award (2012)</h4>
                    <p>Received Best Teacher Award from the Rotary Club Dharamshala, H. P. (2012).</p>
                  </div>
                  <div className="achievement-card">
                    <h4>Best Teacher Award (2011)</h4>
                    <p>Received Best Teacher Award (2011) presented by the Hon’ble Vice Chancellor, Mahatma Gandhi Kashi Vidyapeth, Varanasi (organized by JDIMT, Varanasi).</p>
                  </div>
                  <div className="achievement-card">
                    <h4>First Best Paper Award (2010)</h4>
                    <p>First Best Paper Award (Feb 2010) among ~218 papers at the International Conference organized by Gardi Vidyapith University, Rajkot, Gujarat.</p>
                  </div>
                  <div className="achievement-card">
                    <h4>Conference & FDP Leadership</h4>
                    <p>Chaired several international and national FDPs, seminars, workshops, and conferences at reputed organizations.</p>
                  </div>
                  <div className="achievement-card">
                    <h4>Post-Doctoral Supervision</h4>
                    <p>Guided post-doctoral student Dr. Sachin Kumar (Green Marketing), who is now posted at NIT Hamirpur.</p>
                  </div>
                  <div className="achievement-card">
                    <h4>Publications & Presentations</h4>
                    <p>Authored {publicationsCount > 0 ? publicationsCount : 54} publications and {chaptersCount > 0 ? chaptersCount : 10} book chapters; delivered {lecturesCount > 0 ? lecturesCount : 65}+ invited lectures and presentations at national & international conferences.</p>
                  </div>
                  <div className="achievement-card">
                    <h4>Guest Lectures</h4>
                    <p>Delivered guest lectures at leading institutions across India on IT, Web-Based Advertising, and Marketing.</p>
                  </div>
                  <div className="achievement-card">
                    <h4>Organized National Programmes</h4>
                    <p>Regularly conducted national FDPs, seminars, workshops, and conferences as part of academic outreach.</p>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Books Authored Section */}
            <div className="books-section animate-on-scroll">
              <h3 className="section-title">Books Authored</h3>
              <div className="books-grid">
                {books.length > 0 ? (
                  books.map((book) => (
                    <div key={book.id} className="book-card">
                      <img src={book.coverImageUrl || "/media/img/books/default.jpg"} alt={`${book.title} Cover`} className="book-image" />
                      <div className="book-details">
                        <h4>
                          {book.purchaseUrl ? (
                            <a href={book.purchaseUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                              {book.title}
                            </a>
                          ) : (
                            book.title
                          )}
                          <span className="year">({book.year})</span>
                        </h4>
                        {book.subtitle && <p>{book.subtitle}</p>}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Loading books...</p>
                )}
              </div>
            </div>
          </section>
        </div>
      </section>

      {/* Modal for PhD Scholars */}
      <div id="phdModal" className="modal" style={{ display: modalOpen ? 'block' : 'none' }}>
        <span className="close" onClick={closePhdModal}>&times;</span>
        <img className="modal-content" id="modalImg" src={modalImg} alt="PhD Scholar" />
        <div id="modalCaption">{modalCaption}</div>
      </div>
    </main>
  );
}