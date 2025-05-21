// utils/sendPasswordEmail.ts
import nodemailer from "nodemailer";
import Configuration from "../config/config";

const { Gmail_User, Gmail_Pass } = Configuration;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: Gmail_User,
    pass: Gmail_Pass,
  },
});


export async function sendForgotPasswordEmail(toEmail: string, password: string): Promise<void> {
  const mailOptions = {
    from: `"Support Team" <${Gmail_User}>`,
    to: toEmail,
    subject: "Your Forgotten Password",
    html: `
      <h3>Hello,</h3>
      <p>You requested to retrieve your password. Here it is:</p>
      <p><strong>${password}</strong></p>
      <p>If you didn't request this, please change your password immediately.</p>
      <hr/>
      <small>This is an automated message. Please do not reply.</small>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password email sent to ${toEmail}`);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send password email.");
  }
}
