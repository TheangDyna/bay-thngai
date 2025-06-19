import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { DiscountInput } from "@/types/discount.types";
import { cn } from "@/utils/cn";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

const renderDateTimePicker = (
  form: UseFormReturn<DiscountInput>,
  name: "startDate" | "endDate",
  label: string
) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => {
      const rawDate = field.value ? new Date(field.value) : undefined;
      const [localDate, setLocalDate] = useState<Date | undefined>(rawDate);
      const [localTime, setLocalTime] = useState(
        rawDate ? rawDate.toTimeString().slice(0, 8) : "00:00:00"
      );
      const [open, setOpen] = useState(false);

      useEffect(() => {
        const d = field.value ? new Date(field.value) : undefined;
        setLocalDate(d);
        setLocalTime(d ? d.toTimeString().slice(0, 8) : "00:00:00");
      }, [field.value]);

      const updateDateTime = (date: Date | undefined, timeStr: string) => {
        if (!date || !timeStr) return;
        const [hh, mm, ss] = timeStr.split(":").map(Number);
        date.setHours(hh, mm, ss, 0);
        field.onChange(date.toISOString());
      };

      return (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <div className="flex gap-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-48 justify-between font-normal",
                      !localDate && "text-muted-foreground"
                    )}
                  >
                    {localDate ? format(localDate, "PPP") : "Select date"}
                    <CalendarIcon className="ml-2 h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={localDate}
                  onSelect={(d) => {
                    setLocalDate(d || undefined);
                    updateDateTime(d || undefined, localTime);
                    setOpen(false);
                  }}
                  captionLayout="dropdown"
                />
              </PopoverContent>
            </Popover>

            <FormControl>
              <Input
                type="time"
                step="1"
                value={localTime}
                className="w-36"
                onChange={(e) => {
                  setLocalTime(e.target.value);
                  updateDateTime(localDate, e.target.value);
                }}
              />
            </FormControl>
          </div>
          <FormMessage />
        </FormItem>
      );
    }}
  />
);

export const DiscountFormFields = ({
  form
}: {
  form: UseFormReturn<DiscountInput>;
}) => {
  return (
    <>
      {/* Name */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Discount Name</FormLabel>
            <FormControl>
              <Input placeholder="Black Friday" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Type */}
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type</FormLabel>
            <Select value={field.value} onValueChange={field.onChange}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="flat">Flat ($)</SelectItem>
                <SelectItem value="percentage">Percentage (%)</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Amount */}
      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Amount</FormLabel>
            <FormControl>
              <Input
                type="number"
                value={
                  typeof field.value === "string"
                    ? field.value
                    : field.value?.toString()
                }
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value === "" ? "" : Number(value));
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Dates */}
      {renderDateTimePicker(form, "startDate", "Start Date")}
      {renderDateTimePicker(form, "endDate", "End Date")}

      {/* Active */}
      <FormField
        control={form.control}
        name="active"
        render={({ field }) => (
          <FormItem className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel>Status</FormLabel>
              <p className="text-sm text-muted-foreground">
                Enable or disable this discount
              </p>
            </div>
            <FormControl>
              <Switch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </FormItem>
        )}
      />
    </>
  );
};
