/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { getAllMessages } from "@/APIS/MessageAPI";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserDataInterface } from "@/interfaces/userInterfaces";
import { RootState } from "@/redux/store";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { chatInterface } from "./Messages";
import { useInfiniteScrollTop } from "6pp";
import { NEW_MESSAGE } from "@/constants/constant";
import { useSocket } from "@/lib/socketProvider";
import { clearMessageNotifications } from "@/redux/slices/messageAlertSlice";
import MessageComponent from "@/components/MessageComponent";
import Loader from "@/components/ui/Loader";
import { useSocketEvents } from "@/hooks/hooks";

export interface messageInterface {
  chat: string;
  content: string;
  createdAt: Date;
  sender: { _id: string; username: string };
  updatedAt: Date;
  _id: string;
}

const Chat = ({ user }: { user: UserDataInterface }) => {
  const dispatch = useDispatch();
  const { chatId } = useParams<{ chatId: string }>();
  const location = useLocation();
  const chat: chatInterface = location.state;
  const socket = useSocket();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<messageInterface[]>([]);
  const onlineUsers = useSelector(
    (state: RootState) => state.messageAlert.onlineUsers
  );
  const otherMember = chat.members.find((member) => member?._id !== user?._id);
  const isOnline = onlineUsers.includes(otherMember?._id || "");
  const memberIds = chat.members.map(({ _id }) => _id);
  const queryClient = useQueryClient();
  let allMessages;

  const { data: oldMessagesChunk, isLoading } = useQuery({
    queryKey: ["messages", chatId, page],
    queryFn: () => getAllMessages(chatId!, page),
    staleTime: 0,
  });

  const { data: oldMessages, setData } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk?.data?.totalPages || 1,
    page,
    setPage,
    oldMessagesChunk?.data?.messages || []
  );

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit(NEW_MESSAGE, { chatId, memberIds, message });
    setMessage("");
  };

  useEffect(() => {
    dispatch(clearMessageNotifications(chatId!));

    return () => {
      setMessages([]);
      setMessage("");
      setData([]);
      setPage(1);
      allMessages = [];
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    };
  }, [chatId, dispatch, setData, queryClient]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const newMessagesListener = useCallback(
    (data: { chatId: string; message: messageInterface }) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );
  const eventHandler = {
    [NEW_MESSAGE]: newMessagesListener,
  };

  useSocketEvents(socket, eventHandler);

  allMessages = [...oldMessages, ...messages] as messageInterface[];

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex items-center gap-4 px-3 py-2 shadow-sm shadow-black">
        <IoMdArrowRoundBack
          onClick={() => navigate("/messages")}
          size={45}
          className="text-[#987070] cursor-pointer"
        />
        <div className="flex items-center gap-4">
          <img
            className="w-20 h-20 rounded-full object-cover"
            src={
              chat.members.length > 2
                ? "https://imgs.search.brave.com/GUsUCWPmz9Di0UvG8drnKf7MLiCj_xu8eOmt2zDR-KY/rs:fit:860:0:0/g:ce/aHR0cHM6Ly90NC5m/dGNkbi5uZXQvanBn/LzAxLzI3LzE1Lzg5/LzM2MF9GXzEyNzE1/ODkzM19jRFpBNHN1/TVhzeDJuMExRMDNG/enBYNTBSN2ZCYVV4/Mi5qcGc"
                : import.meta.env.VITE_CLOUDINARY_URL + otherMember?.avatar
            }
            alt=""
          />
          <div>
            <p className="text-lg font-medium">
              {chat.members.length > 2 ? chat.name : otherMember?.username}
            </p>
            {isOnline && (
              <div className="text-green-700 font-medium text-sm">Online</div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full flex-grow">
        <div
          className="w-full overflow-y-auto space-y-5 h-[calc(100vh-280px)] flex flex-col px-3 py-1"
          ref={containerRef}
        >
          {isLoading ? (
            <Loader />
          ) : allMessages.length === 0 ? (
            <p className="text-lg font-medium text-center">
              You don't have any messages yet!
            </p>
          ) : (
            allMessages.map((msg: messageInterface) => {
              const isSender = msg.sender._id === user?._id;
              return (
                <MessageComponent key={msg._id} isSender={isSender} msg={msg} />
              );
            })
          )}
          <div ref={messagesEndRef}></div>
        </div>
        <form
          className="w-full flex items-center pt-7 px-1 gap-2"
          onSubmit={submitHandler}
        >
          <Input
            placeholder="Message...."
            className="w-[90%] bg-white text-black text-base font-medium"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button
            type="submit"
            className="bg-[#987070] hover:bg-[#987070]/80 w-[10%]"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AppLayout(Chat);
