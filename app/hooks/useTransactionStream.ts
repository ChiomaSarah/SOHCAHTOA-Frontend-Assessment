"use client";

import { useEffect } from "react";
import { upsertTransaction } from "@/app/appStore/transactionsSlice";
import { Transaction } from "@/interface";
import { useDispatch } from "react-redux";

export function useTransactionStream() {
  const dispatch = useDispatch();

  useEffect(() => {
    const eventSource = new EventSource("/api/transactions/stream");

    eventSource.onmessage = (event) => {
      try {
        const transaction: Transaction = JSON.parse(event.data);
        dispatch(upsertTransaction(transaction));
      } catch {
        console.error("Failed to parse transaction stream event!");
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [dispatch]);
}
