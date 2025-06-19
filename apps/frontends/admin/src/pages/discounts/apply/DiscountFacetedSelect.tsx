import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import { cn } from "@/utils/cn";
import { Check, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

interface Props {
  options: { label: string; value: string }[];
  value: string | undefined;
  onChange: (val: string | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const DiscountFacetedSelect: React.FC<Props> = ({
  options,
  value,
  onChange,
  placeholder = "Select Discount",
  disabled
}) => {
  const [open, setOpen] = useState(false);

  const selectedLabel = useMemo(() => {
    return options.find((o) => o.value === value)?.label ?? "";
  }, [value, options]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          className="justify-between w-[220px]"
        >
          {value ? (
            <span>{selectedLabel}</span>
          ) : (
            <span className="text-muted-foreground text-sm">{placeholder}</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0" align="start">
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>No discount found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = value === option.value;
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100 text-primary" : "opacity-0"
                      )}
                    />
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
              {value && (
                <CommandItem
                  onSelect={() => {
                    onChange(undefined);
                    setOpen(false);
                  }}
                  className="justify-center text-center text-muted-foreground"
                >
                  Clear selection
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
