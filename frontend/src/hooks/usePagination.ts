"use client";

import { useState, useMemo } from "react";

interface UsePaginationOptions {
  /** Total number of items */
  totalItems: number;
  /** Items per page. Default: 12 */
  pageSize?: number;
  /** Initial page (1-indexed). Default: 1 */
  initialPage?: number;
}

interface UsePaginationReturn {
  /** Current page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Start index for slicing (0-indexed) */
  startIndex: number;
  /** End index for slicing (exclusive) */
  endIndex: number;
  /** Go to a specific page */
  goToPage: (page: number) => void;
  /** Go to next page */
  nextPage: () => void;
  /** Go to previous page */
  prevPage: () => void;
  /** Whether there is a next page */
  hasNext: boolean;
  /** Whether there is a previous page */
  hasPrev: boolean;
  /** Array of page numbers for rendering pagination controls */
  pageNumbers: number[];
}

/**
 * Pagination hook for publications, gallery, etc.
 *
 * @example
 * const { currentPage, totalPages, startIndex, endIndex, nextPage, prevPage } = usePagination({
 *   totalItems: publications.length,
 *   pageSize: 10,
 * });
 * const visibleItems = publications.slice(startIndex, endIndex);
 */
export function usePagination({
  totalItems,
  pageSize = 12,
  initialPage = 1,
}: UsePaginationOptions): UsePaginationReturn {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Clamp to valid range when totalItems changes
  const safePage = Math.min(currentPage, totalPages);
  if (safePage !== currentPage) setCurrentPage(safePage);

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const nextPage = () => goToPage(safePage + 1);
  const prevPage = () => goToPage(safePage - 1);

  const pageNumbers = useMemo(() => {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, safePage - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);
    start = Math.max(1, end - maxVisible + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [safePage, totalPages]);

  return {
    currentPage: safePage,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    prevPage,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
    pageNumbers,
  };
}
