/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios from "axios";
import config from "../config";

interface SendEmailPayload {
  to: string;         // recipient email
  bcc?: string[];     // optional BCC recipients
  subject: string;
  html: string;
  replyTo?: string;   // optional reply-to email
}

export const sendEmail = async ({
  to,
  bcc,
  subject,
  html,
  replyTo,
}: SendEmailPayload) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          email: "travelynk@zudpck.com",
          name: process.env.BREVO_SENDER_NAME ,
        },
        to: [{ email: to }],
        bcc: bcc?.map((email) => ({ email })),
        replyTo: replyTo ? { email: replyTo } : undefined,
        subject,
        htmlContent: html,
        headers: {

          "X-Custom-Header": "Custom Value",
        },
      },
      {
        headers: {
          "api-key": config.brevo.BREVO_API_KEY!,
          "Content-Type": "application/json",
          accept: "application/json",
        },
      }
    );

    console.log("Brevo Response:", response.data);
    return response.data.messageId;
  } catch (error: any) {
    console.error("Error sending email:", error.response?.data || error.message);
    throw new Error("Failed to send email");
  }
};
