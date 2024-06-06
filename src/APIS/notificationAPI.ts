import axios from "axios";
import { SERVER_URL } from "./authAPI";

export const getAllNotificationsAPI = async () => {
  try {
    const res = await axios.get(
      `${SERVER_URL}/api/notification/get-notifications`,
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
