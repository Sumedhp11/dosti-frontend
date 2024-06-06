/* eslint-disable react-hooks/rules-of-hooks */
import {
  EXITED,
  JOINED,
  NEW_MESSAGE_ALERT,
  friendRequest,
  friendRequestAccepted,
  postCommented,
  postLiked,
} from "@/constants/constant";
import { useSocketEvents } from "@/hooks/hooks";
import { UserDataInterface } from "@/interfaces/userInterfaces";
import { useSocket } from "@/lib/socketProvider";
import {
  addOnlineUserIds,
  getMessageNotificationAlerts,
  removeOnlineUserId,
} from "@/redux/slices/messageAlertSlice";
import { IncrementNotificationCount } from "@/redux/slices/notificationSlice";
import { ComponentType, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import Header from "../ui/Header";
import ProfileSection from "../ui/ProfileSection";
import SideBar from "../ui/SideBar";

interface AppLayoutProps {
  user: UserDataInterface;
}
const AppLayout = (WrappedComponent: ComponentType<AppLayoutProps>) => {
  return ({ user }: AppLayoutProps) => {
    const dispatch = useDispatch();
    const socket = useSocket();
    const notificationListener = useCallback(() => {
      dispatch(IncrementNotificationCount());
    }, [dispatch]);

    const newMessageListener = useCallback(
      ({ chatId, message }: { chatId: string; message: string }) => {
        dispatch(getMessageNotificationAlerts({ chatId, message }));
      },
      [dispatch]
    );

    const eventHandlers = {
      [friendRequest]: () => notificationListener(),
      [postLiked]: () => notificationListener(),
      [postCommented]: () => notificationListener(),
      [friendRequestAccepted]: () => notificationListener(),
      [NEW_MESSAGE_ALERT]: (data: { chatId: string; message: string }) =>
        newMessageListener(data),
    };

    useEffect(() => {
      socket.on(JOINED, (data: string[]) => {
        dispatch(addOnlineUserIds(data));
      });
      () => {
        socket.on(EXITED, (data: string) => {
          dispatch(removeOnlineUserId(data));
        });
      };
    }, [socket, dispatch]);
    useSocketEvents(socket, eventHandlers);

    return (
      <div className="flex flex-col w-full h-screen overflow-hidden bg-[#F1E5D1]">
        <Header />
        <div className="w-full flex-grow grid grid-cols-12 overflow-hidden ">
          <div className="col-span-2 lg:block hidden  h-full">
            <SideBar />
          </div>
          <div className="xl:col-span-8 lg:col-span-10 col-span-12 h-full overflow-hidden">
            <WrappedComponent user={user} />
          </div>
          <div className="col-span-2 xl:block hidden  h-full">
            <ProfileSection user={user} />
          </div>
        </div>
      </div>
    );
  };
};

export default AppLayout;
