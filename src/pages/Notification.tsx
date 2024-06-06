/* eslint-disable react-refresh/only-export-components */
import { manageFriendRequestAPI } from "@/APIS/authAPI";
import { getAllNotificationsAPI } from "@/APIS/notificationAPI";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export interface notificationInterface {
  message: string;
  postId: { _id: string; content: string };
  relatedUser: { _id: string; username: string; avatar: string };
  type: string;
  userId: {
    avatar: string;
    username: string;
    _id: string;
  };
  _id: string;
}

const Notification = () => {
  const navigate = useNavigate();
  const { data: NotificationData, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: getAllNotificationsAPI,
  });
  const toastid = useRef<string | undefined>(undefined);
  const { mutate: ManageFriendRequest, isPending } = useMutation({
    mutationFn: manageFriendRequestAPI,
    onMutate: () => {
      toastid.current = toast.loading("Your Request Is in Process");
    },
    onSuccess: (data) => {
      toast.success(data?.data?.message, { id: toastid.current });
      navigate("/friends");
    },
    onError: (error) => {
      toast.error(error?.message, { id: toastid.current });
    },
  });
  const handleRequest = (action: string, notificationId: string) => {
    ManageFriendRequest({ action, notificationId });
  };
  return isLoading ? (
    <p>Loading..</p>
  ) : (
    <div className="w-full h-full flex flex-col items-center overflow-y-scroll ">
      <div className="w-[90%] mt-16 flex flex-col md:px-5 px-2 py-4 bg-[#987070]">
        <div className="flex items-center gap-1">
          <h1 className="text-xl font-medium text-white">Notification</h1>
          <p className="text-xl font-normal text-white">
            ({NotificationData.notifications.length})
          </p>
        </div>
        <div className="my-3 space-y-4 border-b border-white py-3">
          {NotificationData.notifications.length === 0 ? (
            <p className="text-lg font-normal text-white">
              You Have No Notifications
            </p>
          ) : (
            NotificationData.notifications.map(
              (notification: notificationInterface) => (
                <div
                  key={notification._id}
                  className="flex justify-between items-center px-3 w-full"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex gap-4 items-center">
                      <img
                        className="w-20 h-20 rounded-full object-cover"
                        src={`${import.meta.env.VITE_CLOUDINARY_URL}${
                          notification.type === "Post_Interaction"
                            ? notification.relatedUser.avatar
                            : notification.userId.avatar
                        }`}
                        alt="friend-avatar"
                      />
                      <p className="text-lg font-normal text-white">
                        {notification.type === "Post_Interaction"
                          ? notification.relatedUser.username
                          : notification.userId.username}
                      </p>
                    </div>
                    <div className="text-lg font-normal text-white">
                      {notification.message.split(" ").slice(1).join(" ")}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {notification.type === "Post_Interaction" ? (
                      <img
                        src={`${import.meta.env.VITE_CLOUDINARY_URL}${
                          notification.postId.content
                        }`}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      !notification.message.includes("Accepted") && (
                        <>
                          <Button
                            disabled={isPending}
                            className="bg-green-700 hover:bg-green-800"
                            onClick={() =>
                              handleRequest("accept", notification._id)
                            }
                          >
                            Accept
                          </Button>
                          <Button
                            disabled={isPending}
                            onClick={() =>
                              handleRequest("reject", notification._id)
                            }
                            className="bg-red-700 hover:bg-red-800"
                          >
                            Reject
                          </Button>
                        </>
                      )
                    )}
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default AppLayout(Notification);
