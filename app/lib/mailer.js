import nodemailer from "nodemailer";

export const sendResetEmail = async (to, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Your App Name" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Reset your password`,
    html: `
      <p>Hello,</p>
      <p>You requested to reset your password.</p>
      <p>Click the link below to reset it:</p>
      <a href="${resetLink}" style="color: blue;">Reset Password</a>
      <p>If you didn’t request this, please ignore this email.</p>
    `,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Reset email sent:", info.messageId);
};