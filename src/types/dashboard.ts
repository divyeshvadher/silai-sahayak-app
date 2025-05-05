
export type Order = {
  id: string;
  customer_name: string;
  garment_type: string;
  due_date: string;
  status: "pending" | "in-progress" | "completed" | "delivered";
};

export type OrderStats = {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
};

export type InventoryItem = {
  id: number;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
};
