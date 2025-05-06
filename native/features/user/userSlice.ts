import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { NewUserEntity, UserEntity } from "./userEntities";
import * as SecureStore from "expo-secure-store";
import { resetExpenses } from "../expenses/expensesSlice";
import { resetCategories } from "../categories/categoriesSlice";

const URL = process.env.EXPO_PUBLIC_API_URL;

export const fetchUser = createAsyncThunk(
    "users",
    async (id: number, thunkAPI) => {
        try {
            const response = await fetch(`${URL}/${id}`, {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Fetch categories failed:", error);
            return thunkAPI.rejectWithValue("Failed to fetch categories");
        }
    }
);

export const signUp = createAsyncThunk(
    "auth/signup",
    async (user: NewUserEntity, thunkAPI) => {
        try {
            const response = await fetch(`${URL}auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            const data = await response.json();

            if (!response.ok) {
                return thunkAPI.rejectWithValue(
                    data?.message?.[0] || "Signup failed"
                );
            }
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue("Error");
        }
    }
);

export const signIn = createAsyncThunk(
    "auth/signin",
    async (user: NewUserEntity, thunkAPI) => {
        try {
            const response = await fetch(`${URL}auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });
            const data = await response.json();

            if (!response.ok) {
                return thunkAPI.rejectWithValue(
                    data?.message || "Login failed"
                );
            }
            return data;
        } catch (error) {
            return thunkAPI.rejectWithValue("Failed to log in user.");
        }
    }
);

export const logoutUser = createAsyncThunk(
    "user/logout",
    async (_, { dispatch }) => {
        await SecureStore.setItemAsync("jwt", "");
        dispatch(resetExpenses());
        dispatch(resetCategories());
    }
);

interface UserState {
    token: string;
    user: UserEntity | undefined;
    errormessage: string;
}

const initialState: UserState = {
    token: "",
    user: undefined,
    errormessage: "",
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        reloadJwtFromStorage: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(logoutUser.fulfilled, (state) => {
                state.token = "";
                state.user = undefined;
            })
            .addCase(signIn.fulfilled, (state, action) => {
                console.log("signIn payload: ", action.payload.token);
                SecureStore.setItemAsync(
                    "jwt",
                    JSON.stringify(action.payload.token)
                );
                state.token = action.payload.token;
                state.errormessage = "";
            })
            .addCase(signIn.rejected, (state, action) => {
                state.errormessage =
                    (action.payload as string) || "Failed to log in user";
            })
            .addCase(signUp.fulfilled, (state, action) => {
                state.user = action.payload;
                state.errormessage = "";
            })
            .addCase(signUp.rejected, (state, action) => {
                console.error(action.payload);
                state.errormessage =
                    (action.payload as string) || "Failed to sign up user";
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                console.log("payload", action.payload);
                state.user = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                console.error("Error signing up:", action.payload);
            });
    },
});

export const { reloadJwtFromStorage } = userSlice.actions;

export default userSlice.reducer;
