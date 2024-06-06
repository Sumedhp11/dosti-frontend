import { IoHomeSharp } from "react-icons/io5";
import { IoAddCircleSharp } from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { LuMessagesSquare } from "react-icons/lu";
import { IoSettings } from "react-icons/io5";
import { Link, useLocation } from "react-router-dom";
import { IconType } from "react-icons/lib";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
const sideBarLinks = [
  {
    url: "/",
    icon: IoHomeSharp,
    name: "Feed",
  },
  {
    url: "/add-post",
    icon: IoAddCircleSharp,
    name: "Add New Post",
  },
  {
    url: "/messages",
    icon: LuMessagesSquare,
    name: "Messages",
  },
  {
    url: "/friends",
    icon: FaUserFriends,
    name: "Friends",
  },
  {
    url: "/settings",
    icon: IoSettings,
    name: "Settings",
  },
];

const SideBar = ({ mobile }: { mobile?: boolean }) => {
  const location = useLocation();
  const messageNotifications = useSelector(
    (state: RootState) => state.messageAlert.chats
  );

  return (
    <div
      className={`w-full h-full px-3 flex justify-center items-center ${
        !mobile ? "shadow-[18px_0px_15px_0px_#a0aec0]" : "bg-[#F1E5D1]"
      }`}
    >
      <div className="flex flex-col justify-around items-center w-[80%]  h-[75%]">
        {sideBarLinks.map(
          ({
            url,
            icon: Icon,
            name,
          }: {
            url: string;
            icon: IconType;
            name: string;
          }) => (
            <Link
              key={name}
              to={url}
              className={`relative flex justify-between w-full items-center px-2 bg-[#987070] py-4 rounded-lg shadow-md shadow-gray-300 hover:bg-[#987070]/80 ${
                location.pathname === url
                  ? "bg-[#2A629A] hover:bg-[#2A629A]/80"
                  : ""
              }`}
            >
              <Icon
                size={30}
                className={`${
                  location.pathname === url ? "text-white" : "text-[#ecd4ad] "
                }`}
              />
              <p className={`font-medium text-base text-white`}>{name}</p>
              {messageNotifications.length > 0 && name === "Messages" && (
                <div className="w-3 h-3 rounded-full bg-red-700 absolute -right-1 -top-1"></div>
              )}
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default SideBar;
