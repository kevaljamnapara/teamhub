/** WebSocket Connection Context */
import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { taskCreated, taskUpdated, commentAdded } from "../store/slices/taskSlice";
import { addNotification } from "../store/slices/notificationSlice";

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    // Only connect if user is logged in
    if (!user) return;

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
    const serverUrl = apiUrl.replace("/api", "");

    const newSocket = io(serverUrl, {
      auth: {
        token: localStorage.getItem("token")
      }
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    // Event listeners
    newSocket.on("task-created", (task) => {
      dispatch(taskCreated(task));
    });

    newSocket.on("task-updated", (task) => {
      dispatch(taskUpdated(task));
    });

    newSocket.on("comment-added", (data) => {
      // data should contain { taskId, comment }
      dispatch(commentAdded(data));
    });

    newSocket.on("notification-added", (notification) => {
      dispatch(addNotification(notification));
    });

    return () => {
      newSocket.disconnect();
    };
  }, [user, dispatch]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
