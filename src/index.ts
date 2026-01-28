import { Elysia, t } from "elysia";
import { OTPService } from "./services/otp.service";
import { config } from "./config/config";

const app = new Elysia()
    .decorate('otpService', new OTPService())
    .group('/api/otp', (app) => app
        .post('/generate', async ({ otpService }) => {
            const code = await otpService.generateOTP();
            return {
                success: true,
                message: "OTP generated",
                otp: code // Returning plain text as requested 
            };
        })
        .post('/validate', async ({ otpService, body, set }) => {
            const result = await otpService.validateOTP(body.code);
            if (!result.valid) {
                set.status = 400;
                return { success: 0, message: result.message };
            }
            return { success: 1, message: "OTP Validated successfully" };
        }, {
            body: t.Object({
                code: t.String()
            })
        })
    )
    .listen(config.port);

console.log(
    `🦊 OTP Service is running at ${app.server?.hostname}:${app.server?.port}`
);
