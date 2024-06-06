import axios from "axios";
import { SERVER_URL } from "./authAPI";

export const AddNewPostAPI = async (postData: FormData) => {
  try {
    const res = await axios.postForm(
      `${SERVER_URL}/api/posts/new-post`,

      postData,

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

export const getAllPosts = async ({ page = 1 }: { page: number }) => {
  try {
    const res = await axios.get(
      `${SERVER_URL}/api/posts/get-all-posts?page=${page}`,
      {
        withCredentials: true,
      }
    );
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data || "An error occurred";
      throw errorMessage;
    } else {
      // Handle non-Axios errors (e.g., network errors)
      throw "Network error occurred";
    }
  }
};

export const likePostAPI = async ({ postId }: { postId: string }) => {
  try {
    const res = await axios.get(
      `${SERVER_URL}/api/posts/like-post?postId=${postId}`,
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
export const addCommentAPI = async ({
  postId,
  comment,
}: {
  postId: string;
  comment: string;
}) => {
  try {
    const res = await axios.post(
      `${SERVER_URL}/api/posts/add-comment`,
      {
        postId,
        comment,
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
