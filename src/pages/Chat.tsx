/* eslint-disable react-refresh/only-export-components */
import { getAllMessages } from "@/APIS/MessageAPI";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NEW_MESSAGE } from "@/constants/constant";
import { useSocketEvents } from "@/hooks/hooks";
import { UserDataInterface } from "@/interfaces/userInterfaces";
import { useSocket } from "@/lib/socketProvider";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useInView } from "react-intersection-observer";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { chatInterface } from "./Messages";
import { useDispatch, useSelector } from "react-redux";
import { clearMessageNotifications } from "@/redux/slices/messageAlertSlice";
import { RootState } from "@/redux/store";

export interface messageInterface {
  chat: string;
  content: string;
  createdAt: Date;
  sender: { _id: string; username: string };
  updatedAt: Date;
  _id: string;
}

const Chat = ({ user }: { user: UserDataInterface }) => {
  const params = useParams();
  const { chatId } = params;
  const navigate = useNavigate();
  const location = useLocation();
  const { ref, inView } = useInView();
  const chat: chatInterface = location.state;
  const [message, setMessage] = useState<string>("");
  const [allMessages, setAllMessages] = useState<messageInterface[]>([]);
  const socket = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollableDivRef = useRef<HTMLDivElement>(null);
  const memberIds = chat.members.map(({ _id }: { _id: string }) => _id);
  const [page, setPage] = useState<number>(1);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const onlineUsers = useSelector(
    (state: RootState) => state.messageAlert.onlineUsers
  );

  const NewMessagehandler = useCallback(
    (data: { message: messageInterface }) => {
      setAllMessages((prevMessages) => [...prevMessages, data.message]);
    },
    []
  );

  const eventHandlers = {
    [NEW_MESSAGE]: (data: { message: messageInterface }) =>
      NewMessagehandler(data),
  };

  useSocketEvents(socket, eventHandlers);

  const {
    data: messagesData,
    isLoading,
    isSuccess,
  } = useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["messages", chatId, page],
    queryFn: () => getAllMessages(chatId!, page),
  });

  useEffect(() => {
    if (isSuccess) {
      setAllMessages((prev) => [...messagesData.data.messages, ...prev]);
    }
  }, [isSuccess, messagesData]);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit(NEW_MESSAGE, { chatId, memberIds, message });
    setMessage("");
  };

  useEffect(() => {
    if (messagesEndRef.current && scrollableDivRef.current) {
      scrollableDivRef.current.scrollTop =
        scrollableDivRef.current.scrollHeight;
    }
  }, [allMessages]);

  useEffect(() => {
    if (inView && messagesData?.data?.totalPages > page) {
      setPage((prev) => prev + 1);
    }
  }, [inView, messagesData, page]);

  const otherMember = chat.members.filter(
    (member) => member?._id !== user?._id
  );
  useEffect(() => {
    dispatch(clearMessageNotifications(chatId!));
    return () => {
      setAllMessages([]);
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    };
  }, [queryClient, dispatch, chatId]);
  const onlineuser = onlineUsers.find(
    (userId) => userId === otherMember[0]._id
  );
  return isLoading ? (
    <p>Loading messages</p>
  ) : (
    <div className="w-full h-full flex flex-col ">
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
                : import.meta.env.VITE_CLOUDINARY_URL + otherMember[0]?.avatar
            }
            alt=""
          />
          <div>
            <p className="text-lg font-medium ">
              {chat.members.length > 2 ? chat.name : otherMember[0].username}
            </p>
            {onlineuser && (
              <div className="text-green-700 font-medium text-sm">Online</div>
            )}
          </div>
        </div>
      </div>
      <div className="w-full flex-grow">
        <div
          ref={scrollableDivRef}
          className="w-full overflow-y-auto space-y-5 h-[calc(100vh-280px)] flex flex-col px-3 py-1"
        >
          <div ref={ref}></div>
          {allMessages.length === 0 ? (
            <p className="text-lg font-medium text-center">
              You Dont Have Any Messages Yet!
            </p>
          ) : (
            allMessages?.map((message) => {
              const sameSender = message.sender._id === user._id;

              return (
                <div
                  key={message._id}
                  className={`${
                    sameSender ? "self-end" : "self-start"
                  } bg-[#987070] text-white rounded-md p-2 w-fit `}
                >
                  {!sameSender && (
                    <p className="text-yellow-300 font-semibold">
                      {message.sender.username}
                    </p>
                  )}
                  <p className="text-md font-medium">{message.content}</p>
                  <p className="text-xs font-normal">
                    {new Date(message.createdAt).getHours()}:
                    {new Date(message.createdAt)
                      .getMinutes()
                      .toString()
                      .padStart(2, "0")}
                  </p>
                </div>
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
