import nodemailer from "nodemailer";
import { renderToStaticMarkup } from "react-dom/server";

// Create reusable transporter
const createTransporter = () => {
    const host = process.env.GMAIL_SMTP_HOST;
    const port = parseInt(process.env.GMAIL_SMTP_PORT || "587");
    const user = process.env.GMAIL_SMTP_USER;
    const pass = process.env.GMAIL_SMTP_PASS;

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
            user,
            pass,
        },
    });
};

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const appName = "Meridian";
const fromName = process.env.GMAIL_FROM_NAME || appName;
const fromEmail = process.env.GMAIL_FROM_EMAIL || process.env.GMAIL_SMTP_USER || "noreply@meridian.app";

// Base email template with Meridian branding
const createEmailTemplate = (content: string, title: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Meridian</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f0fdfa;
      color: #334155;
      line-height: 1.6;
    }
    
    .email-container {
      max-width: 480px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    
    .email-card {
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }
    
    .email-header {
      background: linear-gradient(135deg, #14b8a6, #0d9488);
      padding: 32px;
      text-align: center;
    }
    
    .logo-container {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      backdrop-filter: blur(8px);
    }
    
    .logo-svg {
      width: 36px;
      height: 36px;
    }
    
    .app-name {
      color: white;
      font-size: 24px;
      font-weight: 700;
      margin-top: 12px;
      letter-spacing: -0.5px;
    }
    
    .email-body {
      padding: 32px;
    }
    
    .email-title {
      font-size: 20px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 16px;
    }
    
    .email-text {
      color: #475569;
      font-size: 15px;
      margin-bottom: 24px;
    }
    
    .button-container {
      text-align: center;
      margin: 28px 0;
    }
    
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #14b8a6, #0d9488);
      color: white;
      font-weight: 600;
      font-size: 15px;
      padding: 14px 32px;
      border-radius: 10px;
      text-decoration: none;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      box-shadow: 0 4px 6px -1px rgba(20, 184, 166, 0.3);
    }
    
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 12px -2px rgba(20, 184, 166, 0.4);
    }
    
    .link-text {
      color: #14b8a6;
      text-decoration: none;
      font-weight: 500;
    }
    
    .link-text:hover {
      text-decoration: underline;
    }
    
    .email-footer {
      background: #f8fafc;
      padding: 24px 32px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    
    .footer-text {
      font-size: 13px;
      color: #94a3b8;
    }
    
    .footer-link {
      color: #14b8a6;
      text-decoration: none;
    }
    
    .footer-tagline {
      font-size: 12px;
      color: #cbd5e1;
      margin-top: 8px;
    }
    
    .warning-box {
      background: #fef3c7;
      border: 1px solid #fcd34d;
      border-radius: 8px;
      padding: 12px 16px;
      margin: 16px 0;
      font-size: 13px;
      color: #92400e;
    }
    
    @media (max-width: 480px) {
      .email-container {
        padding: 20px 12px;
      }
      
      .email-header {
        padding: 24px;
      }
      
      .email-body {
        padding: 24px;
      }
      
      .button {
        width: 100%;
        text-align: center;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-card">
      <div class="email-header">
        <div class="logo-container">
          <svg class="logo-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="32" height="32" rx="8" fill="white" fill-opacity="0.2"/>
            <g transform="translate(4, 4)">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round">
                <path d="M12 2L12 22M2 12L22 12M5 5L19 19M19 5L5 19" opacity="0.3" />
                <circle cx="12" cy="12" r="3" fill="white" stroke="none" />
                <circle cx="12" cy="4" r="1.5" fill="white" stroke="none" opacity="0.6" />
                <circle cx="12" cy="20" r="1.5" fill="white" stroke="none" opacity="0.6" />
                <circle cx="4" cy="12" r="1.5" fill="white" stroke="none" opacity="0.6" />
                <circle cx="20" cy="12" r="1.5" fill="white" stroke="none" opacity="0.6" />
              </svg>
            </g>
          </svg>
        </div>
        <div class="app-name">${appName}</div>
      </div>
      
      <div class="email-body">
        ${content}
      </div>
      
      <div class="email-footer">
        <p class="footer-text">
          Having trouble? Copy and paste this link into your browser:<br>
          <span style="color: #64748b; font-size: 12px; word-break: break-all;">{{link}}</span>
        </p>
        <p class="footer-tagline">Decode your body's signals with AI-powered health correlation.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

// Email sending function
const sendEmail = async (to: string, subject: string, html: string) => {
    // Check if Gmail SMTP is configured
    if (!process.env.GMAIL_SMTP_USER || !process.env.GMAIL_SMTP_PASS ||
        process.env.GMAIL_SMTP_USER === "your-email@gmail.com") {
        console.log("----------------------------------------");
        console.log("📧 Email Service (Simulated)");
        console.log(`To: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log("Note: Gmail SMTP not configured - set GMAIL_SMTP_USER and GMAIL_SMTP_PASS in .env.local");
        console.log("----------------------------------------");
        return;
    }

    try {
        const transporter = createTransporter();

        const info = await transporter.sendMail({
            from: `"${fromName}" <${fromEmail}>`,
            to,
            subject,
            html,
        });

        console.log("✅ Email sent successfully:", info.messageId);
        return info;
    } catch (error) {
        console.error("❌ Email sending failed:", error);
        throw error;
    }
};

export const sendVerificationEmail = async (
    email: string,
    token: string
) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    const content = `
    <h1 class="email-title">Verify your email address</h1>
    <p class="email-text">
      Welcome to <strong>${appName}</strong>! To get started, please confirm your email address by clicking the button below.
    </p>
    
    <div class="button-container">
      <a href="${confirmLink}" class="button">Confirm Email</a>
    </div>
    
    <p class="email-text">
      This link will expire in 24 hours. If you didn't create an account with ${appName}, you can safely ignore this email.
    </p>
    
    <div class="warning-box">
      <strong>Note:</strong> For security reasons, please don't share this verification link with anyone.
    </div>
  `;

    const html = createEmailTemplate(content, "Verify your email");

    await sendEmail(email, "Verify your email — Meridian", html);
};

export const sendPasswordResetEmail = async (
    email: string,
    token: string
) => {
    const resetLink = `${domain}/auth/reset-password?token=${token}`;

    const content = `
    <h1 class="email-title">Reset your password</h1>
    <p class="email-text">
      We received a request to reset your <strong>${appName}</strong> password. Click the button below to create a new password.
    </p>
    
    <div class="button-container">
      <a href="${resetLink}" class="button">Reset Password</a>
    </div>
    
    <p class="email-text">
      This link will expire in 1 hour. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
    </p>
    
    <div class="warning-box">
      <strong>Security reminder:</strong> If you didn't request this, someone may be trying to access your account. We recommend enabling two-factor authentication.
    </div>
  `;

    const html = createEmailTemplate(content, "Reset your password");

    await sendEmail(email, "Reset your password — Meridian", html);
};
