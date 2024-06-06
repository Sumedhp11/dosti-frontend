/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-refresh/only-export-components */
import { SERVER_URL } from "@/APIS/authAPI";
import { ReactNode, createContext, useContext, useMemo } from "react";
import io, { Socket } from "socket.io-client";

const defaultSocket = io(`${SERVER_URL}/`, { autoConnect: false });

const SocketContext = createContext<Socket>(defaultSocket);

const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = useMemo(
    () => io(`${SERVER_URL}/`, { withCredentials: true }),
    []
  );

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, useSocket };
