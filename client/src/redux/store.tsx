import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";
import { createStateSyncMiddleware } from "redux-state-sync";
import cartSlice from "./slices/cartSlice";
import authSlice from "./slices/authSlice";

const reducers = combineReducers({
  cart: cartSlice,
  auth: authSlice,
});

const persistConfig = {
  key: "root",
  storage,
};

const middleware = [
  createStateSyncMiddleware({
    blacklist: ["persist/PERSIST", "persist/REHYDRATE"],
  }),
];

const persistedReducers = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducers,
  middleware: middleware,
});

export const persistor = persistStore(store);
