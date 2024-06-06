/* eslint-disable react-refresh/only-export-components */
import { GetAllUsers, sendFriendRequestAPI } from "@/APIS/authAPI";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { UserDataInterface } from "@/interfaces/userInterfaces";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRef } from "react";
import toast from "react-hot-toast";

const Friends = ({ user }: { user: UserDataInterface }) => {
  const { data: AllUsers } = useQuery({
    queryKey: ["all-users"],
    queryFn: GetAllUsers,
  });
  const toastid = useRef<string | undefined>(undefined);
  const { mutate: sendRequest, isPending } = useMutation({
    mutationFn: sendFriendRequestAPI,
    onMutate: () => {
      toastid.current = toast.loading("Sending Friend Request");
    },
    onSuccess: (data) => {
      toast.success(data?.data?.message, { id: toastid.current });
    },
    onError: (error) => {
      toast.error(error?.message, { id: toastid.current });
    },
  });

  const sendFriendRequest = (userId: string) => {
    sendRequest({ userId });
  };
  return (
    <div className="w-full h-full flex flex-col items-center overflow-y-scroll ">
      <div className="w-[90%] mt-16 flex flex-col px-5 py-4 bg-[#987070]">
        <div className="flex items-center gap-1">
          <h1 className="text-xl font-medium text-white">Friends</h1>
          <p className="text-xl font-normal text-white">
            ({user?.friends.length})
          </p>
        </div>
        <div className="my-3 space-y-4 border-b border-white py-3">
          {user?.friends?.length === 0 ? (
            <p className="text-lg font-normal text-white">
              You Have Not Added Any friends Yet
            </p>
          ) : (
            user?.friends.map(
              ({
                _id,
                avatar,
                username,
              }: {
                _id: string;
                avatar: string;
                username: string;
              }) => (
                <div
                  key={_id}
                  className="flex justify-between items-center px-3 w-full"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      className="w-20 h-20 rounded-full object-cover"
                      src={`${import.meta.env.VITE_CLOUDINARY_URL}${avatar}`}
                      alt="friend-avatar"
                    />
                    <p className="text-lg font-normal text-white">{username}</p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Button className="bg-red-700 hover:bg-red-900">
                      Unfriend
                    </Button>
                    <Button className="bg-blue-700 hover:bg-blue-900">
                      Block
                    </Button>
                  </div>
                </div>
              )
            )
          )}
        </div>
        <div className="flex items-center gap-1">
          <h1 className="text-xl font-medium text-white">Remaining Users</h1>
          <p className="text-xl font-normal text-white">
            ({AllUsers?.data.length})
          </p>
        </div>
        <div className="my-3 space-y-4 border-b border-white py-3">
          {AllUsers?.data?.length === 0 ? (
            <p className="text-lg font-normal text-white">No Users Found!</p>
          ) : (
            AllUsers?.data.map(
              ({
                _id,
                avatar,
                username,
              }: {
                _id: string;
                avatar: string;
                username: string;
              }) => (
                <div
                  key={_id}
                  className="flex justify-between items-center px-3 w-full"
                >
                  <div className="flex gap-4 items-center">
                    <img
                      className="w-20 h-20 rounded-full object-cover"
                      src={`${import.meta.env.VITE_CLOUDINARY_URL}${avatar}`}
                      alt="friend-avatar"
                    />
                    <p className="text-lg font-normal text-white">{username}</p>
                  </div>
                  <div className="flex gap-3 items-center">
                    <Button
                      disabled={isPending}
                      className="bg-blue-700 hover:bg-blue-900"
                      onClick={() => sendFriendRequest(_id)}
                    >
                      {isPending ? "Sending Friend Request" : "Add Friend"}
                    </Button>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default AppLayout(Friends);
