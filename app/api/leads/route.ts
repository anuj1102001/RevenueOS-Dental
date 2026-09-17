import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isStaff } from "@/lib/staff-auth";

const LeadSchema = z.object({
  name: z.string().min(2).max(80),
  phone: z.string().min(7).max(30),
  email: z.string().email().optional().or(z.literal("")),
  treatment: z.string().min(2).max(80),
  preferredTime: z.string().max(100).optional(),
  consent: z.literal(true),
});

export async function POST(request: Request) {
  try {
    const data = LeadSchema.parse(await request.json());
    const lead = await prisma.lead.create({
      data: {
        ...data,
        email: data.email || null,
        temperature: "HOT",
        status: "CONSULTATION_REQUESTED",
      },
    });
    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError)
      return NextResponse.json(
        {
          ok: false,
          error: "Please check your details.",
          issues: error.issues,
        },
        { status: 400 },
      );
    return NextResponse.json(
      { ok: false, error: "Unable to save your request." },
      { status: 500 },
    );
  }
}

export async function GET() {
  if (!(await isStaff()))
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: { "Cache-Control": "no-store" } },
    );
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json(leads, {
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to load enquiries." },
      { status: 503 },
    );
  }
}
