import { Inngest } from "inngest";
import User from "../models/User.js";

export const inngest = new Inngest({ id: "zetsy-app" });

// Save user data to db
const syncUserCreate = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    // Get user data from event
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    // Create username from email
    let username = email_addresses[0].email_address.split("@")[0];

    // Check if username already exists
    const user = await User.findOne({ username });
    if (user) {
      username = username + Math.floor(Math.random() * 10000);
    }

    // Create new user in db
    const userData = {
      _id: id,
      full_name: `${first_name} ${last_name}`,
      username,
      email: email_addresses[0].email_address,
      profile_picture: image_url,
    };

    await User.create(userData);
  }
);

// Update user data in db
const syncUserUpdate = inngest.createFunction(
  { id: "sync-user-update-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    // Get user data from event
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    // Update user in db
    const updatedUserData = {
      full_name: `${first_name} ${last_name}`,
      email: email_addresses[0].email_address,
      profile_picture: image_url,
    };

    await User.findByIdAndUpdate(id, updatedUserData);
  }
);

// Delete user data from db
const syncUserDelete = inngest.createFunction(
  { id: "sync-user-delete-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;

    await User.findByIdAndDelete(id);
  }
);

export const functions = [syncUserCreate, syncUserUpdate, syncUserDelete];
