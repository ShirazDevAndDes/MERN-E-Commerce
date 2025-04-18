import { ProductDataType } from "../../pages/product";

export type CartInitialState = {
  items: { product: ProductDataType; quantity: number; price: number }[];
  subTotal: number;
  shipping: number;
};
