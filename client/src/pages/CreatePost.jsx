import React, { useState } from "react";
import { Image, X } from "lucide-react";
import toast from "react-hot-toast";
import { dummyUserData } from "../assets/assets.js";
import { useTheme } from "../context/AppContext";

const CreatePost = () => {
  const { isDarkMode } = useTheme();
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = dummyUserData;

  const handleSubmit = async () => {};

  return (
    <div className={`min-h-screen ${
      !isDarkMode 
        ? "bg-gradient-to-b from-gray-900 to-gray-800" 
        : "bg-gradient-to-b from-slate-50 to-white"
    }`}>
      <div className="max-w-6xl mx-auto p-6">
        {/* Title */}
        <div className="mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            !isDarkMode ? "text-gray-100" : "text-slate-900"
          }`}>
            Create Post
          </h1>
          <p className={!isDarkMode ? "text-gray-400" : "text-slate-600"}>
            Share your thoughts with the world
          </p>
        </div>

        {/* Form */}
        <div className={`max-w-xl p-4 sm:p-8 sm:pb-3 rounded-xl shadow-md space-y-4 ${
          !isDarkMode ? "bg-gray-800" : "bg-white"
        }`}>
          {/* Header */}
          <div className="flex items-center gap-3">
            <img
              src={user.profile_picture}
              alt="Profile Picture"
              className="w-12 h-12 rounded-full shadow"
            />
            <div>
              <h2 className={`font-semibold ${
                !isDarkMode ? "text-gray-100" : "text-gray-900"
              }`}>
                {user.full_name}
              </h2>
              <p className={`text-sm ${
                !isDarkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                @{user.username}
              </p>
            </div>
          </div>

          {/* Text Area */}
          <textarea
            onChange={(e) => setContent(e.target.value)}
            rows={20}
            value={content}
            className={`w-full resize-none max-h-20 mt-4 text-sm outline-none ${
              !isDarkMode 
                ? "bg-gray-800 text-gray-100 placeholder-gray-500" 
                : "bg-white text-gray-900 placeholder-gray-400"
            }`}
            placeholder="What's on your mind?"
          />

          {/* Images */}
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {images.map((image, index) => {
                return (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt="Post Media"
                      className="h-20 rounded-md"
                    />
                    <div
                      onClick={() =>
                        setImages(images.filter((_, i) => i !== index))
                      }
                      className="absolute hidden group-hover:flex justify-center items-center top-0 right-0 bottom-0 left-0 bg-black/40 rounded-md cursor-pointer"
                    >
                      <X className="w-6 h-6 text-white" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Actions */}
          <div className={`flex items-center justify-between pt-3 border-t ${
            !isDarkMode ? "border-gray-700" : "border-gray-300"
          }`}>
            <label
              htmlFor="images"
              className={`flex items-center gap-2 text-sm transition cursor-pointer ${
                !isDarkMode 
                  ? "text-gray-400 hover:text-gray-200" 
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Image className="size-6" />
            </label>

            <input
              type="file"
              id="images"
              accept="image/*"
              hidden
              multiple
              onChange={(e) => setImages([...images, ...e.target.files])}
            />

            <button
              disabled={loading}
              onClick={() =>
                toast.promise(handleSubmit(), {
                  loading: "Publishing post...",
                  success: <p>Post published successfully!</p>,
                  error: <p>Failed to publish post.</p>,
                })
              }
              className="text-sm bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition text-white font-medium px-8 py-2 rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Publish Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;