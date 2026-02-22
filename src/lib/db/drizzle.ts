/* ============================================================
   Meridian — Database Client
   Drizzle ORM client initialization.
   ============================================================ */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const sql = neon("postgresql://neondb_owner:npg_h7ObmgyNET5H@ep-autumn-water-aio1xlfs-pooler.c-4.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require");
export const db = drizzle(sql, { schema });
