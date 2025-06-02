import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

import { useState } from "react";
import { DataTablePagination } from "@/components/DataTablePagination";
import { DataTableToolbar } from "@/pages/products/DataTableToolbar";
import { useProductsQuery } from "@/api/product.api";
import { DataTableSkeleton } from "@/components/DataTableSkeleton";
import { columns } from "@/pages/products/columns";
import { useNavigate } from "react-router-dom";

const ProductList: React.FC = () => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const searchFilter =
    globalFilter.length == 0
      ? { id: "", value: null }
      : { id: "search", value: globalFilter };

  const productsQuery = useProductsQuery({
    pagination,
    sorting,
    columnFilters: [searchFilter, ...columnFilters]
  });

  const pageCount = Math.ceil(
    (productsQuery.data?.total || 0) / pagination.pageSize
  );

  const table = useReactTable({
    data: productsQuery.data?.data || [],
    columns: columns(pagination.pageIndex, pagination.pageSize),
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      columnFilters,
      pagination
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: (newGlobalFilter) => {
      setGlobalFilter(newGlobalFilter);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    onColumnFiltersChange: (newColumnFilters) => {
      setColumnFilters(newColumnFilters);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    pageCount: pageCount
  });

  const navigate = useNavigate();
  const handleRowClick = (productId: string, event: React.MouseEvent) => {
    // Check if the click was on an interactive element (e.g., button, dropdown)
    const isInteractiveElement = (event.target as HTMLElement).closest(
      "button, a, [role='button'], [role='menuitem']"
    );

    // Only navigate if the click was not on an interactive element
    if (!isInteractiveElement) {
      navigate(`/products/${productId}`);
    }
  };

  const columnsArray = table.getAllColumns();

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {productsQuery.isPending ? (
              <DataTableSkeleton columns={columnsArray.length} />
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer"
                  onClick={(event) => handleRowClick(row.original._id, event)}
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
                  colSpan={columnsArray.length}
                  className="h-24 text-center"
                >
                  {productsQuery.isError
                    ? "Error fetching data"
                    : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
};

export default ProductList;
