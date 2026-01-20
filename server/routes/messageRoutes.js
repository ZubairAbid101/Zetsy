import express from "express";
import {
  getMessages,
  sendMessage,
  sseController,
} from "../controllers/messageController.js";
import { upload } from "../configs/multer.js";
import { protect } from "../middleware/auth.js";

const messageRouter = express.Router();

messageRouter.get("/:userId", sseController);
messageRouter.post("/send", protect, upload.single("image"), sendMessage);
messageRouter.post("/get-messages", protect, getMessages);

export default messageRouter;