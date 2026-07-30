import Link from 'next/link';
import { Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#1B264F', color: '#fff', paddingTop: '60px', paddingBottom: '20px' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '40px' }}>
        
        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', fontWeight: 'bold' }}>Prof. (Dr.) Bhagwan Singh</h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
            Distinguished Professor of Management at Central University of Jharkhand. Mentoring the next generation of leaders.
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', fontWeight: 'bold' }}>Quick Links</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li><Link href="/about" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>About</Link></li>
            <li><Link href="/publications" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Publications</Link></li>
            <li><Link href="/gallery" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Gallery</Link></li>
            <li><Link href="/alumni" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Alumni Connect</Link></li>
            <li><Link href="/ecrrb" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>Ethical Committee</Link></li>
          </ul>
        </div>

        <div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', fontWeight: 'bold' }}>Contact Info</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', color: 'rgba(255,255,255,0.7)' }}>
              <MapPin size={20} style={{ flexShrink: 0, marginTop: '4px' }} />
              <span>Department of Business Administration,<br/>Central University of Jharkhand</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.7)' }}>
              <Mail size={20} />
              <a href="mailto:bhagwan.singh@cuj.ac.in" style={{ color: 'inherit', textDecoration: 'none' }}>bhagwan.singh@cuj.ac.in</a>
            </li>
          </ul>
        </div>

      </div>
      
      <div className="container" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()} Prof. (Dr.) Bhagwan Singh. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}