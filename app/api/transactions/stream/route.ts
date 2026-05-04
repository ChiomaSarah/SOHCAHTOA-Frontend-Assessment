import { NextRequest } from "next/server";
import { mockTransactions } from "@/lib/mockData";
import { Transaction } from "@/interface";

export async function GET(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;

  if (!accessToken) {
    return new Response("Unauthorized", { status: 401 });
  }

  let interval: ReturnType<typeof setInterval>;

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: Transaction) => {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      };

      // Send a new simulated transaction every 10 seconds.
      interval = setInterval(() => {
        const random =
          mockTransactions[Math.floor(Math.random() * mockTransactions.length)];

        const newTx: Transaction = {
          ...random,
          id: `live_${Date.now()}`,
          date: new Date().toISOString(),
        };

        send(newTx);
      }, 10000);
    },
    cancel() {
      clearInterval(interval);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
