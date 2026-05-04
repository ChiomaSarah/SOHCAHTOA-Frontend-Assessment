export interface TopBarProps {
  onMenuClick: () => void;
}

export interface SidebarProps {
  activeNav: string;
  onNavChange: (nav: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export type TransactionStatus = "completed" | "pending" | "failed" | "flagged";

export type TransactionType = "transfer-in" | "transfer-out" | "wallet";

export interface Transaction {
  id: string;
  name: string;
  date: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  category: "FX" | "PTA" | "BTA" | "Medicals";
  note?: string;
  cardNumber?: string;
}

export interface TransactionDetailsPanelProps {
  transaction: Transaction;
  onClose: () => void;
}

export interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Filters {
  status: string;
  category: string;
  dateFrom: string;
  dateTo: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
}

export interface TransactionsState {
  items: Transaction[];
  pagination: Pagination;
  filters: Filters;
  loading: boolean;
  error: string | null;
}

type Role = "admin" | "analyst";

export interface User {
  id: string;
  role: Role;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}
