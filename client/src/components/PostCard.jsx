import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, Heart, MessageCircle, Share2 } from "lucide-react";
import moment from "moment";
import { dummyUserData } from "../assets/assets.js";
import { useTheme } from "../context/AppContext";

const PostCard = ({ post }) => {
  const { isDarkMode } = useTheme();

  const postWithHashTags = post.content.replace(
    /(#\w+)/g,
    `<span class="${!isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} cursor-pointer">$1</span>`
  );

  const navigate = useNavigate();

  const currentUser = dummyUserData;
  const [likes, setLikes] = useState(post.likes_count);

  const handleLike = async () => {};

  return (
    <div className={`rounded-xl shadow p-4 space-y-4 w-full max-w-2xl ${
      !isDarkMode ? "bg-gray-800" : "bg-white"
    }`}>
      {/* User Info */}
      <div
        onClick={() => navigate(`/profile/${post.user._id}`)}
        className="inline-flex items-center gap-3 cursor-pointer"
      >
        <img
          src={post.user.profile_picture}
          alt="User Profile"
          className="w-10 h-10 rounded-full shadow"
        />

        <div>
          <div className="flex items-center space-x-1">
            <span className={!isDarkMode ? "text-gray-100" : "text-gray-900"}>{post.user.full_name}</span>
            <BadgeCheck className="w-4 h-4 text-blue-500" />
          </div>

          <div className={`text-sm ${
            !isDarkMode ? "text-gray-400" : "text-gray-500"
          }`}>
            @{post.user.username} - {moment(post.createdAt).fromNow()}
          </div>
        </div>
      </div>

      {/* Post Text Content */}
      {post.content && (
        <div
          className={`text-sm whitespace-pre-line ${
            !isDarkMode ? "text-gray-200" : "text-gray-800"
          }`}
          dangerouslySetInnerHTML={{ __html: postWithHashTags }}
        />
      )}

      {/* Post Media Content */}
      <div className="grid grid-cols-2 gap-2">
        {post.image_urls.map((img, index) => {
          return (
            <img
              key={index}
              src={img}
              alt="Post Media"
              className={`w-full h-48 object-cover rounded-lg ${
                post.image_urls.length === 1 && "col-span-2 h-auto "
              }`}
            />
          );
        })}
      </div>

      {/* Actions */}
      <div className={`flex items-center gap-4 text-sm pt-2 border-t ${
        !isDarkMode 
          ? "text-gray-400 border-gray-700" 
          : "text-gray-600 border-gray-300"
      }`}>
        {/* Like Button */}
        <div className="flex items-center gap-1">
          <Heart
            onClick={handleLike}
            className={`w-4 h-4 cursor-pointer ${
              likes.includes(currentUser._id) && "text-red-500 fill-red-500 "
            }`}
          />
          <span>{likes.length}</span>
        </div>

        {/* Message Button */}
        <div className="flex items-center gap-1">
          <MessageCircle className="w-4 h-4 cursor-pointer" />
          <span>{12}</span>
        </div>

        {/* Share Button */}
        <div className="flex items-center gap-1">
          <Share2 className="w-4 h-4 cursor-pointer" />
          <span>{12}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
