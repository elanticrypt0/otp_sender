import type { IOTPRepository } from "../domain/interfaces";
import { OTPRepository } from "../repositories/otp.repository";
import { privateKey } from "../config/private.key";
import { createHmac, randomBytes } from "crypto";

export class OTPService {
    constructor(private otpRepository: IOTPRepository = new OTPRepository()) { }

    async generateOTP(): Promise<string> {
        // Generate random bytes
        const randomBuffer = randomBytes(16);

        // Influence randomness with private key using HMAC
        const hmac = createHmac("sha256", privateKey);
        hmac.update(randomBuffer);
        const hash = hmac.digest("hex");

        // Convert hex hash to alphanumeric code
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let code = '';

        // Take 6 bytes from the hash to map to characters
        for (let i = 0; i < 6; i++) {
            const byteVal = parseInt(hash.substring(i * 2, i * 2 + 2), 16);
            code += chars.charAt(byteVal % chars.length);
        }

        const hashedCode = await Bun.password.hash(code, {
            algorithm: "argon2id", // Secure hashing
        });

        // Expires in 5 minutes
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

        await this.otpRepository.create({
            code: hashedCode,
            expiresAt: expiresAt,
            validated: false, // Explicitly set, though default covers it
        });

        return code;
    }

    async validateOTP(code: string): Promise<{ valid: boolean; message?: string }> {
        const otp = await this.otpRepository.findLatestValid();

        if (!otp) {
            return { valid: false, message: "No valid OTP found or expired." };
        }

        const isValid = await Bun.password.verify(code, otp.code);

        if (isValid) {
            await this.otpRepository.validate(otp.id);
            return { valid: true };
        } else {
            return { valid: false, message: "Invalid OTP code." };
        }
    }
}
