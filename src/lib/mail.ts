import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const sendVerificationEmail = async (
    email: string,
    token: string
) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    if (!process.env.RESEND_API_KEY) {
        console.log("----------------------------------------");
        console.log("📧 Email Service (Simulated)");
        console.log(`To: ${email}`);
        console.log(`Subject: Confirm your email`);
        console.log(`Link: ${confirmLink}`);
        console.log("----------------------------------------");
        return;
    }

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Confirm your email",
        html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
    });
};

export const sendPasswordResetEmail = async (
    email: string,
    token: string
) => {
    const resetLink = `${domain}/auth/reset-password?token=${token}`;

    if (!process.env.RESEND_API_KEY) {
        console.log("----------------------------------------");
        console.log("📧 Email Service (Simulated)");
        console.log(`To: ${email}`);
        console.log(`Subject: Reset your password`);
        console.log(`Link: ${resetLink}`);
        console.log("----------------------------------------");
        return;
    }

    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
    });
};
