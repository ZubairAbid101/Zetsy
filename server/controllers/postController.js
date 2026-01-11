import fs from "fs";
import imageKitClient from "../configs/imageKit.js";
import Post from "../models/Post.js";

// Add post
export const addPost = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { content, post_type } = req.body;
    const images = req.files;

    let image_urls = [];

    if (images && images.length > 0) {
      image_urls = await Promise.all(
        images.map(async (image) => {
          // Upload image to ImageKit
          const buffer = fs.createReadStream(image.path);
          const response = await imageKitClient.files.upload({
            file: buffer,
            fileName: image.originalname,
            folder: "/zetsy/posts",
          });

          // Generate URL
          const url = imageKitClient.helper.buildSrc({
            urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
            src: response.url,
            transformation: [
              { width: "1280" },
              { quality: "auto" },
              { format: "webp" },
            ],
          });

          return url;
        })
      );

      await Post.create({
        user: userId,
        content,
        image_urls,
        post_type,
      });

      res.json({ success: true, message: "Post created successfully." });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
