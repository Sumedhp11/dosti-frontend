/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { Socket } from "socket.io-client";
type EventHandlers = {
  [event: string]: (...args: any[]) => void;
};
const useSocketEvents = (socket: Socket, handlers: EventHandlers) => {
  useEffect(() => {
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket, handlers]);
};
export { useSocketEvents };
