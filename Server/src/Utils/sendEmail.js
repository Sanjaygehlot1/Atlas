import nodemailer from 'nodemailer';
import { getVerificationEmailTemplate } from './emailTemplate.js';

const transporter = nodemailer.createTransport({
    service: 'gmail', 
    secure: false, 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
});

export const sendVerificationEmail = async (to, name, verificationCode) => {
    try {
        const mailOptions = {
            from: `"Atlas College App" <${process.env.EMAIL_USER}>`,
            to: to,
            subject: 'Your Verification Code',
            html: getVerificationEmailTemplate(name, verificationCode),
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Verification email sent successfully to ${to}. Message ID: ${info.messageId}`);
        return info;

    } catch (error) {
        console.error("Error sending verification email:", error);
        throw new Error("Failed to send verification email. Please try again later.");
    }
};