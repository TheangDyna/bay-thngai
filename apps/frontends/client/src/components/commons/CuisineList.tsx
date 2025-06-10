import type { Cuisine } from "@/types/cuisine.types";
import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";

export interface CuisineFilterProps {
  selected: string[];
  onToggle: (cuisineName: string) => void;
}

export const CuisineFilter: React.FC<CuisineFilterProps> = ({
  selected,
  onToggle
}) => {
  const {
    data: cuisines,
    isLoading,
    isError
  } = useQuery<Cuisine[], Error>({
    queryKey: ["cuisines"],
    queryFn: () => axiosInstance.get("/cuisines").then((res) => res.data)
  });

  const base = "w-1/4 self-start sticky top-20 bg-white p-4";

  if (isLoading) {
    return (
      <aside className={base}>
        <Loader2 className="animate-spin mx-auto" size={24} />
      </aside>
    );
  }

  if (isError || !cuisines) {
    return (
      <aside className={base}>
        <p className="text-red-500">Failed to load filters.</p>
      </aside>
    );
  }

  return (
    <aside className={`${base} max-h-[calc(100vh-5rem)] overflow-y-auto`}>
      <h2 className="font-semibold mb-4">Filter by Cuisine</h2>
      <ul>
        {cuisines.data.map((c) => {
          const active = selected.includes(c.name);
          return (
            <li
              key={c._id}
              onClick={() => onToggle(c)}
              className={`flex items-center px-3.5 py-2 text-sm cursor-pointer border-b ${
                active ? "bg-green-50 font-medium" : "hover:bg-gray-100"
              }`}
            >
              <img
                src={c.image}
                alt={c.name}
                width={32}
                height={32}
                className="object-contain mr-3"
              />
              <span className="capitalize">{c.name}</span>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
