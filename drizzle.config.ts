import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default defineConfig({
    schema: "./src/lib/db/schema.ts",
    out: "./src/lib/db/migrations",
    dialect: "postgresql",
    dbCredentials: {
        url: "postgresql://neondb_owner:npg_h7ObmgyNET5H@ep-autumn-water-aio1xlfs-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
    },
});
