import { db } from "@/config/db";
import { SessionTable } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, notes, createdBy, doctor } = body;
    const result = await db
      .insert(SessionTable)
      .values({
        sessionId,
        notes,
        createdBy,
        conversation: null,
        report: { doctor },
      })
      .returning();
    return NextResponse.json(result[0]);
  } catch (e) {
    return NextResponse.json({ error: e?.message || e });
  }
}
