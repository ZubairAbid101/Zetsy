import express from "express";
import {
  acceptConnectionRequest,
  discoverUsers,
  followUser,
  getUserConnections,
  getUserData,
  getUserProfile,
  sendConnectionRequest,
  unfollowUser,
  updateUserData,
} from "../controllers/userControllers.js";
import { protect } from "../middleware/auth.js";
import { upload } from "../configs/multer.js";
import { getRecentMessages } from "../controllers/messageController.js";

const userRouter = express.Router();

// Routes
userRouter.get("/data", protect, getUserData);

userRouter.post(
  "/update",
  protect,
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "cover", maxCount: 1 },
  ]),
  updateUserData,
);

userRouter.post("/discover", protect, discoverUsers);
userRouter.post("/follow", protect, followUser);
userRouter.post("/unfollow", protect, unfollowUser);
userRouter.post("/connect", protect, sendConnectionRequest);
userRouter.post("/accept", protect, acceptConnectionRequest);
userRouter.get("/connections", protect, getUserConnections);
userRouter.post("/profile", protect, getUserProfile);
userRouter.get("/recent-messages", protect, getRecentMessages);

export default userRouter;
