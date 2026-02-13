import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/axios.js";

const initialState = { value: null };

// Async thunk to fetch user data
export const fetchUser = createAsyncThunk("user/fetchUser", async (token) => {
  const { data } = await api.get("/api/user/data", {
    headers: { Authorization: token },
  });

  return data.success ? data.data : null;
});

// Async thunk to update user data
export const updateUser = createAsyncThunk(
  "user/updateUser",
  async ({ token, userData }) => {
    const {data} = await api.post("/api/user/update", userData, {
      headers: { Authorization: token },
    });

    return data.success ? data.data : null;
  },
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.value = action.payload;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.value = action.payload;
      });
  },
});

export default userSlice.reducer;
