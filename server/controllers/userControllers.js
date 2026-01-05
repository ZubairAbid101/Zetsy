import { format } from "path";
import imageKitClient from "../configs/imagekit.js";
import User from "../models/User.js";
import fs from "fs";

// Get user data
export const getUserData = async (req, res) => {
  try {
    const { userId } = req.auth;

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
    const { userId } = req.auth;

    // Get updated data from request body
    const { username, bio, location, full_name } = req.body;

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
      const buffer = fs.readFileSync(profile.path);
      const response = await imageKitClient.upload({
        file: buffer,
        fileName: profile.originalname,
      });

      // Generate URL
      const url = imageKitClient.url({
        path: response.filePath,
        transformation: [
          { quality: "auto" },
          { format: "webp" },
          { width: "512" },
        ],
      });

      // Update profile picture URL
      updatedData.profile_picture = url;
    }

    // Send cover photo to ImageKit
    if (cover) {
      // Save cover photo to ImageKit
      const buffer = fs.readFileSync(cover.path);
      const response = await imageKitClient.upload({
        file: buffer,
        fileName: cover.originalname,
      });

      // Generate URL
      const url = imageKitClient.url({
        path: response.filePath,
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
