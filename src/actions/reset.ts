"use server";

import * as z from "zod";
import { ResetSchema } from "@/lib/schemas";
import { findUserByEmail, generatePasswordResetToken } from "@/lib/db";
import { sendPasswordResetEmail } from "@/lib/mail";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid email!" };
    }

    const { email } = validatedFields.data;

    const existingUser = await findUserByEmail(email);

    if (!existingUser) {
        // We shouldn't reveal if user exists or not for security, 
        // but for UX in this project we might want to say "Email sent!" anyway.
        // Or return error "Email not found" if we want to be helpful but less secure.
        // Let's return success to prevent enumeration, but we won't send email.
        // Actually, for dev/MVP, let's just return error so user knows they typed wrong.
        return { error: "Email not found!" };
    }

    const passwordResetToken = await generatePasswordResetToken(email);

    if (passwordResetToken) {
        await sendPasswordResetEmail(email, passwordResetToken.token);
    }

    return { success: "Reset email sent!" };
};
