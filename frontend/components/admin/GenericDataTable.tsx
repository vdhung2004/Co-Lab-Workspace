"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Column configuration for GenericDataTable
 * @template T - Data type
 */
export interface Column<T> {
  /** Field key from data object */
  key: keyof T;
  /** Display label for column header */
  label: string;
  /** Enable sorting on this column */
  sortable?: boolean;
  /** Custom render function for cell */
  render?: (row: T) => React.ReactNode;
  /** Width class (e.g., 'w-32', 'w-48') */
  width?: string;
}

/**
 * Row action configuration
 * @template T - Data type
 */
export interface Action<T> {
  /** Action label */
  label: string;
  /** Action handler */
  onClick: (row: T) => void;
}

/**
 * Props for GenericDataTable component
 * @template T - Data type extending base id
 */
export interface GenericDataTableProps<T extends { id: string | number }> {
  /** Array of data to display */
  data: T[];
  /** Column configuration array */
  columns: Column<T>[];
  /** Number of rows per page */
  pageSize?: number;
  /** Row actions (edit, delete, etc.) */
  actions?: Action<T>[];
  /** Custom filter UI component */
  filters?: React.ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Fields to search in global search */
  searchableFields?: (keyof T)[];
}

/**
 * Generic data table component with sorting, pagination, and search
 * Easy to integrate with API - just replace mock data with API call
 */
export function GenericDataTable<T extends { id: string | number }>({
  data,
  columns,
  pageSize = 10,
  actions = [],
  filters,
  loading = false,
  searchableFields = [],
}: GenericDataTableProps<T>) {
  const [sortField, setSortField] = useState<keyof T | null>(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Compute sorted and filtered data
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply search filter
    if (searchQuery && searchableFields.length > 0) {
      result = result.filter((item) =>
        searchableFields.some((field) => {
          const value = String(item[field] || "").toLowerCase();
          return value.includes(searchQuery.toLowerCase());
        })
      );
    }

    // Apply sorting
    if (sortField) {
      result.sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];

        // Handle different data types
        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        }
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortAsc ? aVal - bVal : bVal - aVal;
        }
        if (aVal instanceof Date && bVal instanceof Date) {
          return sortAsc
            ? aVal.getTime() - bVal.getTime()
            : bVal.getTime() - aVal.getTime();
        }
        return 0;
      });
    }

    return result;
  }, [data, sortField, sortAsc, searchQuery, searchableFields]);

  // Calculate pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleSort = (key: keyof T) => {
    if (sortField === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(key);
      setSortAsc(true);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Global Search */}
      {searchableFields.length > 0 && (
        <div className="flex gap-2">
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1"
          />
          {searchQuery && (
            <Button variant="outline" size="sm" onClick={handleClearSearch}>
              Clear
            </Button>
          )}
        </div>
      )}

      {/* Custom Filters */}
      {filters && (
        <div className="flex flex-col md:flex-row gap-4 justify-between">
          {filters}
        </div>
      )}

      {/* Results Info */}
      <div className="text-sm text-muted-foreground">
        Showing {paginatedData.length} of {processedData.length} items
        {data.length > processedData.length &&
          ` (filtered from ${data.length} total)`}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={String(col.key)} className={col.width}>
                  {col.sortable ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-8 hover:bg-transparent"
                      onClick={() => handleSort(col.key)}
                    >
                      <span className="flex items-center gap-1">
                        {col.label}
                        {sortField === col.key && (sortAsc ? "↑" : "↓")}
                      </span>
                    </Button>
                  ) : (
                    col.label
                  )}
                </TableHead>
              ))}
              {actions.length > 0 && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell>
                      <Skeleton className="h-4 w-8" />
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => (
                    <TableCell key={String(col.key)}>
                      {col.render ? col.render(row) : String(row[col.key])}
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            ⋯
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {actions.map((action) => (
                            <DropdownMenuItem
                              key={action.label}
                              onClick={() => action.onClick(row)}
                            >
                              {action.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                  className="text-center py-8 text-muted-foreground"
                >
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              First
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNum = i + 1;
              const isVisible =
                pageNum === 1 ||
                pageNum === totalPages ||
                Math.abs(pageNum - currentPage) <= 1;

              if (!isVisible && Math.abs(pageNum - currentPage) === 2) {
                return (
                  <span key={`ellipsis-${pageNum}`} className="px-2 py-1">
                    ⋯
                  </span>
                );
              }

              if (!isVisible) return null;

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              Last
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
