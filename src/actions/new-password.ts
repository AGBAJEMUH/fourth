"use server";

import * as z from "zod";
import { NewPasswordSchema } from "@/lib/schemas";
import { getPasswordResetTokenByToken } from "@/lib/db";
import { findUserByEmail, updateUser } from "@/lib/db";
import { db } from "@/lib/db/drizzle";
import { passwordResetTokens } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const newPassword = async (
    values: z.infer<typeof NewPasswordSchema>,
    token?: string | null
) => {
    if (!token) {
        return { error: "Missing token!" };
    }

    const validatedFields = NewPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields!" };
    }

    const { password } = validatedFields.data;

    const existingToken = await getPasswordResetTokenByToken(token);

    if (!existingToken) {
        return { error: "Invalid token!" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Token has expired!" };
    }

    const existingUser = await findUserByEmail(existingToken.identifier);

    if (!existingUser) {
        return { error: "Email does not exist!" };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Update user password
    await updateUser(existingUser.id, {
        passwordHash: passwordHash,
    });

    // Delete token
    // Let's check schema for passwordResetTokens.
    // export const passwordResetTokens = pgTable("password_reset_tokens", {
    // identifier: text("identifier").notNull(),
    // token: text("token").notNull().unique(),
    // ...
    // }, (t) => ({ pk: unique().on(t.identifier, t.token) }));
    // So no ID column. I must delete by identifier/token.

    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.identifier, existingToken.identifier));

    return { success: "Password updated!" };
};
