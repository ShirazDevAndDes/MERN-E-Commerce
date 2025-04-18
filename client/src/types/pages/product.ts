import { FormImageType } from "../forms";

export type PriceType = {
  min: number;
  max: number;
};

export type FilterProductsType = {
  category: string;
  price: PriceType;
};

export type ProductFormInputType = {
  image: FormImageType | string;
  name: string;
  description: string;
  bgColor: string;
  price: string;
  category?: string;
  available_quantity: string;
  currency?: string;
};

export interface ProductEditFormInputType extends ProductFormInputType {
  id: string;
  image_url?: string;
}

export interface ProductDataType
  extends Omit<ProductEditFormInputType, "image" | "id"> {
  id?: string;
  image: {
    asset_id?: string;
    public_id?: string;
    format?: string;
    resource_type?: string;
    secure_url: string;
  };
}

export type ProductsDataType = {
  products: ProductDataType[];
  totalPages: number;
  currentPage: number;
};

export type ProductCardType = {
  image: string;
  data: Omit<ProductDataType, "image">;
  link?: string;
  addToCartBtn?: boolean;
};
