import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import React from "react";

export interface SortSelectProps {
  value: string;
  onChange: (v: string) => void;
}

const OPTIONS = [
  { value: "lowest-price", label: "Lowest Price" },
  { value: "highest-price", label: "Highest Price" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
  { value: "clear", label: "Clear selection" }
];

export const SortSelect: React.FC<SortSelectProps> = ({ value, onChange }) => (
  <Select
    value={value}
    onValueChange={(v) => {
      if (v === "clear") {
        onChange("");
      } else {
        onChange(v);
      }
    }}
  >
    <SelectTrigger className="w-[150px]">
      <SelectValue placeholder="Sort by..." />
    </SelectTrigger>
    <SelectContent>
      {OPTIONS.map((o) => (
        <SelectItem key={o.value} value={o.value}>
          {o.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
);
