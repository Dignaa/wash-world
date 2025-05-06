import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "@/store";
import { ExpenseEntity, NewExpenseEntity } from "./expensesEntities";

const URL = `${process.env.EXPO_PUBLIC_API_URL}expenses`;

export const fetchExpenses = createAsyncThunk("expenses/fetchAll", async (_, thunkAPI) => {
    const { getState, rejectWithValue } = thunkAPI;
    const state = getState() as RootState;
    const token = state.user.token;

    try {
        const response = await fetch(URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Fetch expenses failed:", error);
        return rejectWithValue("Failed to fetch expenses");
    }
});

export const createExpense = createAsyncThunk(
    "expenses/create",
    async (expense: NewExpenseEntity, thunkAPI) => {
        const { getState, rejectWithValue } = thunkAPI;
        const state = getState() as RootState;
        const token = state.user.token;

        try {
            const response = await fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(expense),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Create expense failed:", error);
            return rejectWithValue("Failed to create expense");
        }
    }
);

export const deleteExpense = createAsyncThunk("expenses/delete", async (id: number, thunkAPI) => {
    const { getState, rejectWithValue } = thunkAPI;
    const state = getState() as RootState;
    const token = state.user.token;

    try {
        const response = await fetch(`${URL}/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return id;
    } catch (error) {
        console.error("Delete expense failed:", error);
        return rejectWithValue("Failed to delete expense");
    }
});

interface ExpenseState {
    expenses: ExpenseEntity[];
}

const initialState: ExpenseState = {
    expenses: [],
};

const expensesSlice = createSlice({
    name: "expenses",
    initialState,
    reducers: {
        resetExpenses: (state) => {
            state.expenses = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchExpenses.fulfilled, (state, action) => {
                console.log("payload", action.payload);
                state.expenses = action.payload;
            })
            .addCase(fetchExpenses.rejected, (state, action) => {
                console.error("Error fetching expenses:", action.payload);
            })
            .addCase(createExpense.fulfilled, (state, action) => {
                console.log("payload", action.payload);
                state.expenses.unshift(action.payload);
            })
            .addCase(createExpense.rejected, (state, action) => {
                console.error("Error creating expense:", action.payload);
            })
            .addCase(deleteExpense.fulfilled, (state, action) => {
                console.log("Deleted expense ID", action.payload);
                state.expenses = state.expenses.filter((expense) => expense.id !== action.payload);
            })
            .addCase(deleteExpense.rejected, (state, action) => {
                console.error("Error deleting expense:", action.payload);
            });
    },
});

export const { resetExpenses } = expensesSlice.actions;

export default expensesSlice.reducer;
