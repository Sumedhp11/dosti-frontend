import { messageInterface } from "@/pages/Chat";

const MessageComponent = ({
  isSender,
  msg,
}: {
  isSender: boolean;
  msg: messageInterface;
}) => {
  return (
    <div
      className={`${
        isSender ? "self-end" : "self-start"
      } bg-[#987070] text-white rounded-md p-2 w-fit`}
    >
      {!isSender && (
        <p className="text-yellow-300 font-semibold">{msg.sender.username}</p>
      )}
      <p className="text-md font-medium">{msg.content}</p>
      <p className="text-xs font-normal">
        {new Date(msg.createdAt).getHours()}:
        {new Date(msg.createdAt).getMinutes().toString().padStart(2, "0")}
      </p>
    </div>
  );
};

export default MessageComponent;
