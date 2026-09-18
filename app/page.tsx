import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import '@fontsource/dm-sans/latin-400.css';
import '@fontsource/dm-sans/latin-500.css';
import '@fontsource/dm-sans/latin-600.css';
import Link from 'next/link';
import SmileConcierge from '@/components/SmileConcierge';
import LeadForm from '@/components/LeadForm';
import ClinicNav from '@/components/ClinicNav';
import './clinic.css';

const treatments = [
  { number: '01', name: 'Smile design', detail: 'A smile that feels like you.', text: 'Start a conversation about the look you have in mind, from subtle refinements to a broader smile makeover.', tag: 'AESTHETIC DENTISTRY', shape: 'smile' },
  { number: '02', name: 'Dental implants', detail: 'Explore your next chapter.', text: 'Discuss missing teeth and the questions you want answered at an individual consultation.', tag: 'RESTORATIVE DENTISTRY', shape: 'arch' },
  { number: '03', name: 'Clear aligners', detail: 'Make room for possibilities.', text: 'Explore orthodontic care with a dentist who can assess your needs and explain the available options.', tag: 'ORTHODONTICS', shape: 'orbit' },
];

export default function Home() {
  return <div className="clinic-site">
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="concept-ribbon">A private vision for Precision Dental Clinic, Dubai <span>Independent demo · Not the official clinic website</span></div>
    <ClinicNav />
    <main id="main-content">
      <section className="clinic-shell editorial-hero">
        <div className="hero-copy"><p className="kicker">PRECISION REIMAGINED / DUBAI</p><h1>Your smile.<br />Your story.<br /><em>Beautifully considered.</em></h1><p className="hero-description">A more personal beginning to your dental journey. Explore your options, ask your questions, and take the next step at your own pace.</p><div className="hero-actions"><a className="c-button" href="#consult">Explore a consultation <span aria-hidden="true">↗</span></a><a className="c-text-link" href="#concierge">Meet your Smile Concierge <span aria-hidden="true">→</span></a></div><div className="hero-footnote"><span className="small-star" aria-hidden="true">✳</span><span>Thoughtful questions.<br />A clearer next step.</span></div></div>
        <div className="hero-art" role="img" aria-label="Abstract champagne sculpture of two flowing arcs, inspired by a smile">
          <div className="art-grid" /><span className="art-caption">THE ART OF A PERSONAL APPROACH</span>
          <svg className="smile-sculpture" viewBox="0 0 600 650" aria-hidden="true"><defs><linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#514330"/><stop offset=".23" stopColor="#b9a47e"/><stop offset=".47" stopColor="#f4e5c8"/><stop offset=".68" stopColor="#b6a080"/><stop offset="1" stopColor="#57432c"/></linearGradient><linearGradient id="metal2"><stop stopColor="#8d785a"/><stop offset=".5" stopColor="#e9d9b8"/><stop offset="1" stopColor="#aa9270"/></linearGradient><filter id="shadow"><feDropShadow dx="0" dy="28" stdDeviation="18" floodOpacity=".2"/></filter></defs><g filter="url(#shadow)" transform="rotate(-18 300 330)"><path d="M110 210 C95 485 440 530 492 245 C430 418 183 430 110 210Z" fill="url(#metal)"/><path d="M140 165 C175 340 388 365 462 195 C410 408 179 398 140 165Z" fill="url(#metal2)"/><path d="M110 210 C183 430 430 418 492 245" fill="none" stroke="#fff4df" strokeWidth="2" opacity=".65"/></g></svg>
          <div className="art-bottom"><span>01 — A NEW PERSPECTIVE</span><span className="art-monogram">P<span>R</span></span></div>
        </div>
      </section>
      <div className="values-strip clinic-shell"><span>Personal by design</span><span>Clarity before commitment</span><span>Care begins with a conversation</span></div>
      <section id="treatments" className="clinic-section clinic-shell">
        <div className="section-heading"><div><p className="kicker">01 / EXPLORE THE POSSIBILITIES</p><h2>Different journeys.<br /><em>One personal approach.</em></h2></div><p>Start with what matters to you. Every treatment journey begins with an assessment by a qualified dentist.</p></div>
        <div className="treatment-grid">{treatments.map(t => <article className="treatment-card" key={t.number}><div className={`treatment-art ${t.shape}`} aria-hidden="true"><span>{t.number}</span><i/><i/><i/></div><div className="treatment-copy"><p className="kicker">{t.tag}</p><h3>{t.name}</h3><p className="treatment-detail">{t.detail}</p><p>{t.text}</p><a className="c-text-link" href="#consult">Explore a consultation <span aria-hidden="true">↗</span></a></div></article>)}</div>
        <p className="section-note">Illustrative treatment categories for this proposal. Services, suitability and availability must be confirmed with the clinic.</p>
      </section>
      <section className="journey-section"><div className="clinic-shell journey-layout"><div><p className="kicker">02 / AT YOUR PACE</p><h2>A little clarity.<br /><em>A confident next step.</em></h2><p className="journey-intro">You don’t need to have all the answers before you begin.</p><a className="c-text-link" href="#concierge">Start with a question <span aria-hidden="true">↗</span></a></div><ol className="journey-steps"><li><span>01</span><div><h3>Tell us what’s on your mind.</h3><p>Explore a treatment category or ask how the consultation journey works.</p></div></li><li><span>02</span><div><h3>Share your preferences.</h3><p>Choose your area of interest and a convenient time for a conversation.</p></div></li><li><span>03</span><div><h3>Let a human take it from here.</h3><p>In a clinic deployment, the team reviews the enquiry and confirms the next step. This demo does not book appointments.</p></div></li></ol></div></section>
      <section id="concierge" className="clinic-section concierge-section"><div className="clinic-shell concierge-layout"><div className="concierge-copy"><p className="kicker">03 / YOUR SMILE CONCIERGE</p><h2>Every good journey<br />starts with<br /><em>a conversation.</em></h2><p>A place for your first questions. Explore the experience, understand the next step, and move to a consultation request when you’re ready.</p><div className="concierge-features"><span>Ask in your own words</span><span>Explore without pressure</span><span>Keep a human in the loop</span></div><p className="concierge-disclaimer">Independent demonstration. General service navigation only; not clinical advice or emergency care.</p></div><SmileConcierge /></div></section>
      <section className="clinic-section clinic-shell faq-section"><div><p className="kicker">A FEW THINGS TO KNOW</p><h2>Before you<br /><em>take the next step.</em></h2></div><div className="faq-list"><details><summary>Is this Precision Dental Clinic’s official website?</summary><p>No. Precision Reimagined is an independent design and technology proposal for Precision Dental Clinic in Dubai. It is not affiliated with or endorsed by the clinic.</p></details><details><summary>Does submitting this form book an appointment?</summary><p>No. It creates a demonstration enquiry in RevenueOS. No appointment is booked, no clinic is notified, and no automated follow-up is sent.</p></details><details><summary>Can the concierge recommend a treatment?</summary><p>The concierge helps you navigate the experience. A qualified dentist must assess your needs and discuss treatment suitability, costs and outcomes.</p></details><details><summary>What information should I share?</summary><p>Use fictional contact details while exploring this demo. Please do not submit medical records, clinical images or other sensitive health information.</p></details></div></section>
      <section id="consult" className="consult-section"><div className="clinic-shell consult-layout"><div><p className="kicker">04 / YOUR NEXT CHAPTER</p><h2>Let’s begin<br />with <em>you.</em></h2><p>A few details. A clear next step.<br />Experience how an enquiry reaches the team.</p><div className="demo-note"><span aria-hidden="true">↗</span><p><strong>You’re exploring a demo.</strong><br />Please use fictional details. This request stays in the demonstration dashboard and is not sent to Precision Dental Clinic.</p></div></div><LeadForm /></div></section>
    </main>
    <footer className="clinic-footer clinic-shell"><div className="footer-top"><Link className="clinic-wordmark" href="/">PRECISION<span>REIMAGINED</span></Link><p>A thoughtful first impression.<br />A connected patient journey.</p><Link className="c-text-link" href="/dashboard">RevenueOS owner access ↗</Link></div><div className="footer-bottom"><span>Independent proposal · Dubai</span><span>Built with RevenueOS</span><span>Not an official clinic website</span></div></footer>
  </div>;
}
