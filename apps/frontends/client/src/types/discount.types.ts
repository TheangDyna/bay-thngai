export interface Discount {
  _id: string;
  name: string;
  type: "flat" | "percentage";
  amount: number;
  startDate: string;
  endDate: string;
  active: boolean;
}
