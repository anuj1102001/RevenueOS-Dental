'use client';
import { FormEvent, useState } from 'react';

export default function LeadForm(){
  const [state,setState]=useState<'idle'|'loading'|'done'|'error'>('idle');
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); setState('loading');
    const f=new FormData(e.currentTarget);
    const payload={name:f.get('name'),phone:f.get('phone'),email:f.get('email'),treatment:f.get('treatment'),preferredTime:f.get('preferredTime'),consent:f.get('consent')==='on'};
    try{const r=await fetch('/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)}); if(!r.ok)throw new Error(); setState('done');}catch{setState('error');}
  }
  if(state==='done')return <div className="card"><h3>Consultation requested.</h3><p className="muted">Thank you. Your request has been captured in this RevenueOS demo.</p></div>;
  return <form className="card" onSubmit={submit}>
    <h3>Request a consultation</h3>
    <p className="muted">Demo flow — no appointment is confirmed until a clinic team accepts it.</p>
    <p><input name="name" required placeholder="Full name" /></p>
    <p><input name="phone" required placeholder="Phone / WhatsApp" /></p>
    <p><input name="email" type="email" placeholder="Email (optional)" /></p>
    <p><select name="treatment" defaultValue="Smile makeover"><option>Smile makeover</option><option>Dental implants</option><option>Clear aligners</option><option>Teeth whitening</option><option>General consultation</option></select></p>
    <p><input name="preferredTime" placeholder="Preferred day / time" /></p>
    <label className="consent"><input name="consent" type="checkbox" required/> I agree to be contacted about this consultation request.</label>
    {state==='error'&&<p className="error">We couldn't save the request. Please try again.</p>}
    <button className="button" disabled={state==='loading'}>{state==='loading'?'Sending…':'Request consultation'}</button>
  </form>;
}