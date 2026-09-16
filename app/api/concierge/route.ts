import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const Body = z.object({ messages: z.array(z.object({ role: z.enum(['user','assistant']), content: z.string().max(2000) })).max(20) });

const SYSTEM = `You are the Smile Concierge for an independent RevenueOS Dental sales demo. You help visitors navigate dental services and request consultations. Never diagnose, prescribe, determine medical suitability, promise outcomes, or replace a dentist. If a user reports severe swelling, uncontrolled bleeding, major trauma, difficulty breathing/swallowing, or another possible emergency, tell them to seek urgent in-person medical/dental care or local emergency services. Keep answers concise and premium. You may discuss general service categories such as veneers, whitening, implants and orthodontics, but explain that a dentist must assess suitability. When intent is clear, invite the visitor to request a consultation. Never claim this demo is officially affiliated with Precision Dental Clinic.`;

export async function POST(request: Request) {
  try {
    const { messages } = Body.parse(await request.json());
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({ reply: 'I can help you explore treatment categories and request a consultation. The live AI service is not configured in this demo yet.' });
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await client.chat.completions.create({ model: process.env.OPENAI_MODEL || 'gpt-4.1-mini', temperature: 0.3, max_tokens: 300, messages: [{ role: 'system', content: SYSTEM }, ...messages] });
    return NextResponse.json({ reply: completion.choices[0]?.message?.content || 'Would you like to request a consultation?' });
  } catch {
    return NextResponse.json({ reply: 'I can help with general service navigation and consultation requests. Please try again.' }, { status: 400 });
  }
}