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

import { useCuisinesQuery } from "@/api/cuisine";
import { DataTablePagination } from "@/components/DataTablePagination";
import { DataTableSkeleton } from "@/components/DataTableSkeleton";
import { DataTableToolbar } from "@/pages/cuisines/DataTableToolbar";
import { columns } from "@/pages/cuisines/columns";
import { useState } from "react";

const CuisineList: React.FC = () => {
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const searchFilter =
    globalFilter.length == 0
      ? { id: "", value: null }
      : { id: "search", value: globalFilter };

  const cuisinesQuery = useCuisinesQuery({
    pagination,
    sorting,
    columnFilters: [searchFilter, ...columnFilters]
  });

  const pageCount = Math.ceil(
    (cuisinesQuery.data?.total || 0) / pagination.pageSize
  );

  const table = useReactTable({
    data: cuisinesQuery.data?.data || [],
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
            {cuisinesQuery.isPending ? (
              <DataTableSkeleton columns={columns.length} />
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
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
                  {cuisinesQuery.isError
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

export default CuisineList;
