import express from "express";
import { protect } from "../middleware/auth.js";
import {
  addUserStory,
  getUserStories,
} from "../controllers/storyController.js";
import { upload } from "../configs/multer.js";

const storyRouter = express.Router();

storyRouter.post("/create", protect, upload.single("media"), addUserStory);
storyRouter.get("/get", protect, getUserStories);

export default storyRouter;