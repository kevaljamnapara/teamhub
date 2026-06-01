import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sidebarCollapsed: false,
  sidebarMobileOpen: false,
  theme: localStorage.getItem("teamhub-theme") || "system",
  loading: false,
  commandPaletteOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    setSidebarCollapsed(state, action) {
      state.sidebarCollapsed = action.payload;
    },
    toggleMobileSidebar(state) {
      state.sidebarMobileOpen = !state.sidebarMobileOpen;
    },
    setMobileSidebarOpen(state, action) {
      state.sidebarMobileOpen = action.payload;
    },
    setTheme(state, action) {
      state.theme = action.payload;
      localStorage.setItem("teamhub-theme", action.payload);
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setCommandPaletteOpen(state, action) {
      state.commandPaletteOpen = action.payload;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  toggleMobileSidebar,
  setMobileSidebarOpen,
  setTheme,
  setLoading,
  setCommandPaletteOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
