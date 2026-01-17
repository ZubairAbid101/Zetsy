import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    from_user_id: { type: String, ref: "User", required: true },
    to_user_id: { type: String, ref: "User", required: true },
    message_type: { type: String, enum: ["text", "image"], default: "text" },
    message_text: { type: String, trim: true, required: true },
    media_url: { type: String, trim: true },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true, minimize: false },
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
