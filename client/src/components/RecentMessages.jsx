import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { dummyRecentMessagesData } from "../assets/assets.js";
import { useTheme } from "../context/AppContext";
import { useAuth, useUser } from "@clerk/clerk-react";
import api from "../api/axios.js";
import toast from "react-hot-toast";

const RecentMessages = () => {
  const { isDarkMode } = useTheme();
  const [messages, setMessages] = useState([]);
  const { user } = useUser();
  const { getToken } = useAuth();

  const fetchRecentMessages = async () => {
    try {
      const token = await getToken();
      const { data } = await api.get("/api/user/recent-messages", {
        headers: { Authorization: token },
      });

      if (data.success) {
        // Group messages by from_user_id and count unseen messages
        const groupedMessages = data.data.reduce((account, message) => {
          const fromUserId = message.from_user_id._id;

          if (!account[fromUserId]) {
            account[fromUserId] = {
              latestMessage: message,
              unseenCount: message.seen ? 0 : 1,
            };
          } else {
            // Update to latest message if this one is newer
            if (new Date(message.createdAt) > new Date(account[fromUserId].latestMessage.createdAt)) {
              account[fromUserId].latestMessage = message;
            }
            // Increment unseen count
            if (!message.seen) {
              account[fromUserId].unseenCount += 1;
            }
          }

          return account;
        }, {});

        // Sort messages by createdAt descending
        const sortedMessages = Object.values(groupedMessages)
          .map(({ latestMessage, unseenCount }) => ({
            ...latestMessage,
            unseenCount,
          }))
          .sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });

        setMessages(sortedMessages);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRecentMessages();
      setInterval(fetchRecentMessages, 2000); // Refresh every 60 seconds
      return () => clearInterval(fetchRecentMessages);
    }
  }, [user]);

  return (
    <div
      className={`max-w-xs mt-4 p-4 min-h-20 rounded-md shadow text-xs ${
        !isDarkMode ? "bg-gray-800 text-gray-100" : "bg-white text-slate-800"
      }`}
    >
      <h3
        className={`font-semibold mb-4 ${
          !isDarkMode ? "text-gray-100" : "text-slate-800"
        }`}
      >
        Recent Messages
      </h3>

      <div className="flex flex-col max-h-56 overflow-y-scroll no-scrollbar">
        {messages.map((message, index) => {
          return (
            <Link
              key={index}
              to={`/messages/${message.from_user_id._id}`}
              className={`flex items-start gap-2 py-2 ${
                !isDarkMode ? "hover:bg-gray-700" : "hover:bg-slate-100"
              }`}
            >
              <img
                src={message.from_user_id.profile_picture}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />

              <div className="w-full">
                <div className="flex justify-between">
                  <p className="font-medium">
                    {message.from_user_id.full_name}
                  </p>
                  <p
                    className={`text-[10px] ${
                      !isDarkMode ? "text-gray-400" : "text-slate-400"
                    }`}
                  >
                    {moment(message.createdAt).fromNow()}
                  </p>
                </div>

                <div className="flex justify-between">
                  <p
                    className={!isDarkMode ? "text-gray-400" : "text-gray-500"}
                  >
                    {message.message_text ? message.message_text : "Media"}
                  </p>
                  {message.unseenCount > 0 && (
                    <p className="bg-indigo-500 text-white min-w-4 h-4 px-1 flex items-center justify-center rounded-full text-[10px]">
                      {message.unseenCount}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default RecentMessages;
