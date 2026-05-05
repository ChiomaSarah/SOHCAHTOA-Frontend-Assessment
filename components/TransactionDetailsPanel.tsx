"use client";

import { useState } from "react";
import { updateTransaction } from "@/app/appStore/transactionsSlice";
import { X, Flag, FileText, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/appStore/store";
import { TransactionDetailsPanelProps } from "@/interface";

const formatAmount = (amount: number): string => {
  const abs = Math.abs(amount).toFixed(2);
  return amount < 0 ? `-$${abs}` : `+$${abs}`;
};

const TransactionDetailsPanel = ({
  transaction,
  onClose,
}: TransactionDetailsPanelProps) => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === "admin";
  const [note, setNote] = useState(transaction.note ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const isLiveTransaction = transaction.id.startsWith("live_");

  async function handleFlag() {
    if (!isAdmin) return;
    setError("");
    setSuccess("");
    setLoading(true);

    const previousStatus = transaction.status;

    dispatch(updateTransaction({ id: transaction.id, status: "flagged" }));

    try {
      const response = await fetch(`/api/transactions/${transaction.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status: "flagged" }),
      });

      if (!response.ok) {
        // Rollback on failure.
        dispatch(
          updateTransaction({ id: transaction.id, status: previousStatus }),
        );
        setError("Failed to flag transaction. Please try again.");
        return;
      }

      setSuccess("Transaction flagged successfully.");
    } catch {
      // Rollback on failure.
      dispatch(
        updateTransaction({ id: transaction.id, status: previousStatus }),
      );
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveNote() {
    setError("");
    setSuccess("");
    setLoading(true);

    const previousNote = transaction.note;

    dispatch(updateTransaction({ id: transaction.id, note }));

    try {
      const response = await fetch(`/api/transactions/${transaction.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ note }),
      });

      if (!response.ok) {
        // Rollback on failure.
        dispatch(updateTransaction({ id: transaction.id, note: previousNote }));
        setError("Failed to save note. Please try again.");
        return;
      }

      setSuccess("Note saved successfully.");
    } catch {
      dispatch(updateTransaction({ id: transaction.id, note: previousNote }));
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const positive = transaction.amount > 0;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">
            Transaction details
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 border-b border-gray-100">
          <p
            className={`text-3xl font-bold ${positive ? "text-green-500" : "text-gray-900"}`}
          >
            {formatAmount(transaction.amount)}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(transaction.date).toLocaleString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>

        <div className="p-6 border-b border-gray-100 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Transaction name</span>
            <span className="text-xs font-medium text-gray-900">
              {transaction.name}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Type</span>
            <span className="text-xs font-medium text-gray-900 capitalize">
              {transaction.type}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Category</span>
            <span className="text-xs font-medium text-gray-900">
              {transaction.category}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Status</span>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                transaction.status === "completed"
                  ? "bg-green-50 text-green-600"
                  : transaction.status === "failed"
                    ? "bg-red-50 text-red-600"
                    : transaction.status === "flagged"
                      ? "bg-orange-50 text-orange-600"
                      : "bg-gray-50 text-gray-600"
              }`}
            >
              {transaction.status}
            </span>
          </div>
          {transaction.cardNumber && (
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400">Card</span>
              <span className="text-xs font-medium text-gray-900 font-mono">
                •••• •••• •••• {transaction.cardNumber.slice(-4)}
              </span>
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col gap-4 flex-1">
          {/* Flag — admin only */}
          {isAdmin && (
            <div>
              <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                <Flag size={12} />
                Flag transaction
              </p>
              <button
                onClick={handleFlag}
                disabled={
                  loading ||
                  transaction.status === "flagged" ||
                  isLiveTransaction
                }
                className="w-full py-2.5 rounded-xl border border-orange-200 bg-orange-50 text-orange-600 text-xs font-semibold hover:bg-orange-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {transaction.status === "flagged"
                  ? "Already flagged"
                  : isLiveTransaction
                    ? "Cannot flag live transactions"
                    : "Flag this transaction"}
              </button>
            </div>
          )}

          {!isAdmin && (
            <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl">
              <AlertCircle size={14} className="text-gray-400 shrink-0" />
              <p className="text-xs text-gray-400">
                Only admins can flag transactions.
              </p>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
              <FileText size={12} />
              Internal note
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add an internal note..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-xs text-gray-900 outline-none focus:border-orange-400 focus:bg-white transition-all resize-none placeholder:text-gray-400"
            />
            <button
              onClick={handleSaveNote}
              disabled={loading}
              className="w-full mt-2 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save note"}
            </button>
          </div>

          {error && <p className="text-xs text-red-500 text-center">{error}</p>}
          {success && (
            <p className="text-xs text-green-500 text-center">{success}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDetailsPanel;
