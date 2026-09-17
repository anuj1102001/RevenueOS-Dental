import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isStaff } from "@/lib/staff-auth";
import { sameOrigin } from "@/lib/staff-session";
import { leadStatuses, leadTemperatures } from "@/lib/lead-fields";
const Update = z
  .object({
    status: z.enum(leadStatuses),
    temperature: z.enum(leadTemperatures),
    notes: z.string().max(5000),
    followUpAt: z.string().datetime().nullable(),
    updatedAt: z.string().datetime(),
  })
  .strict();
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isStaff()))
    return NextResponse.json(
      { error: "Please sign in again." },
      { status: 401 },
    );
  if (!sameOrigin(request))
    return NextResponse.json(
      { error: "Request not allowed." },
      { status: 403 },
    );
  try {
    const { id } = await params;
    const { updatedAt, followUpAt, ...data } = Update.parse(
      await request.json(),
    );
    const result = await prisma.lead.updateMany({
      where: { id, updatedAt: new Date(updatedAt) },
      data: { ...data, followUpAt: followUpAt ? new Date(followUpAt) : null },
    });
    if (!result.count)
      return NextResponse.json(
        {
          error:
            "This enquiry changed in another window. Refresh before saving.",
        },
        { status: 409 },
      );
    return NextResponse.json(
      { ok: true },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (error instanceof z.ZodError || error instanceof SyntaxError)
      return NextResponse.json(
        { error: "Please check your details." },
        { status: 400 },
      );
    return NextResponse.json(
      { error: "Could not save changes. Please try again." },
      { status: 503 },
    );
  }
}
