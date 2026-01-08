import { format } from "path";
import imageKitClient from "../configs/imagekit.js";
import User from "../models/User.js";
import fs from "fs";

// Get user data
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth();

    const user = await User.findById(userId);

    // User not found
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      message: "User data retrieved successfully",
      data: user,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Update user data
export const updateUserData = async (req, res) => {
  try {
    const { userId } = req.auth();

    // Get updated data from request body
    let { username, bio, location, full_name } = req.body;

    const tempUser = await User.findById(userId);

    // Username not provided
    if (!username) {
      username = tempUser.username;
    }

    // Check if username is taken by another user
    if (username !== tempUser.username) {
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        username = tempUser.username;
      }
    }

    const updatedData = {
      username,
      bio,
      location,
      full_name,
    };

    // User provides profile and cover picture
    const profile = req.files.profile && req.files.profile[0];
    const cover = req.files.cover && req.files.cover[0];

    // Send profile picture to ImageKit
    if (profile) {
      // Save profile picture to ImageKit
      const buffer = fs.createReadStream(profile.path);
      const response = await imageKitClient.files.upload({
        file: buffer,
        fileName: profile.originalname,
      });

      // Generate URL
      const url = imageKitClient.helper.buildSrc({
        urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
        src: response.url,
        transformation: [
          { width: "400" },
          { quality: "auto" },
          { format: "webp" },
        ],
      });

      // Update profile picture URL
      updatedData.profile_picture = url;
    }

    // Send cover photo to ImageKit
    if (cover) {
      // Save cover photo to ImageKit
      const buffer = fs.createReadStream(cover.path);
      const response = await imageKitClient.files.upload({
        file: buffer,
        fileName: cover.originalname,
      });

      // Generate URL
      const url = imageKitClient.helper.buildSrc({
        urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
        src: response.url,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "1280" },
        ],
      });

      // Update cover picture URL
      updatedData.cover_photo = url;
    }

    // Update user data in database
    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    });

    res.json({
      success: true,
      message: "User data updated successfully",
      data: user,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Find users by name or username or email or location
export const discoverUsers = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { input } = req.body;

    const users = await User.find({
      $or: [
        { username: new RegExp(input, "i") },
        { full_name: new RegExp(input, "i") },
        { email: new RegExp(input, "i") },
        { location: new RegExp(input, "i") },
      ],
    });

    const filteredUsers = users.filter((user) => user._id !== userId);

    res.json({
      success: true,
      message: "Users retrieved successfully",
      data: filteredUsers,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Follow user
export const followUser = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { followId } = req.body;

    const user = await User.findById(userId);

    if (user.following.includes(followId)) {
      return res.json({
        success: false,
        message: "Already following this user",
      });
    }

    user.following.push(followId);
    await User.save();

    const followedUser = await User.findById(followId);
    followedUser.followers.push(userId);
    await followedUser.save();

    res.json({ success: true, message: "User followed successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Unfollow user
export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { unfollowId } = req.body;

    // Remove unfollowId from user's following list
    const user = await User.findById(userId);
    if (!user.following.includes(unfollowId)) {
      return res.json({
        success: false,
        message: "You are not following this user",
      });
    }
    user.following = user.following.filter((id) => id !== unfollowId);
    await user.save();

    // Remove userId from unfollowed user's followers list
    const unfollowedUser = await User.findById(unfollowId);
    unfollowedUser.followers = unfollowedUser.followers.filter(
      (id) => id !== userId
    );
    await unfollowedUser.save();

    res.json({ success: true, message: "User unfollowed successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
