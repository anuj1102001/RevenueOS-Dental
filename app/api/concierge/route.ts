import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const Body = z.object({ messages: z.array(z.object({ role: z.enum(['user','assistant']), content: z.string().max(2000) })).max(20) });

const SYSTEM = `You are the Smile Concierge for an independent RevenueOS Dental sales demo. You help visitors navigate dental services and request consultations. Never diagnose, prescribe, determine medical suitability, promise outcomes, or replace a dentist. If a user reports severe swelling, uncontrolled bleeding, major trauma, difficulty breathing/swallowing, or another possible emergency, tell them to seek urgent in-person medical/dental care or local emergency services. Keep answers concise. Never invent clinic prices, opening hours, clinicians, availability, testimonials or treatment results. No appointment can be booked from this demo and no clinic is contacted. Ask users to use fictional details in the consultation form and not to share personal or health information in chat. You may discuss general service categories such as veneers, whitening, implants and orthodontics, but explain that a dentist must assess suitability. When intent is clear, invite the visitor to request a consultation. Never claim this demo is officially affiliated with Precision Dental Clinic.`;

export async function POST(request: Request) {
  try {
    const { messages } = Body.parse(await request.json());
    if (!process.env.OPENAI_API_KEY) {
      const question = [...messages].reverse().find(m => m.role === 'user')?.content.toLowerCase() || '';
      const reply = question.includes('treatment')
        ? 'This proposal illustrates smile design, dental implants and clear aligners. The clinic must confirm its services, and a dentist must assess suitability. You can explore the treatment cards or use the consultation form below. This is a preset demo response; live AI is not connected.'
        : question.includes('consultation') || question.includes('book')
        ? 'Choose “Explore a consultation” below this chat. Use fictional details to try the form: it saves an enquiry to the owner dashboard. It does not book an appointment or contact the clinic. This is a preset demo response.'
        : 'This independent demo connects a website enquiry form to an owner dashboard for reviewing enquiries, notes and follow-up dates. No appointments are booked or messages sent to the clinic. Live AI is not connected yet; these are preset demo responses.';
      return NextResponse.json({ reply, mode: 'demo' });
    }
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({ model: process.env.OPENAI_MODEL || 'gpt-4.1-mini', temperature: 0.3, max_tokens: 300, messages: [{ role: 'system', content: SYSTEM }, ...messages] });
    return NextResponse.json({ reply: completion.choices[0]?.message?.content || 'Would you like to request a consultation?', mode: 'ai' });
  } catch {
    return NextResponse.json({ reply: 'I can help with general service navigation and consultation requests. Please try again.' }, { status: 400 });
  }
}