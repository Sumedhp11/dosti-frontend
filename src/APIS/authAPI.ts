import axios from "axios";
export const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export const checkUsernameValidaty = async ({
  username,
}: {
  username: string;
}) => {
  try {
    const res = await axios.post(`${SERVER_URL}/api/auth/check-username`, {
      username,
    });
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};

export const RegisterAPI = async (userData: FormData) => {
  try {
    const res = await axios.postForm(
      `${SERVER_URL}/api/auth/new`,

      userData,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};

export const VerifyUserAPI = async (verificationCode: string) => {
  try {
    const res = await axios.post(
      `${SERVER_URL}/api/auth/verify`,
      { verificationCode },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};

export const loginAPI = async ({
  userData,
}: {
  userData: {
    username: string;
    password: string;
  };
}) => {
  try {
    const res = await axios.post(
      `${SERVER_URL}/api/auth/login`,
      {
        username: userData.username,
        password: userData.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};

export const sendForgetPasswordEmailAPI = async (email: string) => {
  try {
    const res = await axios.post(
      `${SERVER_URL}/api/auth/send-forget-password-email`,
      {
        email,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};
export const resetPasswordAPI = async ({
  code,
  password,
}: {
  code: string;
  password: string;
}) => {
  try {
    const res = await axios.post(
      `${SERVER_URL}/api/auth/reset-password`,
      {
        code,
        password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};
export const UserDataAPI = async () => {
  try {
    const res = await axios.get(`${SERVER_URL}/api/auth/get-me`, {
      withCredentials: true,
    });
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};
export const LogoutAPI = async () => {
  const res = await axios.get(`${SERVER_URL}/api/auth/logout`, {
    withCredentials: true,
  });
  return res;
};

export const GetAllUsers = async () => {
  try {
    const res = await axios.get(`${SERVER_URL}/api/auth/get-All-users`, {
      withCredentials: true,
    });
    return res?.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};

export const sendFriendRequestAPI = async ({ userId }: { userId: string }) => {
  try {
    const res = await axios.get(
      `${SERVER_URL}/api/auth/send-request/${userId}`,
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
export const manageFriendRequestAPI = async ({
  action,
  notificationId,
}: {
  action: string;
  notificationId: string;
}) => {
  try {
    const res = await axios.post(
      `${SERVER_URL}/api/auth/manage-friend-request`,
      {
        action,
        notificationId,
      },
      {
        withCredentials: true,
      }
    );
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};

export const editUserAPI = async (userData: FormData) => {
  try {
    const res = await axios.postForm(
      `${SERVER_URL}/api/auth/edit-profile`,

      userData,

      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error.response?.data;
    }
  }
};
