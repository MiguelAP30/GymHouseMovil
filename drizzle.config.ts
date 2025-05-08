import type { Config } from 'drizzle-kit';
import { PgSchema } from 'drizzle-orm/pg-core';

export default {
    schema: "./db/schema.ts",
    out: "./drizzle", // Output directory for generated files
    dialect: "sqlite",
    driver: "expo"
}   satisfies Config
