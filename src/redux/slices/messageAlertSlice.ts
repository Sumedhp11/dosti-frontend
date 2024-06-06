import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatNotification {
  chatId: string;
  message: string;
}

interface MessageAlertState {
  chats: ChatNotification[];
  onlineUsers: string[];
}

const initialState: MessageAlertState = {
  chats: [],
  onlineUsers: [],
};

const messageAlertSlice = createSlice({
  name: "messageAlertSlice",
  initialState,
  reducers: {
    getMessageNotificationAlerts: (
      state,
      action: PayloadAction<ChatNotification>
    ) => {
      state.chats = [...state.chats, action.payload];
    },
    clearMessageNotifications: (state, action: PayloadAction<string>) => {
      state.chats = state.chats.filter(
        (chat) => chat.chatId !== action.payload
      );
    },
    addOnlineUserIds: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = [...state.onlineUsers, ...action.payload];
    },
    removeOnlineUserId: (state, action: PayloadAction<string>) => {
      state.onlineUsers = state.onlineUsers.filter(
        (userId) => userId !== action.payload
      );
    },
  },
});

export const {
  getMessageNotificationAlerts,
  clearMessageNotifications,
  addOnlineUserIds,
  removeOnlineUserId,
} = messageAlertSlice.actions;

export default messageAlertSlice.reducer;
