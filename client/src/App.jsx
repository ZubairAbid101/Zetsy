import React, { useEffect, useRef } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useUser, useAuth } from "@clerk/clerk-react";
import toast, { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { fetchUser } from "./features/user/userSlice.js";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import Messages from "./pages/Messages";
import ChatBox from "./pages/ChatBox";
import Connections from "./pages/Connections";
import Discover from "./pages/Discover";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import Layout from "./pages/Layout";
import { ThemeProvider } from "./context/AppContext";
import { fetchConnections } from "./features/connections/connectionsSlice.js";
import { addMessage } from "./features/messages/messagesSlice.js";
import Notification from "./components/Notification.jsx";

const App = () => {
  const { user } = useUser();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const pathnameRef = useRef(pathname);

  const { getToken } = useAuth();
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        const token = await getToken();
        dispatch(fetchUser(token));
        dispatch(fetchConnections(token));
      }
    };
    fetchData();
  }, [user, getToken, dispatch]);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (user) {
      const eventSource = new EventSource(
        import.meta.env.VITE_BACKEND_URL + "/api/messages/" + user.id,
      );

      eventSource.onmessage = (event) => {
        const message = JSON.parse(event.data);

        // Only show notification if NOT on the specific user's chat page
        if (pathnameRef.current !== `/messages/${message.from_user_id._id}`) {
          toast.custom(
            (t) => <Notification t={t} message={message} />,
            { position: "bottom-right", duration: 5000 }
          );
        }
        // If we're on a different chat page, still add the message to trigger a refresh
        else {
          dispatch(addMessage(message));
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE connection error:", error);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  }, [user, dispatch]);

  return (
    <ThemeProvider>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Layout />}>
          <Route index element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<ChatBox />} />
          <Route path="connections" element={<Connections />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path="create-post" element={<CreatePost />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
};

export default App;
