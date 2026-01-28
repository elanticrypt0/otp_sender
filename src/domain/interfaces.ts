import type { NewOTP, OTP } from "./schema";

export interface IOTPRepository {
    create(otp: NewOTP): Promise<void>;
    findLatestValid(): Promise<OTP | undefined>;
    findById(id: number): Promise<OTP | undefined>;
    validate(id: number): Promise<void>;
    invalidate(id: number): Promise<void>;
    findAllValid(): Promise<OTP[]>; // Optional, for verification
}

export interface IOTPService {
    generateOTP(): Promise<string>;
    validateOTP(code: string): Promise<{ valid: boolean; message?: string }>;
}
