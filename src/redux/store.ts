import { configureStore } from "@reduxjs/toolkit";
import notificationSlice from "./slices/notificationSlice";
import messageAlertSlice from "./slices/messageAlertSlice";
const store = configureStore({
  reducer: {
    notification: notificationSlice,
    messageAlert: messageAlertSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export default store;
