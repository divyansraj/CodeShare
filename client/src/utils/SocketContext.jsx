import React, { createContext, useContext, useEffect, useRef } from "react";
import { initSocket } from "./socket";

const SocketContext = createContext(null);
const SocketReadyContext = createContext(false);

export const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [socketReady, setSocketReady] = React.useState(false);

  useEffect(() => {
    const setupSocket = async () => {
      socketRef.current = await initSocket();

      socketRef.current.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });

      setSocketReady(true); // Mark socket as ready once connection is established
    };

    setupSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef}>
      <SocketReadyContext.Provider value={socketReady}>
        {children}
      </SocketReadyContext.Provider>
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
export const useSocketReady = () => useContext(SocketReadyContext);
