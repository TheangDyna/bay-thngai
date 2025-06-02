import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "./ui/table";
import React from "react";

interface DataTableSkeletonProps {
  columns: number;
}

export const DataTableSkeleton: React.FC<DataTableSkeletonProps> = ({
  columns
}) => {
  return (
    <>
      {Array.from({ length: 10 }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((_, cellIndex) => (
            <TableCell key={cellIndex}>
              <Skeleton className="h-4 w-full my-2" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};
