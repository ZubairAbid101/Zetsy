import { Inngest } from "inngest";
import User from "../models/User.js";
import Connection from "../models/Connections.js";
import sendEmail from "../configs/nodeMailer.js";

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

// Send Pending Connection Email Reminder
const sendNewConnectionReminder = inngest.createFunction(
  { id: "send-connection-reminder" },
  { event: "app/connection-request" },
  async ({ event, step }) => {
    const { connectionId } = event.data;

    await step.run("send-connection-reminder-email", async () => {
      const connection = await Connection.findById(connectionId).populate(
        "from_user_id to_user_id"
      );
      const subject = "New Connection Request";
      const body = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                  <tr>
                    <td style="padding: 40px 30px; text-align: center; background-color: #4F46E5;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 24px;">New Connection Request</h1>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 30px;">
                      <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">Hi ${
                        connection.to_user_id.full_name
                      },</p>
                      <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">
                        <strong>${
                          connection.from_user_id.full_name
                        }</strong> wants to connect with you on Zetsy.
                      </p>
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                        <tr>
                          <td align="center">
                            <a href="${
                              process.env.FRONTEND_URL
                            }/connections" style="display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px;">View Request</a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin: 0; font-size: 14px; color: #666666;">
                        This is an automated reminder about a pending connection request.
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 20px 30px; background-color: #f9f9f9; text-align: center; border-top: 1px solid #eeeeee;">
                      <p style="margin: 0; font-size: 12px; color: #999999;">© ${new Date().getFullYear()} Zetsy. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      await sendEmail({
        to: connection.to_user_id.email,
        subject,
        body,
      });
    });

    const in24Hours = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await step.sleepUntil("reminder-email-in-24-hours", in24Hours);
    await step.run("send-connection-reminder-email-2", async () => {
      const connection = await Connection.findById(connectionId).populate(
        "from_user_id to_user_id"
      );

      if (connection.status === "pending") {
        const subject = "Reminder: Pending Connection Request";
        const body = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 20px;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden;">
                <tr>
                  <td style="padding: 40px 30px; text-align: center; background-color: #4F46E5;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px;">⏰ Connection Request Reminder</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 30px;">
                    <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">Hi ${
                      connection.to_user_id.full_name
                    },</p>
                    <p style="margin: 0 0 20px; font-size: 16px; color: #333333;">
                      You still have a pending connection request from <strong>${
                        connection.from_user_id.full_name
                      }</strong>.
                    </p>
                    <p style="margin: 0 0 20px; font-size: 16px; color: #666666;">
                      Don't miss out on expanding your network!
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                      <tr>
                        <td align="center">
                          <a href="${
                            process.env.FRONTEND_URL
                          }/connections" style="display: inline-block; padding: 12px 30px; background-color: #4F46E5; color: #ffffff; text-decoration: none; border-radius: 5px; font-size: 16px;">Review Request</a>
                        </td>
                      </tr>
                    </table>
                    <p style="margin: 0; font-size: 14px; color: #666666;">
                      This is a 24-hour reminder about your pending connection request.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 30px; background-color: #f9f9f9; text-align: center; border-top: 1px solid #eeeeee;">
                    <p style="margin: 0; font-size: 12px; color: #999999;">© ${new Date().getFullYear()} Zetsy. All rights reserved.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `;

        await sendEmail({
          to: connection.to_user_id.email,
          subject,
          body,
        });
      }
    });
  }
);

export const functions = [syncUserCreate, syncUserUpdate, syncUserDelete, sendNewConnectionReminder];
