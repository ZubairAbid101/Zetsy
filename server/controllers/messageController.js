import fs from "fs";
import imageKitClient from "../configs/imageKit.js";
import Message from "../models/Message.js";

// Store server side event connections
const connections = {};

export const sseController = (req, res) => {
  const { userId } = req.params;
  console.log(`SSE connection established for user: ${userId}`);

  // Set headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Add client response obj to connections obj
  connections[userId] = res;
  res.write("Connected to SSE stream\n\n");

  // Handle client disconnect
  req.on("close", () => {
    delete connections[userId];
    console.log(`SSE connection closed for user: ${userId}`);
  });
};

// Send message
export const sendMessage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { to_user_id, message_text } = req.body;
    const image = req.file;

    let message_type = image ? "image" : "text";
    let media_url = "";

    if (message_type === "image") {
      // Upload image to ImageKit
      const buffer = fs.createReadStream(image.path);
      const response = await imageKitClient.files.upload({
        file: buffer,
        fileName: image.originalname,
        folder: "/zetsy/messages",
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

      media_url = url;
    }

    const message = Message.create({
      from_user_id: userId,
      to_user_id,
      message_type,
      message_text,
      media_url,
    });

    res.json({
      success: true,
      message: "Message sent successfully",
      data: message,
    });

    // Send SSE to recipient if connected
    const messageWithUserData = await Message.findById(message._id).populate(
      "from_user_id",
    );

    if (connections[to_user_id]) {
      connections[to_user_id].write(
        `data: ${JSON.stringify(messageWithUserData)}\n\n`,
      );
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get messages between two users
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { to_user_id } = req.body;

    const messages = await Message.find({
      $or: [
        { from_user_id: userId, to_user_id },
        { from_user_id: to_user_id, to_user_id: userId },
      ],
    }).sort({ createdAt: 1 });

    // Mark messages as seen
    await Message.updateMany(
      { from_user_id: to_user_id, to_user_id: userId, seen: false },
      { $set: { seen: true } },
    );

    res.json({
      success: true,
      message: "Messages retrieved successfully",
      data: messages,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
