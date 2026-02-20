"use server";

import { db } from "@/lib/db/drizzle";
import { users, verificationTokens } from "@/lib/db/schema";
import { getVerificationTokenByToken } from "@/lib/db";
import { findUserByEmail } from "@/lib/db";
import { eq } from "drizzle-orm";

export const newVerification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
        return { error: "Token does not exist!" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Token has expired!" };
    }

    const existingUser = await findUserByEmail(existingToken.identifier);

    if (!existingUser) {
        return { error: "Email does not exist!" };
    }

    await db.update(users).set({
        emailVerified: new Date(),
        email: existingToken.identifier,
    }).where(eq(users.id, existingUser.id));

    await db.delete(verificationTokens).where(eq(verificationTokens.identifier, existingToken.identifier));

    return { success: "Email verified!" };
};
