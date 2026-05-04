import { Transaction } from "@/interface";
import Image from "next/image";

const formatAmount = (amount: number): string => {
  const displayAmount = Math.abs(amount).toFixed(2);
  return amount < 0 ? `-$${displayAmount}` : `$${displayAmount}`;
};

const StatusIcon = ({ type }: { type: Transaction["type"] }) => {
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
};

const TransactionRow = ({
  tx,
  onClick,
}: {
  tx: Transaction;
  onClick?: (tx: Transaction) => void;
}) => {
  const positive = tx.amount > 0;

  return (
    <div
      onClick={() => onClick?.(tx)}
      className={`flex items-start gap-3 py-3 px-1 rounded-lg transition-colors ${onClick ? "cursor-pointer hover:bg-gray-50" : ""}`}
    >
      <StatusIcon type={tx.type} />
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-gray-900 truncate">
          {tx.name}
        </p>
        <p className="text-[11px] text-gray-400 mt-0.5">
          {new Date(tx.date).toLocaleString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}
        </p>
      </div>
      <span
        className={`text-[13px] font-semibold whitespace-nowrap ${positive ? "text-green-500" : "text-gray-900"}`}
      >
        {formatAmount(tx.amount)}
      </span>
    </div>
  );
};

export default TransactionRow;
