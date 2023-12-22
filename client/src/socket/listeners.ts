import {useEffect} from "react";
import {socket} from "./socket";

function useSocketListeners (eventHandlers: Record<string, (...args: any[]) => void>) {
  const setupEventListeners = () => {
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });
  };

  const cleanupEventListeners = () => {
    Object.entries(eventHandlers).forEach(([event, handler]) => {
      socket.off(event, handler);
    });
  };

  useEffect(() => {
    setupEventListeners();
    return cleanupEventListeners;
  }, []);
}

export default useSocketListeners;