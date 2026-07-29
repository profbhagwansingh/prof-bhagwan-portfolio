"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import api from "@/lib/api";

export default function HomePage() {
  const [images, setImages] = useState<string[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [quickStats, setQuickStats] = useState<any[]>([]);
  const [publicationCount, setPublicationCount] = useState<number>(0);
  const [scholarsCount, setScholarsCount] = useState<number>(0);
  const [authoredBooksCount, setAuthoredBooksCount] = useState<number>(0);
  const [chaptersCount, setChaptersCount] = useState<number>(0);
  const [invitedLecturesCount, setInvitedLecturesCount] = useState<number>(0);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [activeIndex, setActiveIndex] = useState(0);

  const getExperienceYears = () => {
    const start = new Date(2000, 8, 1); // September 2000
    const now = new Date();
    let yrs = now.getFullYear() - start.getFullYear();
    if (now.getMonth() < start.getMonth() || (now.getMonth() === start.getMonth() && now.getDate() < start.getDate())) {
      yrs--;
    }
    return yrs;
  };

  useEffect(() => {
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 5000); // Cross-fade every 5 seconds
    return () => clearInterval(interval);
  }, [images]);

  useEffect(() => {
    // Fetch consolidated homepage data
    api.get(`/api/homepage-data?t=${Date.now()}`)
      .then(res => {
        const data = res.data;
        if (data) {
          if (data.slideshow) setImages(data.slideshow);
          if (data.courses) setCourses(data.courses);
          if (data.quickStats) setQuickStats(data.quickStats);
          if (data.publicationsCount) setPublicationCount(data.publicationsCount);
          if (data.scholarsCount) setScholarsCount(data.scholarsCount);
          if (data.booksCount) setAuthoredBooksCount(data.booksCount);
          if (data.bookChaptersCount) setChaptersCount(data.bookChaptersCount);
          if (data.invitedLecturesCount) setInvitedLecturesCount(data.invitedLecturesCount);
          
          if (Array.isArray(data.settings)) {
            const map: Record<string, string> = {};
            data.settings.forEach((s: any) => { map[s.key] = s.value; });
            setSettings(map);
          }
        }
      })
      .catch(console.error);
  }, []);

  return (
    <main>
      <section className="hero">
        <div className="hero-slideshow-container" id="hero-slideshow" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1, backgroundColor: '#000', overflow: 'hidden' }}>
          {images.map((src, index) => (
            <div key={src} style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: index === activeIndex ? 1 : 0,
              transition: 'opacity 1.5s ease-in-out',
              pointerEvents: 'none'
            }}>
              {/* Blurred Background */}
              <img
                src={src}
                alt=""
                style={{
                  position: 'absolute',
                  top: '-10%',
                  left: '-10%',
                  width: '120%',
                  height: '120%',
                  objectFit: 'cover',
                  filter: 'blur(30px) brightness(0.6)',
                }}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
              {/* Crisp Foreground */}
              <img
                src={src}
                alt="Hero background slide"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </div>
          ))}

          {/* Bottom Navigation (Arrows + Drag Bar) */}
          <div style={{
            position: 'absolute',
            bottom: '70px',
            left: 0,
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            gap: '20px',
            zIndex: 10
          }}>
            <button
              onClick={() => setActiveIndex((current) => (current - 1 + images.length) % images.length)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '45px',
                height: '45px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                backdropFilter: 'blur(5px)',
                transition: 'background 0.3s',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              aria-label="Previous slide"
            >
              <ChevronLeft size={28} />
            </button>
            
            {/* Draggable Progress Bar */}
            {images.length > 0 && (
              <input 
                type="range" 
                min={0} 
                max={images.length - 1} 
                value={activeIndex}
                onChange={(e) => setActiveIndex(Number(e.target.value))}
                style={{
                  flex: 1,
                  cursor: 'pointer',
                  accentColor: '#5061C4',
                  height: '6px',
                  background: 'rgba(255,255,255,0.3)',
                  borderRadius: '10px',
                  outline: 'none',
                  margin: '0 10px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}
                aria-label="Slide progress bar"
              />
            )}

            <button
              onClick={() => setActiveIndex((current) => (current + 1) % images.length)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '45px',
                height: '45px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                backdropFilter: 'blur(5px)',
                transition: 'background 0.3s',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
              onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.4)'}
              onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
              aria-label="Next slide"
            >
              <ChevronRight size={28} />
            </button>
          </div>
        </div>
      </section>

      {/* ========== NEW HOME PAGE SECTIONS START ========== */}

      {/* Profile Overview Card (Stats + Details + Links) */}
      <section className="section-padding" style={{ paddingTop: '40px', paddingBottom: '20px' }}>
        <div className="animate-on-scroll" style={{ width: '95%', maxWidth: '1600px', margin: '0 auto' }}>
          <div className="profile-card" style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            borderTop: '4px solid #5061C4',
            display: 'grid',
            gridTemplateColumns: 'minmax(200px, 1fr) 2fr 1.5fr',
            gap: '40px',
            padding: '40px',
            alignItems: 'start'
          }}>
            {/* Left: Quick Stats (Replaces Image) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 20px 10px 0', borderRight: '1px solid #eee' }}>
              {quickStats.length > 0 ? (
                quickStats.map((stat, index) => {
                  // Synchronize all highlighted metrics with true DB counts
                  let displayCount = stat.count;
                  const label = stat.label.toLowerCase();
                  if (label.includes('publication') && publicationCount > 0) {
                    displayCount = publicationCount.toString();
                  } else if (label.includes('scholar') && scholarsCount > 0) {
                    displayCount = scholarsCount.toString();
                  } else if (label.includes('chapter') && chaptersCount > 0) {
                    displayCount = chaptersCount.toString();
                  } else if (label.includes('book') && authoredBooksCount > 0) {
                    displayCount = authoredBooksCount.toString();
                  } else if (label.includes('lecture') && invitedLecturesCount > 0) {
                    displayCount = invitedLecturesCount.toString();
                  }
                  return (
                    <div key={stat.id} style={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'flex-start',
                      borderBottom: index !== quickStats.length - 1 ? '1px dashed #eaeaea' : 'none',
                      paddingBottom: index !== quickStats.length - 1 ? '20px' : '0'
                    }}>
                      <span style={{ fontSize: '1.4rem', fontWeight: '700', color: '#5061C4', marginBottom: '4px', lineHeight: 1.2, wordBreak: 'break-word' }}>
                        {typeof displayCount === 'string' && displayCount.startsWith('http') ? (
                          <a href={displayCount} target="_blank" rel="noopener noreferrer" style={{ color: '#5061C4', textDecoration: 'none', transition: 'color 0.3s' }}
                            onMouseOver={(e) => e.currentTarget.style.color = '#3d4a9b'}
                            onMouseOut={(e) => e.currentTarget.style.color = '#5061C4'}
                          >{displayCount}</a>
                        ) : displayCount}
                      </span>
                      <span style={{ fontSize: '0.9rem', color: '#666', textTransform: 'capitalize', fontWeight: '500' }}>
                        {stat.label}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Loading stats...</p>
              )}
            </div>

            {/* Middle: Details */}
            <div style={{ fontSize: '1rem', color: '#555', lineHeight: '1.8' }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#1B264F', fontSize: '1.6rem', fontWeight: '700' }}>
                Prof. (Dr.) Bhagwan Singh
              </h3>
              <p style={{ margin: '8px 0' }}>
                <strong style={{ color: '#1B264F' }}>Designation :</strong> Professor
              </p>
              <p style={{ margin: '8px 0', textAlign: 'justify' }}>
                Prof. (Dr.) Bhagwan Singh is a distinguished professor of management, widely recognized as an eminent academician with over 25 years of profound experience in higher education and research. He currently holds a professorship in the Department of Business Administration (DBA), School of Management Sciences (SMS) at the Central University of Jharkhand (CUJ).
              </p>
            </div>

            {/* Right: Links & Numbers */}
            <div style={{ fontSize: '1rem', color: '#555', lineHeight: '1.8', background: '#f8f9fa', padding: '25px', borderRadius: '12px', border: '1px solid #eaeaea' }}>
              <p style={{ margin: '8px 0' }}>
                <strong style={{ color: '#1B264F' }}>Papers in Journals :</strong> <span style={{ color: '#5061C4', fontWeight: '600' }}>{publicationCount > 0 ? publicationCount : 28}</span>
              </p>
              <p style={{ margin: '8px 0' }}>
                <strong style={{ color: '#1B264F' }}>ORCID :</strong> <br/> <a href={settings["orcid_id"] && settings["orcid_id"].startsWith("http") ? settings["orcid_id"] : `https://orcid.org/${settings["orcid_id"] || "0000-0002-6377-0948"}`} target="_blank" rel="noopener noreferrer" style={{ color: '#5061C4', textDecoration: 'none', fontWeight: '500' }}>{settings["orcid_id"] || "0000-0002-6377-0948"}</a>
              </p>
              <p style={{ margin: '8px 0' }}>
                <strong style={{ color: '#1B264F' }}>IRINS :</strong> {settings["irins_id"] || "121293"}
              </p>
              <p style={{ margin: '8px 0' }}>
                <strong style={{ color: '#1B264F' }}>Google Scholar :</strong> <a href={settings["google_scholar"] || "https://scholar.google.com/citations?user=UFEg3xUAAAAJ&hl=en"} target="_blank" rel="noopener noreferrer" style={{ color: '#5061C4', textDecoration: 'none', fontWeight: '500' }}>View Profile</a>
              </p>
              <p style={{ margin: '8px 0' }}>
                <strong style={{ color: '#1B264F' }}>Scopus ID :</strong> <a href={settings["scopus_id"] && settings["scopus_id"].startsWith("http") ? settings["scopus_id"] : `https://www.scopus.com/authid/detail.uri?authorId=${settings["scopus_id"] || "57216082742"}`} target="_blank" rel="noopener noreferrer" style={{ color: '#5061C4', textDecoration: 'none', fontWeight: '500' }}>{settings["scopus_id"] || "57216082742"}</a>
              </p>
              <p style={{ margin: '8px 0' }}>
                <strong style={{ color: '#1B264F' }}>Service Period at CUJ :</strong> {settings["service_period"] || "12.03.2020 to Current"}
                <br/><span style={{ fontSize: '0.9rem', color: '#888' }}>(Total Experience: {getExperienceYears()} Years)</span>
              </p>
            </div>
          </div>
          
          {/* Responsive CSS for Profile Card */}
          <style dangerouslySetInnerHTML={{__html: `
            @media (max-width: 900px) {
              .profile-card {
                grid-template-columns: 1fr !important;
                gap: 25px !important;
                padding: 25px !important;
              }
              .profile-card > div:first-child {
                border-right: none !important;
                border-bottom: 1px solid #eee !important;
                padding: 0 0 25px 0 !important;
              }
            }
          `}} />
        </div>
      </section>

      {/* Expertise Section */}
      <section className="home-expertise section-padding bg-light">
        <div className="container animate-on-scroll">
          <h2 className="section-title">Areas of Expertise</h2>
          <ul className="skills-list">
            {courses.length > 0 ? (
              courses.map(course => (
                <li key={course.id}>
                  {course.syllabusUrl ? (
                    <a href={course.syllabusUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
                      {course.name}
                    </a>
                  ) : (
                    course.name
                  )}
                </li>
              ))
            ) : (
              <p style={{ textAlign: 'center', width: '100%' }}>Loading expertise...</p>
            )}
          </ul>
        </div>
      </section>

      <section className="full-page">
        {/* Introduction Section */}
        <section className="horizontal">
          <section className="home-intro section-padding">
            <div className="container animate-on-scroll">
              <h2 className="section-title">A Leader in Management &amp; Marketing Research</h2>
              <p className="intro-text">
                With over 25 years of experience, Prof. (Dr.) Bhagwan Singh is a distinguished academic with extensive
                experience in teaching, research, and administrative leadership. As the former Dean at the Central
                University of Jharkhand and the Founder Dean at the Central University of Himachal Pradesh, he has been
                instrumental in shaping modern management education in India.
              </p>
              <div className="text-center">
                <Link href="/about" className="cta-button">Read Full Biography</Link>
              </div>
            </div>
          </section>

          {/* Publications Preview Section */}
          <section className="home-publications section-padding">
            <div className="container animate-on-scroll">
              <h2 className="section-title">Featured Publications</h2>
              <div className="publications-grid">
                <div className="publication-card">
                  <h4>Drone Delivery Services</h4>
                  <p>Investigating user acceptance of drone-based food delivery services in India. Published in the British Food Journal (2024).</p>
                </div>
                <div className="publication-card">
                  <h4>Green Consumption</h4>
                  <p>A study on the effect of green marketing stimuli on consumer behavior in the Indian market. Published in Society and Business Review (2021).</p>
                </div>
                <div className="publication-card">
                  <h4>CRISP Research Model</h4>
                  <p>Presenting a new structured approach for the presentation of research, theses, and projects, now adopted by universities across India.</p>
                </div>
              </div>
              <div className="text-center section-cta">
                <Link href="/publications" className="cta-button">View All Publications</Link>
              </div>
            </div>
          </section>
        </section>
      </section>

      <section className="developers-section section-padding bg-light">
        <div className="container animate-on-scroll">
          <h2 className="section-title">Web Development Team</h2>
          <p className="intro-text text-center">
            Designed and developed by the students of Central University of Jharkhand.
          </p>

          <div className="developers-grid">
            <div className="developer-card">
              <div className="dev-avatar">👨‍💻</div> <h4>Student Name</h4>
              <p className="dev-role">Frontend Developer</p>
              <p className="dev-dept">Dept. of Computer Science</p>
            </div>

            <div className="developer-card">
              <div className="dev-avatar">🎨</div>
              <h4>Student Name</h4>
              <p className="dev-role">UI/UX Designer</p>
              <p className="dev-dept">Dept. of Management</p>
            </div>

            <div className="developer-card">
              <div className="dev-avatar">⚙️</div>
              <h4>Student Name</h4>
              <p className="dev-role">Backend Developer</p>
              <p className="dev-dept">Dept. of Computer Science</p>
            </div>
          </div>
        </div>
      </section>
      {/* ========== NEW HOME PAGE SECTIONS END ========== */}
    </main>
  );
}