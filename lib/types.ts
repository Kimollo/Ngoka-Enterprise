export type Product = {
  id: string;
  category: string;
  name: string;
  price: number | null;
  currency: "R";
  unit: string;
  inStock: boolean;
  visible: boolean;
  note: string;
};

export type Catalog = {
  notice: string;
  updatedAt: string | null;
  products: Product[];
};

export type ProductUpdate = {
  id: string;
  price: number | null;
  unit: string;
  inStock: boolean;
  visible: boolean;
  note: string;
};
