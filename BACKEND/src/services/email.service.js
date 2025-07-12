import nodemailer from "nodemailer";
import crypto from "crypto";

// Email transporter configuration
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: "gmail", // You can change this to your preferred email service
    auth: {
      user: process.env.EMAIL_USER || "your-email@gmail.com",
      pass: process.env.EMAIL_PASS || "your-app-password",
    },
  });
};

// Generate OTP
export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Send OTP email
export const sendOTPEmail = async (email, otp, name) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER || "your-email@gmail.com",
    to: email,
    subject: "Email Verification - Your OTP Code",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-container { background: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0; border: 2px dashed #667eea; }
            .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; margin: 10px 0; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; color: #856404; padding: 15px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔐 Email Verification</h1>
            <p>Welcome to LinkShort!</p>
          </div>
          
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Thank you for signing up! To complete your registration and verify your email address, please use the OTP code below:</p>
            
            <div class="otp-container">
              <p><strong>Your verification code is:</strong></p>
              <div class="otp-code">${otp}</div>
              <p><small>This code will expire in 10 minutes</small></p>
            </div>
            
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> Never share this code with anyone. Our support team will never ask for this code.
            </div>
            
            <p>If you didn't create an account with us, please ignore this email.</p>
            
            <div class="footer">
              <p>© 2024 LinkShort. All rights reserved.</p>
              <p>This is an automated message, please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send verification email");
  }
};

// Send welcome email after successful verification
export const sendWelcomeEmail = async (email, name) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.EMAIL_USER || "your-email@gmail.com",
    to: email,
    subject: "Welcome to LinkShort! 🎉",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to LinkShort</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .feature { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #667eea; }
            .cta-button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 15px 30px; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Welcome to LinkShort!</h1>
            <p>Your account has been successfully verified</p>
          </div>
          
          <div class="content">
            <h2>Hello ${name}!</h2>
            <p>Congratulations! Your email has been verified and your account is now active. You can now enjoy all the features of LinkShort:</p>
            
            <div class="feature">
              <h3>🔗 Unlimited URL Shortening</h3>
              <p>Create as many short URLs as you need without any restrictions.</p>
            </div>
            
            <div class="feature">
              <h3>📊 Advanced Analytics</h3>
              <p>Track clicks, geographic data, and other insights for all your links.</p>
            </div>
            
            <div class="feature">
              <h3>🎨 Custom URLs</h3>
              <p>Create branded short URLs with custom aliases.</p>
            </div>
            
            <div class="feature">
              <h3>🔒 Secure & Reliable</h3>
              <p>Your links are protected with enterprise-grade security.</p>
            </div>
            
            <div style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || "http://localhost:5173"}/dashboard" class="cta-button">
                Start Shortening URLs →
              </a>
            </div>
            
            <p>If you have any questions or need help getting started, feel free to reach out to our support team.</p>
            
            <div class="footer">
              <p>© 2024 LinkShort. All rights reserved.</p>
              <p>Happy link shortening! 🚀</p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    // Don't throw error for welcome email failure as it's not critical
    return false;
  }
};
