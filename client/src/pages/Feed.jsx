import React, { useEffect, useState } from "react";
import { assets, dummyPostsData } from "../assets/assets.js";
import Loading from "../components/Loading";
import StoriesBar from "../components/StoriesBar";
import PostCard from "../components/PostCard";
import RecentMessages from "../components/RecentMessages";
import { useTheme } from "../context/AppContext";

const Feed = () => {
  const { isDarkMode } = useTheme();

  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeeds = async () => {
    setFeeds(dummyPostsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  return !loading ? (
    <div className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8">
      {/* Stories and Post List */}
      <div>
        <StoriesBar />
        <div className="p-4 space-y-6">
          {feeds.map((post) => {
            return <PostCard key={post._id} post={post} />;
          })}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="max-xl:hidden sticky top-0">
        <div
          className={`max-w-xs text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow ${
            !isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <h3
            className={`font-semibold ${
              !isDarkMode ? "text-gray-100" : "text-slate-800"
            }`}
          >
            Sponsored
          </h3>
          <img
            src={assets.sponsored_img}
            alt="Sponsored Image"
            className="w-75 h-50 rounded-md"
          />
          <p className={!isDarkMode ? "text-gray-300" : "text-slate-600"}>
            Email Marketing
          </p>
          <p className={!isDarkMode ? "text-gray-400" : "text-slate-400"}>
            Supercharge your marketing with a powerful email marketing tool.
          </p>
        </div>

        <RecentMessages />
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Feed;
