'use client';
import { useState } from 'react';
export default function ClinicNav() {
  const [open, setOpen] = useState(false);
  return <header className="clinic-header"><div className="clinic-shell clinic-nav"><a className="clinic-wordmark" href="#main-content" aria-label="Precision Reimagined home">PRECISION<span>REIMAGINED</span></a><button className="menu-toggle" aria-expanded={open} aria-controls="clinic-navigation" onClick={() => setOpen(!open)}>{open ? 'Close −' : 'Menu +'}</button><nav id="clinic-navigation" className={open ? 'clinic-links is-open' : 'clinic-links'} aria-label="Main navigation" onKeyDown={e => {if(e.key === 'Escape') setOpen(false);}}><a href="#treatments" onClick={() => setOpen(false)}>Treatments</a><a href="#concierge" onClick={() => setOpen(false)}>Smile Concierge</a><a className="nav-consult" href="#consult" onClick={() => setOpen(false)}>Begin your journey ↗</a></nav></div></header>;
}
