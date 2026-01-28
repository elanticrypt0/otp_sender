import { randomBytes } from "crypto";

const key = randomBytes(32).toString("hex");

const content = `// This file is auto-generated. Do not edit manually.
export const privateKey = "${key}";
`;

await Bun.write("src/config/private.key.ts", content);

console.log("✅ Private key generated at src/config/private.key.ts");
