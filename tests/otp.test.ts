import { describe, expect, it, beforeAll } from "bun:test";
import { OTPService } from "../src/services/otp.service";
import { OTPRepository } from "../src/repositories/otp.repository";

// Mock Repository or use real one with test DB? 
// For speed and simplicity in this env, let's use the real one but maybe we should've made DB config dynamic.
// Since it's a file based sqlite, it's fine.

describe("OTP Service", () => {
    const service = new OTPService(new OTPRepository());
    let generatedCode: string;

    it("should generate a 6-character alphanumeric code", async () => {
        generatedCode = await service.generateOTP();
        expect(generatedCode).toHaveLength(6);
        expect(generatedCode).toMatch(/^[A-Z0-9]+$/);
    });

    it("should validate the generated code", async () => {
        const result = await service.validateOTP(generatedCode);
        expect(result.valid).toBe(true);
    });

    it("should fail validation for wrong code", async () => {
        const result = await service.validateOTP("000000");
        expect(result.valid).toBe(false);
    });

    it("should not allow reusing the code", async () => {
        // First validation (already check above, but let's assume it consumed it if implemented that way)
        // My implementation consumes it: await this.otpRepository.validate(otp.id);

        const result = await service.validateOTP(generatedCode);
        expect(result.valid).toBe(false);
    });
});
