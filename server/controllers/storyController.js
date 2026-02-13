import fs from "fs";
import imageKitClient from "../configs/imageKit.js";
import Story from "../models/Story.js";
import User from "../models/User.js";
import { inngest } from "../inngest/index.js";

// Add user story
export const addUserStory = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { content, media_type, background_color } = req.body;
    const media = req.file;

    let url = ''

    // Upload media to ImageKit
    if (media_type == "image" || media_type == "video") {
      const buffer = fs.createReadStream(media.path);
      const response = await imageKitClient.files.upload({
        file: buffer,
        fileName: media.originalname,
        folder: "/zetsy/stories",
      });

      // Generate URL
      url = imageKitClient.helper.buildSrc({
        urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
        src: response.url,
      });
    }

      // Store story in DB
      const newStory = await Story.create({
        user: userId,
        content,
        media_url: url,
        media_type,
        background_color,
      });

      res.json({ success: true, message: "Story added successfully" });

      // Trigger story delete event
      await inngest.send({
        name: "app/story-delete",
        data: { storyId: newStory._id },
      });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get user stories
export const getUserStories = async (req, res) => {
  try {
    const { userId } = req.auth();
    const user = await User.findById(userId);

    // Get stories of self, connections, and following
    const userIds = [userId, ...user.connections, ...user.following];
    const stories = await Story.find({ user: { $in: userIds } })
      .populate("user")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      message: "Stories fetched successfully",
      stories,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
