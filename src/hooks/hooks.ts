/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

type EventHandlers = {
  [event: string]: (...args: any[]) => void;
};

const useSocketEvents = (socket: Socket, handlers: EventHandlers) => {
  const savedHandlers = useRef<EventHandlers>(handlers);

  useEffect(() => {
    savedHandlers.current = handlers;
  }, [handlers]);

  useEffect(() => {
    const currentHandlers = savedHandlers.current;

    Object.entries(currentHandlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    return () => {
      Object.entries(currentHandlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket]);
};

export { useSocketEvents };
