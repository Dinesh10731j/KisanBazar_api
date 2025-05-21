"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendForgotPasswordEmail = sendForgotPasswordEmail;
// utils/sendPasswordEmail.ts
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config/config"));
const { Gmail_User, Gmail_Pass } = config_1.default;
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: Gmail_User,
        pass: Gmail_Pass,
    },
});
function sendForgotPasswordEmail(toEmail, password) {
    return __awaiter(this, void 0, void 0, function* () {
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
            yield transporter.sendMail(mailOptions);
            console.log(`Password email sent to ${toEmail}`);
        }
        catch (error) {
            console.error("Error sending email:", error);
            throw new Error("Failed to send password email.");
        }
    });
}
