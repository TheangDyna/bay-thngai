// src/components/filters/SortSelect.tsx
import React from "react";

export interface SortSelectProps {
  value: string;
  onChange: (v: string) => void;
}

const OPTIONS = [
  { value: "lowest-price", label: "Lowest Price" },
  { value: "highest-price", label: "Highest Price" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" }
];

const SortSelect: React.FC<SortSelectProps> = ({ value, onChange }) => (
  <div className="flex items-center space-x-2">
    <label className="text-sm">Sort by:</label>
    <select
      className="border px-2 py-1 rounded text-sm"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">Relevance</option>
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

export default SortSelect;
