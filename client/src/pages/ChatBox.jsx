import React, { useEffect, useRef, useState } from "react";
import { ImageIcon, SendHorizontal } from "lucide-react";
import { dummyMessagesData, dummyUserData } from "../assets/assets.js";
import { useTheme } from "../context/AppContext";

const ChatBox = () => {
  const { isDarkMode } = useTheme();
  const messages = dummyMessagesData;
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [user, setUser] = useState(dummyUserData);
  const chatContainerRef = useRef(null);

  const sendMessage = async () => {};

  useEffect(() => {
  if (chatContainerRef.current) {
    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth'
    });
  }
}, [messages]);

  return (
    user && (
      <div
        className={`flex flex-col h-screen ${
          !isDarkMode ? "bg-gray-900" : "bg-white"
        }`}
      >
        {/* Chat Header */}
        <div
          className={`flex items-center gap-2 p-2 md:px-10 xl:pl-42  ${
            !isDarkMode
              ? "bg-gradient-to-r from-gray-800 to-gray-700 border-gray-700"
              : "bg-gradient-to-r from-indigo-50 to-purple-50 border-gray-300"
          }`}
        >
          <img
            src={user.profile_picture}
            alt="Profile Picture"
            className="size-8 rounded-full"
          />
          <div>
            <p
              className={`font-medium ${
                !isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}
            >
              {user.full_name}
            </p>
            <p
              className={`text-sm -mt-1.5 ${
                !isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              @{user.username}
            </p>
          </div>
        </div>

        {/* Chat Box */}
        <div ref={chatContainerRef} className="p-5 md:px-10 h-full overflow-y-scroll no-scrollbar">
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages
              .toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
              .map((message, index) => {
                return (
                  <div
                    key={index}
                    className={`flex flex-col ${
                      message.to_user_id !== user._id
                        ? "items-start"
                        : "items-end"
                    }`}
                  >
                    <div
                      className={`p-2 text-sm max-w-sm rounded-lg shadow ${
                        message.to_user_id !== user._id
                          ? !isDarkMode
                            ? "bg-gray-700 text-gray-100 rounded-bl-none"
                            : "bg-white text-slate-700 rounded-bl-none"
                          : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-none"
                      }`}
                    >
                      {message.message_type === "image" && (
                        <img
                          src={message.media_url}
                          alt="Message Media"
                          className="w-full max-w-sm rounded-lg mb-1"
                        />
                      )}
                      <p>{message.text}</p>
                    </div>
                  </div>
                );
              })}

            
          </div>
        </div>

        {/* Message Input */}
        <div className="px-4">
          <div
            className={`flex items-center gap-3 pl-5 p-1.5 w-full max-w-xl mx-auto border shadow rounded-full mb-5 ${
              !isDarkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            {/* Text Input */}
            <input
              onKeyDown={(e) => e.key == "Enter" && sendMessage()}
              onChange={(e) => setText(e.target.value)}
              value={text}
              type="text"
              className={`flex-1 outline-none ${
                !isDarkMode
                  ? "bg-gray-800 text-gray-100 placeholder-gray-500"
                  : "bg-white text-slate-700 placeholder-gray-400"
              }`}
              placeholder="Type your message here..."
            />

            {/* Input Images */}
            <label htmlFor="images">
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="Chat Image"
                  className="h-8 rounded"
                />
              ) : (
                <ImageIcon
                  className={`size-7 cursor-pointer ${
                    !isDarkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                />
              )}

              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="images"
                accept="image/*"
                hidden
              />
            </label>

            {/* Send Button */}
            <button
              onClick={sendMessage}
              className="bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 active:scale-95 cursor-pointer text-white p-2 rounded-full"
            >
              <SendHorizontal className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ChatBox;
