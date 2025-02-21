"use client";

import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
  onItemsPerPageChange: (items: number) => void;
  totalItems: number;
  showItemsPerPage?: boolean;
  className?: string;
}

// const PAGE_ITEMS = [10, 20, 50, 100] as const;

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  totalItems,
  showItemsPerPage = true,
  className = "",
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);
    if (currentPage > 3) {
      pages.push("...");
    }

    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 3) {
      end = 4;
    }
    if (currentPage >= totalPages - 2) {
      start = totalPages - 3;
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-2 py-3 ${className}`}
    >
      {/* Items per page selector */}
      {/* {showItemsPerPage && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Show</span>
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="h-8 w-20 rounded border border-gray-300 bg-white px-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {PAGE_ITEMS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span className="text-gray-600">items</span>
        </div>
      )} */}

      {/* Results counter */}
      <div className="text-sm text-gray-600">
        Showing {startItem}-{endItem} of {totalItems} items
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            aria-label="First page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Page numbers */}
          <div className="flex items-center">
            {getPageNumbers().map((pageNum, idx) => (
              <React.Fragment key={idx}>
                {pageNum === "..." ? (
                  <div className="px-2">
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </div>
                ) : (
                  <button
                    onClick={() => onPageChange(pageNum as number)}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded text-sm 
                      ${
                        currentPage === pageNum
                          ? "bg-blue-500 text-white"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {pageNum}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-300 bg-white text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            aria-label="Last page"
          >
            <ChevronsRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
