import { configureStore } from "@reduxjs/toolkit";
import categoryReducer from "./features/categories/categoriesSlice";
import userReducer from "./features/user/userSlice";
import expenseReducer from "./features/expenses/expensesSlice";

export const store = configureStore({
    reducer: { category: categoryReducer, user: userReducer, expense: expenseReducer },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
