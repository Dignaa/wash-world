import { deleteValue, getValue, saveValue } from '@/utils/secureStorage';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
  userId: number | null;
  username: string | null;
}

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
  userId: null,
  username: null,
};

type JwtPayload = {
  token: string;
  id: number;
  username: string;
};

interface LoggedInResponse {
  token: string;
  userId: number;
  username: string;
}

export const login = createAsyncThunk<
  LoggedInResponse,
  { email: string; password: string }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await fetch(process.env.EXPO_PUBLIC_API_URL + 'auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    console.log(data);
    if (!res.ok) throw new Error(data.message || 'Login failed');
    await saveValue('jwt', data.token);

    const decoded: JwtPayload = jwtDecode(data.token);

    return {
      token: data.token,
      userId: decoded.id,
      username: decoded.username,
    };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const signup = createAsyncThunk<
  string,
  { email: string; password: string }
>('auth/signup', async ({ email, password }, { rejectWithValue }) => {
  try {
    const res = await fetch(process.env.EXPO_PUBLIC_API_URL + 'auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Signup failed');
    await saveValue('jwt', data.token);
    return data.token;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const checkAuth = createAsyncThunk<LoggedInResponse, void>(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const token = await getValue('jwt');
      if (!token) throw new Error();

      const decoded: JwtPayload = jwtDecode(token);

      return {
        token: token,
        userId: decoded.id,
        username: decoded.username,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      deleteValue('jwt');
      state.token = null;
      state.userId = null;
      state.username = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<LoggedInResponse>) => {
          state.loading = false;
          state.token = action.payload.token;
          state.userId = action.payload.userId;
          state.username = action.payload.username;
        },
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Login failed';
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.token = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Signup failed';
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        checkAuth.fulfilled,
        (state, action: PayloadAction<LoggedInResponse>) => {
          state.loading = false;
          state.token = action.payload.token;
          state.userId = action.payload.userId;
          state.username = action.payload.username;
        },
      )
      .addCase(checkAuth.rejected, (state, action) => {
        state.loading = false;
        state.token = null;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
