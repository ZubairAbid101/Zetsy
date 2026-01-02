import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import moment from "moment";
import { dummyPostsData, dummyUserData } from "../assets/assets.js";
import Loading from "../components/Loading";
import UserProfileInfo from "../components/UserProfileInfo";
import PostCard from "../components/PostCard";
import ProfileModel from "../components/ProfileModel";
import { useTheme } from "../context/AppContext";

const Profile = () => {
  const { isDarkMode } = useTheme();
  const { profileId } = useParams();
  const [user, setUser] = useState();
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("posts");
  const [showEdit, setShowEdit] = useState(false);

  const fetchUser = async () => {
    setUser(dummyUserData);
    setPosts(dummyPostsData);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return user ? (
    <div className={`relative h-full overflow-y-scroll p-6 ${
      !isDarkMode ? "bg-gray-900" : "bg-gray-50"
    }`}>
      <div className="max-w-3xl mx-auto">
        {/* Profile Card */}
        <div className={`rounded-2xl shadow overflow-hidden ${
          !isDarkMode ? "bg-gray-800" : "bg-white"
        }`}>
          {/* Cover Photo */}
          <div className="h-40 md:h-56 bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200">
            {user.cover_photo && (
              <img
                src={user.cover_photo}
                alt="User Cover Photo"
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* User Info */}
          <UserProfileInfo
            user={user}
            posts={posts}
            profileId={profileId}
            setShowEdit={setShowEdit}
          />
        </div>

        {/* Tabs */}
        <div className="mt-6">
          <div className={`rounded-xl shadow p-1 flex max-w-md mx-auto ${
            !isDarkMode ? "bg-gray-800" : "bg-white"
          }`}>
            {["posts", "media", "likes"].map((tab) => {
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                    activeTab === tab
                      ? "bg-indigo-600 text-white"
                      : !isDarkMode 
                        ? "text-gray-400 hover:text-gray-100" 
                        : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              );
            })}
          </div>

          {/* Posts Tab */}
          {activeTab === "posts" && (
            <div className="mt-6 flex flex flex-col items-center gap-6">
              {posts.map((post) => {
                return <PostCard key={post._id} post={post} />;
              })}
            </div>
          )}

          {/* Media Tab */}
          {activeTab === "media" && (
            <div className="flex flex-wrap mt-6 max-w-6xl">
              {posts
                .filter((post) => post.image_urls.length > 0)
                .map((post) => {
                  return (
                    <>
                      {post.image_urls.map((image, index) => {
                        return (
                          <Link
                            key={index}
                            target="_blank"
                            to={image}
                            className="relative group"
                          >
                            <img
                              src={image}
                              alt="Media Content"
                              className="w-64 aspect-video object-cover"
                            />

                            <p className="absolute bottom-0 right-0 text-xs p-1 px-3 backdrop-blur-xl text-white opacity-0 group-hover:opacity-100 transition duration-300">
                              Posted {moment(post.createdAt).fromNow()}
                            </p>
                          </Link>
                        );
                      })}
                    </>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEdit && <ProfileModel setShowEdit={setShowEdit}/>}
    </div>
  ) : (
    <Loading />
  );
};

export default Profile;