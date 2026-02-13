import React, { useState } from "react";
import { ArrowLeft, Sparkle, TextIcon, Upload } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import api from "../api/axios";

const StoryModel = ({ setShowModel, fetchStories }) => {
  const bgColors = [
    "#f87171",
    "#34d399",
    "#60a5fa",
    "#a78bfa",
    "#fbbf24",
    "#f472b6",
  ];

  const [mode, setMode] = useState("text");
  const [text, setText] = useState("");
  const [media, setMedia] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [background, setBackground] = useState(bgColors[0]);

  const { getToken } = useAuth();
  const MAX_VIDEO_DURATION = 60; // in seconds
  const MAX_VIDEO_SIZE = 50; // 50 MB

  const handleMediaUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      if (file.type.startsWith("video")) {
        if (file.size / (1024 * 1024) > MAX_VIDEO_SIZE) {
          toast.error("Video size exceeds 50 MB limit.");
          setMedia(null);
          setPreviewUrl(null);
          e.target.value = "";
          return;
        }

        const videoElement = document.createElement("video");
        videoElement.preload = "metadata";
        videoElement.onloadedmetadata = () => {
          window.URL.revokeObjectURL(videoElement.src);

          if (videoElement.duration > MAX_VIDEO_DURATION) {
            toast.error("Video duration exceeds 60 seconds limit.");
            setMedia(null);
            setPreviewUrl(null);
            e.target.value = "";
            return;
          } else {
            setMedia(file);
            setPreviewUrl(URL.createObjectURL(file));
            setText("");
            setMode("media");
          }
        };
        videoElement.src = URL.createObjectURL(file);
      } else if (file.type.startsWith("image")) {
        setMedia(file);
        setPreviewUrl(URL.createObjectURL(file));
        setText("");
        setMode("media");
      }
    }
    e.target.value = "";
  };

  const handleCreateStory = async () => {
    const media_type =
      mode === "media"
        ? media?.type.startsWith("image")
          ? "image"
          : "video"
        : "text";

    if (media_type === "text" && !text) {
      toast.error("Please enter some text for your story.");
      throw new Error("Please enter some text for your story.");
    }

    let formData = new FormData();
    formData.append("content", text);
    formData.append("media_type", media_type);
    formData.append("background_color", background);

    if (media) {
      formData.append("media", media);
    }

    const token = await getToken();

    try {
      const { data } = await api.post("/api/stories/create", formData, {
        headers: { Authorization: token },
      });

      if (data.success) {
        setShowModel(false);
        toast.success(data.message);
        fetchStories();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-110 min-h-screen bg-black/80 backdrop-blur text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-4 flex items-center justify-between">
          <button
            onClick={() => setShowModel(false)}
            className="text-white p-2 cursor-pointer"
          >
            <ArrowLeft className="" />
          </button>

          <h2 className="text-lg font-semibold">Create Story</h2>
          <span className="w-10"></span>
        </div>

        {/* Text or Media Display Area */}
        <div
          className="rounded-lg h-96 flex items-center justify-center relative"
          style={{ backgroundColor: background }}
        >
          {mode === "text" && (
            <textarea
              onChange={(e) => setText(e.target.value)}
              value={text}
              className="bg-transparent text-white w-full h-full p-6 text-lg resize-none focus:outline-none"
              placeholder="What's on your mind..."
            />
          )}

          {mode === "media" &&
            previewUrl &&
            (media?.type.startsWith("image") ? (
              <img
                src={previewUrl}
                alt=""
                className="object-contain max-h-full"
              />
            ) : (
              <video
                src={previewUrl}
                controls
                autoPlay
                muted
                loop
                className="object-contain max-h-full"
              />
            ))}
        </div>

        {/* Change Background Color */}
        <div className="flex mt-2 gap-2">
          {bgColors.map((color) => {
            return (
              <button
                key={color}
                onClick={() => setBackground(color)}
                className="w-6 h-6 rounded-full ring cursor-pointer"
                style={{ backgroundColor: color }}
              />
            );
          })}
        </div>

        {/* Mode Selection Buttons */}
        <div className="flex gap-2 mt-4">
          {/* Text Button */}
          <button
            onClick={() => {
              setMode("text");
              setMedia(null);
              setPreviewUrl(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer ${
              mode === "text" ? "bg-white text-black" : "bg-zinc-800"
            }`}
          >
            <TextIcon size={18} />
            Text
          </button>

          {/* Media Button */}
          <label
            className={`flex-1 flex items-center justify-center gap-2 p-2 rounded cursor-pointer ${
              mode === "media" ? "bg-white text-black" : "bg-zinc-800"
            }`}
          >
            <input
              onChange={handleMediaUpload}
              type="file"
              accept="image/*, video/*"
              className="hidden"
            />
            <Upload size={18} />
            Photo/Video
          </label>
        </div>

        {/* Submit Post Buttons */}
        <button
          onClick={() =>
            toast.promise(handleCreateStory(), {
              loading: "Creating Story...",
            })
          }
          className="flex items-center justify-center gap-2 text-white py-3 mt-4 w-full rounded bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 active:scale-95 transition cursor-pointer"
        >
          <Sparkle size={18} />
          Create Story
        </button>
      </div>
    </div>
  );
};

export default StoryModel;
