"use client";

import { PaginationProps } from "@/interface";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const Pagination = ({
  page,
  totalPages,
  total,
  limit = 10,
  onPageChange,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (page > 3) {
        pages.push("...");
      }

      for (
        let i = Math.max(2, page - 1);
        i <= Math.min(totalPages - 1, page + 1);
        i++
      ) {
        pages.push(i);
      }

      if (page < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const start = (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 pt-4 border-t border-gray-100 gap-3">
      <p className="text-[11px] sm:text-xs text-gray-400">
        Showing <span className="text-gray-500 font-medium">{start}</span> to{" "}
        <span className="text-gray-500 font-medium">{end}</span> of{" "}
        <span className="text-gray-500 font-medium">{total}</span> transactions
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft size={14} className="text-gray-500" />
        </button>

        <div className="hidden sm:flex items-center gap-1">
          {getPageNumbers().map((pageNum, index) =>
            pageNum === "..." ? (
              <span
                key={`dots-${index}`}
                className="w-8 h-8 flex items-center justify-center text-xs text-gray-400"
              >
                ...
              </span>
            ) : (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs transition-colors ${
                  page === pageNum
                    ? "bg-orange-50 text-orange-500 font-medium"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                {pageNum}
              </button>
            ),
          )}
        </div>

        <span className="sm:hidden px-3 py-1 rounded-lg bg-orange-50 text-orange-500 text-xs font-medium">
          {page} of {totalPages}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight size={14} className="text-gray-500" />
        </button>
      </div>
    </div>
  );
};
