import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db/drizzle";
import Google from "next-auth/providers/google";
import { findUserById, findUserByEmail } from "@/lib/db";
import { UserRole } from "@/types";
import { users, accounts } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/lib/schemas";

export const {
    handlers,
    auth,
    signIn,
    signOut,
} = NextAuth({
    pages: {
        signIn: "/auth/login",
        error: "/auth/error",
    },
    events: {
        async createUser({ user }) {
            // When OAuth creates a user, verify their email
            if (user.email) {
                const existingUser = await findUserByEmail(user.email);
                if (existingUser) {
                    // User already exists (from credentials) - just verify email
                    await db.update(users).set({ emailVerified: new Date() }).where(eq(users.email, user.email));
                }
            }
        },
        async linkAccount({ user }) {
            // When linking OAuth account, verify email
            if (user.id) {
                await db.update(users).set({ emailVerified: new Date() }).where(eq(users.id, user.id));
            }
        }
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            // Allow OAuth sign in
            if (account?.provider !== "credentials") {
                // For OAuth, check if user with same email exists
                // If so, allow sign in - the adapter will link accounts
                if (profile?.email) {
                    const existingUser = await findUserByEmail(profile.email);
                    if (existingUser) {
                        // User exists with this email - allow linking
                        return true;
                    }
                }
                return true;
            }

            const existingUser = user.id ? await findUserById(user.id) : null;

            // Prevent sign in without email verification for credentials
            if (!existingUser?.emailVerified) return false;

            return true;
        },
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }

            if (token.role && session.user) {
                (session.user as any).role = token.role as UserRole;
            }

            if (token.email && session.user) {
                session.user.email = token.email;
            }

            if (token.name && session.user) {
                session.user.name = token.name;
            }

            return session;
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            const existingUser = await findUserById(token.sub);
            if (!existingUser) return token;

            (token as any).role = existingUser.role;
            (token as any).email = existingUser.email;
            (token as any).name = existingUser.displayName;

            return token;
        }
    },
    adapter: DrizzleAdapter(db, {
        usersTable: users as any,
        accountsTable: accounts as any,
    }) as any,
    session: { strategy: "jwt" },
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
        }),
        Credentials({
            async authorize(credentials) {
                const validatedFields = LoginSchema.safeParse(credentials);

                if (validatedFields.success) {
                    const { email, password } = validatedFields.data;

                    const user = await findUserByEmail(email);
                    if (!user || !user.passwordHash) return null;

                    const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

                    if (passwordsMatch) return user;
                }

                return null;
            }
        })
    ],
});
