import { NextResponse } from "next/server";
import { ResetSchema } from "@/lib/schemas";
import { findUserByEmail, generatePasswordResetToken } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/mail";

export async function POST(req: Request) {
    const { email } = await req.json();

    const validatedFields = ResetSchema.safeParse({ email });

    if (!validatedFields.success) {
        return NextResponse.json({ error: "Invalid email!" }, { status: 400 });
    }

    const existingUser = await findUserByEmail(email);

    if (!existingUser) {
        // Prevent revealing whether the email exists or not for security
        return NextResponse.json({ error: "Email not found!" }, { status: 404 });
    }

    const passwordResetToken = await generatePasswordResetToken(email);

    if (passwordResetToken) {
        await sendPasswordResetEmail(email, passwordResetToken.token);
    }

    return NextResponse.json({ success: "Reset email sent!" }, { status: 200 });
}
