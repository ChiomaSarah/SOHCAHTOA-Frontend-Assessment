import { NextRequest, NextResponse } from "next/server";
import { mockTransactions } from "@/lib/mockData";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, note } = body;

    if (!status && note === undefined) {
      return NextResponse.json(
        { error: "Nothing to update." },
        { status: 400 },
      );
    }

    const transaction = mockTransactions.find((t) => t.id === id);

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction not found!" },
        { status: 404 },
      );
    }

    if (status) transaction.status = status;
    if (note !== undefined) transaction.note = note;

    return NextResponse.json({ transaction });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
