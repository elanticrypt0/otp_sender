import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const otps = sqliteTable('otps', {
    id: integer('id').primaryKey(),
    code: text('code').notNull(), // Encrypted/Hashed
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`CURRENT_TIMESTAMP`),
    expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
    validated: integer('validated', { mode: 'boolean' }).notNull().default(false),
});

export type OTP = typeof otps.$inferSelect;
export type NewOTP = typeof otps.$inferInsert;
