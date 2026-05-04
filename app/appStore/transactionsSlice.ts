import {
  TransactionsState,
  Filters,
  Transaction,
  Pagination,
} from "@/interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: TransactionsState = {
  items: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  filters: {
    status: "",
    category: "",
    dateFrom: "",
    dateTo: "",
    sortBy: "date",
    sortOrder: "desc",
  },
  loading: false,
  error: null,
};

let abortController = new AbortController();

export function cancelAllRequests() {
  abortController.abort();
  abortController = new AbortController();
}

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    resetState: () => initialState,

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setFilters: (state, action: PayloadAction<Partial<Filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },

    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },

    setPagination: (state, action: PayloadAction<Pagination>) => {
      state.pagination = action.payload;
    },

    setTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.items = action.payload;
    },

    upsertTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.items.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      } else {
        state.items.unshift(action.payload);
      }
    },

    updateTransaction: (
      state,
      action: PayloadAction<Partial<Transaction> & { id: string }>,
    ) => {
      const index = state.items.findIndex((t) => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
  },
});

export const {
  resetState,
  setLoading,
  setError,
  setFilters,
  setPage,
  setPagination,
  setTransactions,
  upsertTransaction,
  updateTransaction,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
