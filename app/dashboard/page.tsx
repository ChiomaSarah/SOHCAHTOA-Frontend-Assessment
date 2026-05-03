"use client";

import { useState } from "react";
import VisaCard from "@/components/VisaCard";
import TransactionRow, { Transaction } from "@/components/TransactionRow";
import { Plus, ChevronDown, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

const fxTransactions: Transaction[] = [
  {
    id: "1",
    name: "Transfer to Ruth",
    date: "Fri, Apr 18, 2025 · 7:32PM",
    amount: "-$7.64",
    positive: false,
    type: "transfer-out",
  },
  {
    id: "2",
    name: "Transfer from Tobi",
    date: "Sat, Mar 2, 2025 · 6:59AM",
    amount: "$3.00",
    positive: true,
    type: "transfer-in",
  },
  {
    id: "3",
    name: "Transfer to Esrael",
    date: "Sat, Mar 2, 2025 · 10:08AM",
    amount: "-$200",
    positive: false,
    type: "transfer-out",
  },
  {
    id: "4",
    name: "Wallet to wallet",
    date: "Mon, Feb 19, 2025 · 4:27PM",
    amount: "-$10.53",
    positive: false,
    type: "wallet",
  },
  {
    id: "5",
    name: "Transfer from Tochukwu",
    date: "Tue, Feb 7, 2025 · 11:50PM",
    amount: "$850.89",
    positive: true,
    type: "transfer-in",
  },
];

const cardTransactions: Transaction[] = [
  {
    id: "c1",
    name: "Transfer to Ruth",
    date: "Fri, Apr 18, 2025 · 7:32PM",
    amount: "-$7.64",
    positive: false,
    type: "transfer-out",
  },
  {
    id: "c2",
    name: "Wallet to wallet",
    date: "Sat, Mar 2, 2025 · 8:12AM",
    amount: "-$14",
    positive: false,
    type: "wallet",
  },
  {
    id: "c3",
    name: "Transfer from Tochukwu",
    date: "Tue, Feb 7, 2025 · 11:50PM",
    amount: "$850.89",
    positive: true,
    type: "transfer-in",
  },
];

const fxTabs = ["All", "FX", "PTA", "BTA", "Medicals"];
const headerTabs = ["FX bought", "FX sold", "Others"];

export default function Dashboard() {
  const [activeFxTab, setActiveFxTab] = useState("All");
  const [activeHeaderTab, setActiveHeaderTab] = useState("FX bought");
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);

  return (
    <div className="grid grid-cols-[1fr_auto] gap-6 h-full">
      {/* LEFT COLUMN */}
      <div className="flex flex-col gap-6 overflow-auto">
        {/* FX Header Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          {/* Header Tabs */}
          <div className="flex items-center gap-2 mb-6">
            {headerTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveHeaderTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${activeHeaderTab === tab ? "bg-orange-50 text-orange-500 border-orange-300" : "bg-transparent text-gray-500 border-gray-200 hover:bg-gray-50"}`}
              >
                {tab}
              </button>
            ))}
            <div className="ml-auto relative">
              <button
                onClick={() => setCurrencyOpen(!currencyOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-900 text-white text-xs font-medium"
              >
                <Image
                  src="/icons/flag.svg"
                  alt="US Flag"
                  width={16}
                  height={12}
                  className="rounded-sm object-cover"
                />
                <span>USD</span>
                <ChevronDown
                  size={12}
                  className={`transition-transform ${currencyOpen ? "rotate-180" : ""}`}
                />
              </button>
              {currencyOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 min-w-[120px]">
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">
                    <Image
                      src="/icons/flag.svg"
                      alt="US"
                      width={16}
                      height={12}
                      className="rounded-sm"
                    />{" "}
                    USD
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">
                    <span className="w-4 h-3 rounded-sm bg-green-600 inline-block" />{" "}
                    NGN
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50">
                    <span className="w-4 h-3 rounded-sm bg-blue-600 inline-block" />{" "}
                    EUR
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-gray-900">Total FX units</p>
              <button
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="text-gray-900 hover:text-gray-600 transition-colors"
              >
                {balanceVisible ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            <h1 className="text-[42px] font-bold text-gray-900 tracking-tight leading-none flex items-baseline">
              {balanceVisible ? (
                <>
                  <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-gray-100 text-xl font-bold text-gray-900 mr-1.5 self-center">
                    $
                  </span>
                  67,048
                  <span className="text-[24px] font-normal text-gray-900 ml-0.5">
                    .00
                  </span>
                </>
              ) : (
                <span className="text-2xl font-normal text-gray-900">****</span>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {[
              { src: "/icons/wallet-minus.svg", label: "Buy FX" },
              { src: "/icons/wallet-add.svg", label: "Sell FX" },
              { src: "/icons/import.svg", label: "Receive money" },
            ].map(({ src, label }) => (
              <button
                key={label}
                className="flex flex-col items-center justify-center gap-1.5 w-[72px] h-[72px] rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Image
                  src={src}
                  alt={label}
                  width={20}
                  height={20}
                  className="opacity-70"
                />
                <span className="text-xs text-gray-800 font-medium leading-tight text-center whitespace-normal max-w-[60px]">
                  {label}
                </span>{" "}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-gray-900">
              FX transactions
            </h2>
            <button className="bg-transparent text-gray-700 border-gray-200 hover:bg-gray-50 px-3 py-1 rounded-full shadow-sm text-sm font-medium border cursor-pointer">
              See all
            </button>
          </div>
          <div className="flex gap-2 mb-5">
            {fxTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFxTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${activeFxTab === tab ? "bg-orange-50 text-orange-500 border-orange-300" : "bg-transparent text-gray-500 border-gray-200 hover:bg-gray-50"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="space-y-1">
            {fxTransactions.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 h-fit sticky top-6">
        <div className="bg-gray-50 rounded-xl p-4 mb-3">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">Cards</h2>
          <div className="flex items-center gap-3">
            <VisaCard />
            <button className="h-[120px] w-12 rounded-2xl border-1 border-dashed border-gray-600 flex items-center justify-center hover:border-gray-700 transition-colors shrink-0">
              <Plus size={20} className="text-gray-700" />
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Card transactions
            </h3>
            <button className="bg-transparent text-gray-700 border-gray-200 hover:bg-gray-50 px-3 py-1 rounded-full shadow-sm text-sm font-medium border cursor-pointer">
              See all
            </button>
          </div>
          <div className="space-y-1">
            {cardTransactions.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">
              Card transaction flows
            </h3>
            <h1 className="text-[18px] font-bold text-gray-900 tracking-tight leading-none flex items-baseline">
              <span className="font-bold text-gray-900">+$</span>
              3,048
              <span className="text-[16px] font-normal text-gray-900 ml-0.5">
                .00
              </span>
            </h1>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[11px] text-gray-500">Money in</span>
                <span className="text-[11px] font-semibold text-gray-900 font-mono">
                  $4,046.00
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[78%] bg-green-500 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-[11px] text-gray-500">Money out</span>
                <span className="text-[11px] font-semibold text-gray-900 font-mono">
                  $1,046.00
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[28%] bg-orange-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
