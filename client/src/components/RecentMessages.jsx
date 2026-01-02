import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { dummyRecentMessagesData } from "../assets/assets.js";
import { useTheme } from "../context/AppContext";

const RecentMessages = () => {
  const { isDarkMode } = useTheme();
  const [messages, setMessages] = useState([]);

  const fetchRecentMessages = async () => {
    setMessages(dummyRecentMessagesData);
  };

  useEffect(() => {
    fetchRecentMessages();
  }, []);

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
                  <p className="font-medium">{message.from_user_id.full_name}</p>
                  <p
                    className={`text-[10px] ${
                      !isDarkMode ? "text-gray-400" : "text-slate-400"
                    }`}
                  >
                    {moment(message.createdAt).fromNow()}
                  </p>
                </div>

                <div className="flex justify-between">
                  <p className={!isDarkMode ? "text-gray-400" : "text-gray-500"}>
                    {message.text ? message.text : "Media"}
                  </p>
                  {!message.seen && (
                    <p className="bg-indigo-500 text-white w-4 h-4 flex items-center justify-center rounded-full text-[10px]">
                      1
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
