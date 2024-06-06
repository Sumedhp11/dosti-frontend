import axios from "axios";
import { SERVER_URL } from "./authAPI";

export const createChatAPI = async ({
  groupName,
  selectedUsers,
}: {
  groupName?: string;
  selectedUsers: string[];
}) => {
  try {
    const res = await axios.post(
      `${SERVER_URL}/api/chat/new`,
      {
        groupName,
        selectedUsers,
      },
      {
        withCredentials: true,
      }
    );
    return res?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};

export const getAllChats = async () => {
  const res = await axios.get(`${SERVER_URL}/api/chat/get-all-chats`, {
    withCredentials: true,
  });
  return res?.data;
};

export const getAllMessages = async (chatId: string, page: number) => {
  try {
    const res = await axios.get(
      `${SERVER_URL}/api/chat/get-all-messages?chatId=${chatId}&page=${page}`,
      {
        withCredentials: true,
      }
    );
    return res?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};
