import { createSlice } from "@reduxjs/toolkit";
import { currentUser } from "../../mock/users";

const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  rememberMe: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    register(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setRememberMe(state, action) {
      state.rememberMe = action.payload;
    },
    updateProfile(state, action) {
      state.user = { ...state.user, ...action.payload };
    },
    clearError(state) {
      state.error = null;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  register,
  logout,
  setRememberMe,
  updateProfile,
  clearError,
} = authSlice.actions;

// Thunks
export const performLogin = (credentials) => (dispatch) => {
  dispatch(loginStart());
  // Simulate API call
  setTimeout(() => {
    if (credentials.email && credentials.password) {
      dispatch(
        loginSuccess({
          user: currentUser,
          token: "mock-jwt-token-" + Date.now(),
        })
      );
    } else {
      dispatch(loginFailure("Invalid email or password"));
    }
  }, 800);
};

export const performRegister = (data) => (dispatch) => {
  dispatch(loginStart());
  setTimeout(() => {
    const newUser = {
      ...currentUser,
      name: data.name,
      email: data.email,
      id: "u-" + Date.now(),
    };
    dispatch(register({ user: newUser, token: "mock-jwt-token-" + Date.now() }));
  }, 800);
};

export default authSlice.reducer;
