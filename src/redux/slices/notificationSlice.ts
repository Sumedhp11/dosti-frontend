import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notificationSlice",
  initialState: {
    NotificationCount: 0,
  },
  reducers: {
    IncrementNotificationCount: (state) => {
      state.NotificationCount = state.NotificationCount + 1;
    },
    clearNotificationCount: (state) => {
      state.NotificationCount = 0;
    },
  },
});
export const { IncrementNotificationCount, clearNotificationCount } =
  notificationSlice.actions;
export default notificationSlice.reducer;
