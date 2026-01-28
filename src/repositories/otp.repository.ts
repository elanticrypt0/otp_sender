import { db } from "./db";
import { otps, type NewOTP, type OTP } from "../domain/schema";
import type { IOTPRepository } from "../domain/interfaces";
import { desc, eq, gt, and } from "drizzle-orm";

export class OTPRepository implements IOTPRepository {
    async create(otp: NewOTP): Promise<void> {
        await db.insert(otps).values(otp);
    }

    async findLatestValid(): Promise<OTP | undefined> {
        const [otp] = await db
            .select()
            .from(otps)
            .where(
                and(
                    eq(otps.validated, false),
                    gt(otps.expiresAt, new Date())
                )
            )
            .orderBy(desc(otps.createdAt))
            .limit(1);
        return otp;
    }

    async findById(id: number): Promise<OTP | undefined> {
        const [otp] = await db.select().from(otps).where(eq(otps.id, id));
        return otp;
    }

    async validate(id: number): Promise<void> { // Mark as validated
        await db.update(otps).set({ validated: true }).where(eq(otps.id, id));
    }

    async invalidate(id: number): Promise<void> {
        // Logic for invalidation if needed, for instance setting expired or validated true
        // In this specific flow, 'validating' effectively consumes it.
        await this.validate(id);
    }

    async findAllValid(): Promise<OTP[]> {
        return db.select().from(otps).where(
            and(
                eq(otps.validated, false),
                gt(otps.expiresAt, new Date())
            )
        );
    }
}
