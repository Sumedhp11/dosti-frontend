/* eslint-disable react-refresh/only-export-components */
import { createChatAPI, getAllChats } from "@/APIS/MessageAPI";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ONLINE_USERS } from "@/constants/constant";
import { useSocketEvents } from "@/hooks/hooks";
import { UserDataInterface } from "@/interfaces/userInterfaces";
import { useSocket } from "@/lib/socketProvider";
import { RootState } from "@/redux/store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useCallback, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaPlus } from "react-icons/fa6";
import { TbMessage2Plus, TbMessage2Minus } from "react-icons/tb";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export interface chatInterface {
  creator: { _id: string; username: string; avatar: string };
  isGroupChat: boolean;
  members: [
    {
      avatar: string;
      username: string;
      _id: string;
    }
  ];
  name: string;
  _id: string;
}

const Messages = ({ user }: { user: UserDataInterface }) => {
  const socket = useSocket();
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<string[]>([]);
  const [groupName, setgroupName] = useState<string>("");
  const toastid = useRef<string | undefined>(undefined);
  const messageNotifications = useSelector(
    (state: RootState) => state.messageAlert.chats
  );
  const onlineUsers = useSelector(
    (state: RootState) => state.messageAlert.onlineUsers
  );

  const { data: chatsData, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: getAllChats,
  });

  const onlineUserListener = useCallback(() => {}, []);
  const eventHandlers = {
    [ONLINE_USERS]: () => onlineUserListener(),
  };

  useSocketEvents(socket, eventHandlers);
  const handleAddUserToChat = (userId: string) => {
    setSelectedUser((prevSelected) =>
      prevSelected.includes(userId)
        ? prevSelected.filter((id) => id !== userId)
        : [...prevSelected, userId]
    );
  };

  const { mutate: createChatMutation } = useMutation({
    mutationFn: createChatAPI,
    onMutate: () => {
      toastid.current = toast.loading("Creating Chat");
    },
    onSuccess: (data) => {
      toast.success(data?.message, { id: toastid.current });
      setSelectedUser([]);
      setgroupName("");
      navigate(`/chat/${data?.data?._id}`);
    },
    onError: (error) => {
      setSelectedUser([]);
      setgroupName("");
      toast.error(error?.message, { id: toastid.current });
    },
  });
  const handleSubmitCreateChat = () => {
    createChatMutation(
      selectedUser.length > 1
        ? { groupName, selectedUsers: selectedUser }
        : { selectedUsers: selectedUser }
    );
  };

  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <div className="w-full h-full flex flex-col items-center overflow-y-scroll ">
      <div className="w-[90%] mt-16 flex flex-col px-5 py-4 bg-[#987070]">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-medium text-white">Messages</h1>
          <Dialog>
            <DialogTrigger>
              <FaPlus size={35} color="white" />
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Select Friend To Chat</DialogTitle>
              </DialogHeader>
              <h2 className="text-red-400 font-medium text-sm">
                *Note: Select More Than One User To Create Group
              </h2>
              <div className="w-full space-y-4 p-4 border border-black">
                {user?.friends?.length === 0 ? (
                  <p className="text-lg font-normal ">No Friends Found!</p>
                ) : (
                  user?.friends?.map(
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
                        className={`flex justify-between items-center px-3 w-full ${
                          selectedUser.includes(_id)
                            ? "bg-gray-400 rounded-md p-2"
                            : ""
                        }`}
                      >
                        <div className={`flex gap-4 items-center`}>
                          <img
                            className="w-20 h-20 rounded-full object-cover"
                            src={`${
                              import.meta.env.VITE_CLOUDINARY_URL
                            }${avatar}`}
                            alt=""
                          />
                          <p className="text-lg font-normal">{username}</p>
                        </div>
                        {selectedUser.includes(_id) ? (
                          <TbMessage2Minus
                            size={35}
                            className="cursor-pointer"
                            onClick={() => handleAddUserToChat(_id)}
                          />
                        ) : (
                          <TbMessage2Plus
                            size={35}
                            className="cursor-pointer"
                            onClick={() => handleAddUserToChat(_id)}
                          />
                        )}
                      </div>
                    )
                  )
                )}
              </div>
              <DialogFooter className="sm:justify-start">
                {selectedUser.length > 1 && (
                  <Input
                    placeholder="Group Name should be Atleast 3 characters"
                    onChange={(e) => setgroupName(e.target.value)}
                  />
                )}
                <DialogClose asChild>
                  <Button
                    onClick={handleSubmitCreateChat}
                    type="button"
                    className=""
                    disabled={
                      selectedUser.length === 0 ||
                      (selectedUser.length > 1 && groupName.length < 3)
                    }
                  >
                    {selectedUser.length > 1 && groupName
                      ? "Create Group"
                      : "Create Chat"}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="my-3 space-y-7  py-3 ">
          {chatsData?.data.length === 0 ? (
            <p className="text-lg font-normal text-white">No Chats Found!</p>
          ) : (
            chatsData?.data.map((chat: chatInterface) => {
              const otherMember = chat.members.filter(
                (member) => member?._id !== user?._id
              );
              const chatNotification = messageNotifications.find(
                (notification) => notification.chatId === chat._id
              );
              const onlineuser = onlineUsers.find(
                (userId) => userId === otherMember[0]._id
              );
              return (
                <Link
                  to={`/chat/${chat._id}`}
                  state={chat}
                  key={chat._id}
                  className="flex justify-between items-center px-3 w-full shadow-md shadow-gray-700 py-2 bg-[#F1E5D1] "
                >
                  <div className="flex gap-4 items-center">
                    <img
                      className="w-20 h-20 rounded-full object-cover"
                      src={
                        chat.members.length > 2
                          ? "https://imgs.search.brave.com/GUsUCWPmz9Di0UvG8drnKf7MLiCj_xu8eOmt2zDR-KY/rs:fit:860:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAxLzI3LzE1Lzg5/LzM2MF9GXzEyNzE1/ODkzM19jRFpBNHN1/TVhzeDJuMExRMDNG/enBYNTBSN2ZCYVV4/Mi5qcGc"
                          : import.meta.env.VITE_CLOUDINARY_URL +
                            otherMember[0].avatar
                      }
                      alt="chat-image"
                    />
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-normal ">
                        {chat.members.length > 2
                          ? chat.name
                          : otherMember[0].username}
                      </p>
                      {onlineuser && (
                        <div className="w-3 h-3 bg-green-700 rounded-full"></div>
                      )}
                    </div>
                  </div>
                  {chatNotification && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-700 rounded-full"></div>
                      <p className="text-sm text-gray-700">
                        {chatNotification.message}
                      </p>
                    </div>
                  )}
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default AppLayout(Messages);
