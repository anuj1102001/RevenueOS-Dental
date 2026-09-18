'use client';
import { FormEvent, useEffect, useRef, useState } from 'react';
type Msg = {role:'assistant'|'user';content:string};
export default function SmileConcierge() {
  const [messages,setMessages] = useState<Msg[]>([{role:'assistant',content:'Welcome to Precision Reimagined, an independent demo. I can help you explore this experience and the consultation process. Where would you like to begin?'}]);
  const [input,setInput] = useState('');
  const [loading,setLoading] = useState(false);
  const [mode,setMode] = useState('Independent demo');
  const log = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  useEffect(() => { if (log.current) log.current.scrollTop = log.current.scrollHeight; }, [messages,loading]);
  async function send(text: string) {
    if (!text.trim() || busy.current) return;
    busy.current = true;
    const next: Msg[] = [...messages,{role:'user',content:text.trim()}];
    setMessages(next);setInput('');setLoading(true);
    try {
      const r = await fetch('/api/concierge',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:next.slice(-20)})});
      if (!r.ok) throw new Error();
      const d = await r.json();
      if (typeof d.reply !== 'string') throw new Error();
      setMode(d.mode === 'ai' ? 'AI responses · Independent demo' : 'Guided demo · AI not connected');
      setMessages([...next,{role:'assistant',content:d.reply}]);
    } catch {setMessages([...next,{role:'assistant',content:'The concierge is unavailable right now. Please try again, or use “Explore a consultation” below to continue.'}]);}
    finally {setLoading(false);busy.current = false;}
  }
  function submit(e: FormEvent) {e.preventDefault();void send(input);}
  return <div className="clinic-chat"><div className="concierge-chat-head"><span className="concierge-avatar" aria-hidden="true">✧</span><div><strong>Smile Concierge</strong><small>{mode}</small></div></div><div className="conversation-log" ref={log} role="log" aria-label="Concierge conversation" aria-live="polite">{messages.map((m,i)=><div key={i} className={`conversation-message ${m.role}`}><span className="message-label">{m.role === 'user' ? 'YOU' : 'SMILE CONCIERGE'}</span>{m.content}</div>)}{loading && <div className="conversation-message" role="status">Preparing a response…</div>}</div><div className="quick-prompts">{['Explore treatments','How does this demo work?','Request a consultation'].map(p=><button key={p} disabled={loading} onClick={()=>void send(p)}>{p}</button>)}</div><form className="concierge-compose" onSubmit={submit}><input aria-label="Your question for the concierge" maxLength={2000} value={input} onChange={e=>setInput(e.target.value)} placeholder="What’s on your mind?"/><button type="submit" aria-label="Send message" disabled={loading || !input.trim()}>↑</button></form><div className="chat-footer"><span>Please don’t share health or personal details.</span><a href="#consult">Explore a consultation ↗</a></div></div>;
}
