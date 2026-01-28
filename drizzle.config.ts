import type { Config } from "drizzle-kit";

export default {
    schema: "./src/domain/schema.ts",
    out: "./drizzle",
    dialect: "sqlite",
    dbCredentials: {
        url: "file:./sqlite.db",
    },
} satisfies Config;
