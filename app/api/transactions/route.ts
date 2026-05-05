import { NextRequest, NextResponse } from "next/server";
import { mockTransactions } from "@/lib/mockData";

export async function GET(req: NextRequest) {
  try {
    const accessToken = req.cookies.get("accessToken")?.value;
    if (!accessToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") ?? "1");
    const limit = parseInt(searchParams.get("limit") ?? "10");
    const sortBy = searchParams.get("sortBy") ?? "date";
    const sortOrder = searchParams.get("sortOrder") ?? "desc";
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const channel = searchParams.get("channel");

    let filteredTX = [...mockTransactions];

    if (status) {
      filteredTX = filteredTX.filter((t) => t.status === status);
    }

    if (category) {
      filteredTX = filteredTX.filter((t) => t.category === category);
    }

    if (dateFrom) {
      filteredTX = filteredTX.filter(
        (t) => new Date(t.date) >= new Date(dateFrom),
      );
    }

    if (dateTo) {
      filteredTX = filteredTX.filter(
        (t) => new Date(t.date) <= new Date(dateTo),
      );
    }

    if (channel) {
      filteredTX = filteredTX.filter((t) => t.channel === channel);
    }

    filteredTX.sort((a, b) => {
      if (sortBy === "date") {
        const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
        return sortOrder === "desc" ? -diff : diff;
      }
      if (sortBy === "amount") {
        return sortOrder === "desc" ? b.amount - a.amount : a.amount - b.amount;
      }
      return 0;
    });

    const total = filteredTX.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginated = filteredTX.slice(start, start + limit);

    return NextResponse.json(
      {
        transactions: paginated,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
