import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  loading: false,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications(state, action) {
      state.notifications = action.payload;
    },
    markAsRead(state, action) {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification) {
        notification.read = true;
      }
    },
    markAllAsRead(state) {
      state.notifications.forEach((n) => {
        n.read = true;
      });
    },
    addNotification(state, action) {
      state.notifications.unshift(action.payload);
    },
    removeNotification(state, action) {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      );
    },
  },
});

export const {
  setNotifications,
  markAsRead,
  markAllAsRead,
  addNotification,
  removeNotification,
} = notificationSlice.actions;

export const selectUnreadCount = (state) =>
  state.notifications.notifications.filter((n) => !n.read).length;

export default notificationSlice.reducer;
