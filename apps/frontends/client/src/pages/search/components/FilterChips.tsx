// src/components/filters/FilterChips.tsx
import React from "react";

export interface FilterChipsProps {
  selected: string[];
  onRemove: (f: string) => void;
  onClear: () => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({
  selected,
  onRemove,
  onClear
}) => {
  if (!selected.length) return null;
  return (
    <div className="flex items-center flex-wrap gap-2">
      <span className="font-semibold">Filters:</span>
      {selected.map((f) => (
        <span
          key={f._id}
          className="flex items-center bg-gray-100 px-2 py-1 rounded"
        >
          {f.name}
          <button
            onClick={() => onRemove(f)}
            className="ml-1 text-gray-600 hover:text-gray-900"
          >
            ×
          </button>
        </span>
      ))}
      <button
        onClick={onClear}
        className="ml-4 text-sm underline text-gray-600 hover:text-gray-900"
      >
        Clear All
      </button>
    </div>
  );
};

export default FilterChips;
