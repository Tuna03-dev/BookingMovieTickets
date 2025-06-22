import { useState, useEffect } from "react";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type PaginationState,
} from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import type { PaginatedResponse } from "../../types/paginated-response";

interface ServerPaginatedTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  initialData?: PaginatedResponse<TData>;
  searchKey?: string;
  searchPlaceholder?: string;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  onPaginationChange: (
    pageNumber: number,
    pageSize: number
  ) => Promise<PaginatedResponse<TData>>;
  onSearchChange?: (
    searchTerm: string,
    pageNumber: number,
    pageSize: number
  ) => Promise<PaginatedResponse<TData>>;
}

export function DataTableServerSide<TData, TValue>({
  columns,
  initialData,
  searchKey,
  searchPlaceholder = "Search...",
  pageSizeOptions = [10, 20, 30, 50, 100],
  defaultPageSize = 10,
  onPaginationChange,
  onSearchChange,
}: ServerPaginatedTableProps<TData, TValue>) {
  // State for the paginated data
  const [paginatedData, setPaginatedData] =
    useState<PaginatedResponse<TData> | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Initialize with default values or from initialData
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: initialData ? initialData.pageNumber - 1 : 0, // Convert 1-based to 0-based
    pageSize: initialData?.pageSize || defaultPageSize,
  });

  // Handle search term debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);


  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Convert from 0-based to 1-based page number for the API
        const pageNumber = pagination.pageIndex + 1;
        const pageSize = pagination.pageSize;

        let response: PaginatedResponse<TData>;

        if (debouncedSearchTerm && onSearchChange) {
          response = await onSearchChange(
            debouncedSearchTerm,
            pageNumber,
            pageSize
          );
        } else {
          response = await onPaginationChange(pageNumber, pageSize);
        }

        setPaginatedData(response);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearchTerm,
    onPaginationChange,
    onSearchChange,
  ]);

  // Set up the table
  const table = useReactTable({
    data: paginatedData?.items || [],
    columns,
    pageCount: paginatedData?.totalPages || -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  return (
    <div className="space-y-4">
      {/* Search Input */}
      {searchKey && onSearchChange && (
        <div className="flex items-center">
          <Input
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="max-w-sm"
          />
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading data...
                  </div>
                </TableCell>
              </TableRow>
            ) : paginatedData?.items?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      {paginatedData && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <p className="text-sm text-muted-foreground">Rows per page</p>
            <Select
              value={`${pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value));
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {pageSizeOptions.map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex w-[100px] items-center justify-center text-sm font-medium">
              Page {paginatedData.pageNumber} of {paginatedData.totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!paginatedData.hasPreviousPage || isLoading}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={!paginatedData.hasPreviousPage || isLoading}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={!paginatedData.hasNextPage || isLoading}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(paginatedData.totalPages - 1)}
                disabled={!paginatedData.hasNextPage || isLoading}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Summary */}
      {paginatedData && (
        <div className="text-sm text-muted-foreground">
          Showing {paginatedData.items.length} of {paginatedData.totalItems}{" "}
          items
        </div>
      )}
    </div>
  );
}
