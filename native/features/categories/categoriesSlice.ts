import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CategoryEntity, NewCategoryEntity } from "./categoriesEntities";
import { RootState } from "@/store";

const URL = `${process.env.EXPO_PUBLIC_API_URL}categories`;

export const fetchCategories = createAsyncThunk("categories/fetchAll", async (_, thunkAPI) => {
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
        console.error("Fetch categories failed:", error);
        return rejectWithValue("Failed to fetch categories");
    }
});

export const createCategory = createAsyncThunk(
    "categories/create",
    async (category: NewCategoryEntity, thunkAPI) => {
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
                body: JSON.stringify(category),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Create category failed:", error);
            return rejectWithValue("Failed to create category");
        }
    }
);

export const deleteCategory = createAsyncThunk(
    "categories/delete",
    async (id: number, thunkAPI) => {
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
            console.error("Delete category failed:", error);
            return rejectWithValue("Failed to delete category");
        }
    }
);

interface CategoryState {
    categories: CategoryEntity[];
}

const initialState: CategoryState = {
    categories: [],
};

const categoriesSlice = createSlice({
    name: "categories",
    initialState,
    reducers: {
        resetCategories: (state) => {
            state.categories = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.fulfilled, (state, action) => {
                console.log("payload", action.payload);
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                console.error("Error fetching categories:", action.payload);
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                console.log("payload", action.payload);
                state.categories.unshift(action.payload);
            })
            .addCase(createCategory.rejected, (state, action) => {
                console.error("Error creating category:", action.payload);
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                console.log("Deleted category ID", action.payload);
                state.categories = state.categories.filter(
                    (category) => category.id !== action.payload
                );
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                console.error("Error deleting category:", action.payload);
            });
    },
});

export const { resetCategories } = categoriesSlice.actions;

export default categoriesSlice.reducer;
