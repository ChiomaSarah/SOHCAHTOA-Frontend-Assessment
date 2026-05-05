"use client";

import { useEffect } from "react";
import { upsertTransaction } from "@/app/appStore/transactionsSlice";
import { Transaction } from "@/interface";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/appStore/store";

export function useTransactionStream() {
  const dispatch = useDispatch();
  const page = useSelector(
    (state: RootState) => state.transactions.pagination.page,
  );

  useEffect(() => {
    const eventSource = new EventSource("/api/transactions/stream");

    eventSource.onmessage = (event) => {
      try {
        const transaction: Transaction = JSON.parse(event.data);
        if (page === 1) {
          dispatch(upsertTransaction(transaction));
        }
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
  }, [dispatch, page]);
}
