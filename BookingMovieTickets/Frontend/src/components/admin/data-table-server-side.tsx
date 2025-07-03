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

interface ServerODataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  initialData?: { value: TData[]; totalCount: number };
  searchKey?: string;
  searchPlaceholder?: string;
  pageSizeOptions?: number[];
  defaultPageSize?: number;
  onPaginationChange: (
    pageIndex: number, // 0-based
    pageSize: number
  ) => Promise<{ value: TData[]; totalCount: number }>;
  onSearchChange?: (
    searchTerm: string,
    pageIndex: number,
    pageSize: number
  ) => Promise<{ value: TData[]; totalCount: number }>;
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
}: ServerODataTableProps<TData, TValue>) {
  // State for the OData data
  const [odataData, setOdataData] = useState<{ value: TData[]; totalCount: number }>(
    initialData || { value: [], totalCount: 0 }
  );
  const [isLoading, setIsLoading] = useState(!initialData);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Initialize with default values or from initialData
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialData ? initialData.value.length : defaultPageSize,
  });

  // Handle search term debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { pageIndex, pageSize } = pagination;
        let response: { value: TData[]; totalCount: number };
        if (debouncedSearchTerm && onSearchChange) {
          response = await onSearchChange(debouncedSearchTerm, pageIndex, pageSize);
        } else {
          response = await onPaginationChange(pageIndex, pageSize);
        }
        setOdataData(response);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [pagination.pageIndex, pagination.pageSize, debouncedSearchTerm, onPaginationChange, onSearchChange]);

  // Set up the table
  const table = useReactTable({
    data: odataData.value || [],
    columns,
    pageCount: Math.ceil(odataData.totalCount / pagination.pageSize),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  });

  const totalPages = Math.ceil(odataData.totalCount / pagination.pageSize);
  const currentPage = pagination.pageIndex + 1;

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
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading data...
                  </div>
                </TableCell>
              </TableRow>
            ) : odataData.value?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination Controls */}
      {odataData && (
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
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={pagination.pageIndex === 0 || isLoading}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.previousPage()}
                disabled={pagination.pageIndex === 0 || isLoading}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="h-8 w-8 p-0"
                onClick={() => table.nextPage()}
                disabled={currentPage === totalPages || isLoading}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(totalPages - 1)}
                disabled={currentPage === totalPages || isLoading}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Pagination Summary */}
      {odataData && (
        <div className="text-sm text-muted-foreground">
          Showing {odataData.value.length} of {odataData.totalCount} items
        </div>
      )}
    </div>
  );
}
