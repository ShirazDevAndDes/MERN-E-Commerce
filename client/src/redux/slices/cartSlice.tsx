import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { ProductDataType } from "../../types/pages/product";
import { CartInitialState } from "../../types/redux/slices/cart";

const initialState: CartInitialState = {
  items: [],
  subTotal: 0,
  shipping: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearAll: () => initialState,
    addToCart: (state, action: PayloadAction<{ product: ProductDataType }>) => {
      const { items, subTotal } = state;
      const { product } = action.payload;
      // console.log(product);
      const itemIndex = items.findIndex(
        (item) => item.product.id === product.id
      );

      if (itemIndex > -1) {
        if (
          items[itemIndex].quantity + 1 <
          parseInt(product.available_quantity)
        ) {
          const totalPrice =
            parseInt(product.price) * items[itemIndex].quantity + 1;
          state.subTotal = totalPrice - (subTotal - items[itemIndex].price);

          state.items[itemIndex] = {
            ...items[itemIndex],
            quantity: items[itemIndex].quantity + 1,
            price: totalPrice,
          };

          // toast.info("Item Updated");
        } else {
          toast.error("No more items available");
        }
      } else {
        const totalPrice = parseInt(product.price) * 1;
        // console.log("Product: ", product);
        state.items.push({
          product,
          quantity: 1,
          price: totalPrice,
        });

        state.subTotal = subTotal + totalPrice;

        // toast.success("Item Added");
      }
    },
    addItem: (
      state,
      action: PayloadAction<{ product: ProductDataType; quantity: number }>
    ) => {
      const { items, subTotal } = state;
      const { product, quantity } = action.payload;
      // console.log(product);
      const itemIndex = items.findIndex(
        (item) => item.product.id === product.id
      );

      const totalPrice = parseInt(product.price) * quantity;

      if (itemIndex > -1) {
        state.subTotal = totalPrice - (subTotal - items[itemIndex].price);

        state.items[itemIndex] = {
          ...items[itemIndex],
          quantity,
          price: totalPrice,
        };

        toast.info("Item Updated");
      } else {
        // console.log("Product: ", product);
        state.items.push({
          product,
          quantity,
          price: totalPrice,
        });

        state.subTotal = subTotal + totalPrice;

        toast.success("Item Added");
      }
    },
    removeItem: (state, action: PayloadAction<{ id: string }>) => {
      const { items, subTotal } = state;
      const { id } = action.payload;

      const itemIndex = items.findIndex((obj) => obj.product.id === id);

      if (itemIndex > -1) {
        state.subTotal = subTotal - items[itemIndex].price;
        state.items.splice(itemIndex, 1);
        toast.error("Item Deleted");
      }
    },
    increaseQuantity: (state, action: PayloadAction<{ id: string }>) => {
      const { items } = state;
      const { id } = action.payload;

      const itemIndex = items.findIndex((obj) => obj.product.id === id);
      if (
        items[itemIndex].quantity <
        parseInt(items[itemIndex].product.available_quantity)
      ) {
        items[itemIndex].quantity = items[itemIndex].quantity + 1;
        items[itemIndex].price =
          parseInt(items[itemIndex].product.price) * items[itemIndex].quantity;
        state.subTotal = items.reduce((total, value, index, array) => {
          return total + value.price;
        }, 0);
        // toast.success("Item Quantity Increased");
      }
    },
    decreaseQuantity: (state, action: PayloadAction<{ id: string }>) => {
      const { items } = state;
      const { id } = action.payload;

      const itemIndex = items.findIndex((obj) => obj.product.id === id);

      if (itemIndex > -1) {
        items[itemIndex].quantity = items[itemIndex].quantity - 1;
        items[itemIndex].price =
          parseInt(items[itemIndex].product.price) * items[itemIndex].quantity;
        state.subTotal = items.reduce((total, value) => {
          return total + value.price;
        }, 0);
        // toast.success("Item Quantity Decreased");
      }
    },
  },
});

export const {
  clearAll,
  addToCart,
  addItem,
  removeItem,
  increaseQuantity,
  decreaseQuantity,
} = cartSlice.actions;

export const selectAllItems = (state: {
  cart: Pick<CartInitialState, "items">;
}) => state.cart.items;
export const itemsSubTotal = (state: {
  cart: Pick<CartInitialState, "subTotal">;
}) => state.cart.subTotal;
export const itemsShipping = (state: {
  cart: Pick<CartInitialState, "shipping">;
}) => state.cart.shipping;
export const itemsCount = (state: { cart: Pick<CartInitialState, "items"> }) =>
  state.cart.items.length;

export default cartSlice.reducer;
