"use client";

import { useState } from "react";

export function SocialSidebar() {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="social-sidebar">
      <a href="https://www.facebook.com/bhagwan.singh.338" target="_blank" rel="noopener noreferrer" className="social-icon facebook" aria-label="facebook">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
        </svg>
      </a>

      <a href="https://x.com/bhagwansingh_bs?s=20" target="_blank" rel="noopener noreferrer" className="social-icon x-twitter" aria-label="x">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
        </svg>
      </a>

      <a href="https://www.instagram.com/dr_bhagwan.singh.338/" target="_blank" rel="noopener noreferrer" className="social-icon instagram" aria-label="instagram">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      </a>
      
      <a href="https://www.instagram.com/dsmmclubcuj?igsh=azV6OG8zeGR3cDg4" target="_blank" rel="noopener noreferrer" className="social-icon instagram" aria-label="DSMM Club Instagram" title="DSMM Club CUJ">
        {!imgError ? (
          <img 
            src="/media/img/logo/462412614_432696082765765_3122521385722262254_n.jpg" 
            className="icon-club" 
            alt="club" 
            onError={() => setImgError(true)}
          />
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: "20px", height: "20px" }}>
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        )}
      </a>
    </div>
  );
}