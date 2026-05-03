import Image from "next/image";

export type TransactionType = "transfer-in" | "transfer-out" | "wallet";

export interface Transaction {
  id: string;
  name: string;
  date: string;
  amount: string;
  positive: boolean;
  type: TransactionType;
}

function StatusIcon({ type }: { type: TransactionType }) {
  if (type === "wallet") {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
        <Image
          src="/icons/transactions.svg"
          alt="Wallet"
          width={14}
          height={14}
          className="opacity-70"
        />
      </div>
    );
  }
  if (type === "transfer-in") {
    return (
      <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center shrink-0">
        <Image
          src="/icons/import.svg"
          alt="Received"
          width={14}
          height={14}
          className="opacity-70"
        />
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
      <Image
        src="/icons/export.svg"
        alt="Sent"
        width={14}
        height={14}
        className="opacity-70"
      />
    </div>
  );
}

export default function TransactionRow({ tx }: { tx: Transaction }) {
  return (
    <div className="flex items-center gap-3 py-3 px-1 hover:bg-gray-50 rounded-lg transition-colors">
      <StatusIcon type={tx.type} />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-gray-900 truncate">
          {tx.name}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5">{tx.date}</p>
      </div>
      <span
        className={`text-[13px] font-semibold font-mono whitespace-nowrap ${
          tx.positive ? "text-green-500" : "text-gray-900"
        }`}
      >
        {tx.amount}
      </span>
    </div>
  );
}
