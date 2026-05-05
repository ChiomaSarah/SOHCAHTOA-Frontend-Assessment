"use client";

import { useEffect, useState, useCallback } from "react";
import {
  setLoading,
  setError,
  setTransactions,
  setPagination,
  setFilters,
  setPage,
} from "@/app/appStore/transactionsSlice";
import VisaCard from "@/components/VisaCard";
import TransactionRow from "@/components/TransactionRow";
import { Plus, ChevronDown, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { useTransactionStream } from "../hooks/useTransactionStream";
import TransactionPanel from "@/components/TransactionDetailsPanel";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../appStore/store";
import { Transaction } from "@/interface";
import { Pagination } from "@/components/Pagination";

const fxTabs = ["All", "FX", "PTA", "BTA", "Medicals"];
const headerTabs = ["FX bought", "FX sold", "Others"];

const Dashboard = () => {
  const [activeHeaderTab, setActiveHeaderTab] = useState("FX bought");
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [cardTransactions, setCardTransactions] = useState<Transaction[]>([]);
  const { items, pagination, filters, loading, error } = useSelector(
    (state: RootState) => state.transactions,
  );
  const dispatch = useDispatch();

  useTransactionStream();

  useEffect(() => {
    async function fetchCardTransactions() {
      const res = await fetch("/api/transactions?channel=card&limit=3", {
        credentials: "include",
      });
      if (res.status === 401) {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setCardTransactions(data.transactions);
      }
    }
    fetchCardTransactions();
  }, []);

  const fetchTransactionsData = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const params = new URLSearchParams();
      params.set("page", String(pagination.page));
      params.set("limit", String(pagination.limit));
      params.set("sortBy", filters.sortBy);
      params.set("sortOrder", filters.sortOrder);

      if (filters.status) params.set("status", filters.status);
      if (filters.category) params.set("category", filters.category);
      if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
      if (filters.dateTo) params.set("dateTo", filters.dateTo);

      const res = await fetch(`/api/transactions?${params.toString()}`, {
        credentials: "include",
      });

      if (res.status === 401) {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to fetch transactions!");
      }

      const data = await res.json();
      dispatch(setTransactions(data.transactions));
      dispatch(setPagination(data.pagination));
    } catch (err) {
      dispatch(setError((err as Error).message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, filters, pagination.page, pagination.limit]);

  useEffect(() => {
    fetchTransactionsData();
  }, [fetchTransactionsData]);

  function handleCategoryFilter(tab: string) {
    dispatch(setFilters({ category: tab === "All" ? "" : tab }));
  }

  function handleSort(sortBy: string) {
    if (filters.sortBy === sortBy) {
      dispatch(
        setFilters({
          sortBy,
          sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
        }),
      );
    } else {
      dispatch(setFilters({ sortBy, sortOrder: "desc" }));
    }
  }

  function handlePageChange(newPage: number) {
    dispatch(setPage(newPage));
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-4 lg:gap-6 h-full">
      {/* LEFT COLUMN */}
      <div className="flex flex-col gap-4 lg:gap-6 overflow-auto">
        {/* FX Header Card */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
            {headerTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveHeaderTab(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap ${activeHeaderTab === tab ? "bg-orange-50 text-orange-500 border-orange-300" : "bg-transparent text-gray-500 border-gray-200 hover:bg-gray-50"}`}
              >
                {tab}
              </button>
            ))}
            <div className="ml-auto shrink-0 relative">
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
                  style={{ width: "auto", height: "auto" }}
                />
                <span>USD</span>
                <ChevronDown
                  size={12}
                  className={`transition-transform ${currencyOpen ? "rotate-180" : ""}`}
                />
              </button>
              {currencyOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 min-w-[120px]">
                  {["USD", "NGN", "EUR"].map((currency) => (
                    <button
                      key={currency}
                      onClick={() => setCurrencyOpen(false)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50"
                    >
                      {currency}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-gray-700">Total FX units</p>
              <button
                onClick={() => setBalanceVisible(!balanceVisible)}
                className="text-gray-900 hover:text-gray-600 transition-colors"
              >
                {balanceVisible ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
            <h1 className="text-[32px] sm:text-[42px] font-bold text-gray-900 tracking-tight leading-none flex items-baseline">
              {balanceVisible ? (
                <>
                  <span className="inline-flex items-center justify-center px-2 py-1 rounded-full bg-gray-100 text-lg sm:text-xl font-bold text-gray-900 mr-1.5 self-center">
                    $
                  </span>
                  67,048
                  <span className="text-[18px] sm:text-[24px] font-normal text-gray-900 ml-0.5">
                    .00
                  </span>
                </>
              ) : (
                <span className="text-xl sm:text-2xl font-normal text-gray-900">
                  ****
                </span>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {[
              { src: "/icons/wallet-minus.svg", label: "Buy FX" },
              { src: "/icons/wallet-add.svg", label: "Sell FX" },
              { src: "/icons/import.svg", label: "Receive money" },
            ].map(({ src, label }) => (
              <button
                key={label}
                className="flex flex-col items-center justify-center gap-1.5 w-[68px] h-[68px] sm:w-[72px] sm:h-[72px] rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Image
                  src={src}
                  alt={label}
                  width={20}
                  height={20}
                  className="opacity-70"
                />
                <span className="text-[11px] sm:text-xs text-gray-800 font-medium leading-tight text-center whitespace-normal max-w-[56px] sm:max-w-[60px]">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 flex-1">
          <div className="flex items-center justify-between mb-5 gap-1">
            <h2 className="text-sm font-medium text-gray-900 whitespace-nowrap">
              FX transactions
            </h2>

            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              <button
                onClick={() => handleSort("date")}
                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap leading-none flex items-center"
              >
                Date{" "}
                {filters.sortBy === "date"
                  ? filters.sortOrder === "desc"
                    ? "↓"
                    : "↑"
                  : ""}
              </button>

              <button
                onClick={() => handleSort("amount")}
                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap leading-none flex items-center"
              >
                Amount{" "}
                {filters.sortBy === "amount"
                  ? filters.sortOrder === "desc"
                    ? "↓"
                    : "↑"
                  : ""}
              </button>

              <button
                className="flex items-center justify-center bg-transparent text-gray-700 border-gray-200 hover:bg-gray-50 px-2 py-1 rounded-full shadow-sm text-sm font-medium border cursor-pointer leading-none"
                title="See all"
              >
                <span className="sm:hidden flex items-center">
                  <Eye size={16} />
                </span>
                <span className="hidden sm:inline text-xs font-medium whitespace-nowrap">
                  See all
                </span>
              </button>
            </div>
          </div>
          <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
            {fxTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => handleCategoryFilter(tab)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap shrink-0 ${
                  (tab === "All" && !filters.category) ||
                  filters.category === tab
                    ? "bg-orange-50 text-orange-500 border-orange-300"
                    : "bg-transparent text-gray-500 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && (
            <div className="py-8 text-center">
              <p className="text-sm text-red-500">{error}</p>
              <button
                onClick={fetchTransactionsData}
                className="mt-2 text-xs text-orange-500 hover:underline"
              >
                Try again
              </button>
            </div>
          )}

          {!loading && !error && items.length === 0 && (
            <div className="py-12 text-center">
              <p className="text-sm text-gray-400">No transactions found</p>
            </div>
          )}

          {!loading && !error && items.length > 0 && (
            <div className="space-y-1">
              {items.map((tx) => (
                <TransactionRow
                  key={tx.id}
                  tx={tx}
                  onClick={(tx) => setSelectedTx(tx)}
                />
              ))}
            </div>
          )}

          {!loading && pagination.totalPages > 1 && (
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.total}
              limit={pagination.limit}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="bg-white rounded-2xl p-2 sm:p-4 shadow-sm border border-gray-100 h-fit lg:sticky lg:top-6">
        <div className="bg-gray-50 rounded-xl p-2 sm:p-4 mb-2 sm:mb-3">
          <h2 className="text-sm text-gray-900 mb-2 sm:mb-3">Cards</h2>
          <div className="flex items-center gap-2">
            <VisaCard />
            <button className="self-stretch min-h-[48px] w-10 rounded-2xl border border-dashed border-gray-300 flex items-center justify-center hover:border-gray-400 transition-colors shrink-0">
              <Plus size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-2 sm:p-4 mb-2 sm:mb-3">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h2 className="text-sm text-gray-900">Card transactions</h2>
            <button className="flex items-center justify-center bg-transparent text-gray-700 border-gray-200 hover:bg-gray-50 px-2 py-1 rounded-full shadow-sm text-xs font-medium border cursor-pointer">
              See all
            </button>
          </div>
          <div className="space-y-1">
            {cardTransactions.map((tx) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-2 sm:p-4">
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h2 className="text-sm text-gray-900">
              <span className="hidden sm:inline">Card transaction flows</span>
              <span className="sm:hidden">Card flows</span>
            </h2>
            <div className="flex items-baseline">
              <span className="text-sm font-semibold text-gray-900">
                +$3,048
              </span>
              <span className="text-xs font-normal text-gray-900 ml-0.5">
                .00
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-[11px] text-gray-500">Money in</span>
                <span className="text-[11px] text-gray-900">$4,046.00</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[78%] bg-green-500 rounded-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-[11px] text-gray-500">Money out</span>
                <span className="text-[11px] text-gray-900">$1,046.00</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full w-[28%] bg-orange-500 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedTx && (
        <TransactionPanel
          transaction={selectedTx}
          onClose={() => setSelectedTx(null)}
        />
      )}
    </div>
  );
};

export default Dashboard;
