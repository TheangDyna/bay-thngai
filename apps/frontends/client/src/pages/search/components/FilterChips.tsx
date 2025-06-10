import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cuisine } from "@/types/cuisine.types";
import { Label } from "@radix-ui/react-dropdown-menu";
import { X } from "lucide-react";
import React from "react";

interface FilterChipsProps {
  selected: Cuisine[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  selected,
  onRemove,
  onClear
}) => {
  if (!selected.length) return null;

  return (
    <div className="space-1">
      <div className="flex justify-between">
        <Label>Active Filters</Label>
        <Button variant="link" size="sm" onClick={onClear}>
          Clear All
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {selected.map((cuisine) => (
          <Badge
            key={cuisine._id}
            variant="outline"
            className="flex items-center"
          >
            {cuisine.name}
            <X
              className="ml-1 h-3 w-3 cursor-pointer"
              onClick={() => onRemove(cuisine._id)}
            />
          </Badge>
        ))}
      </div>
    </div>
  );
};
