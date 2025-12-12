import { Resend } from "resend";

// Temporarily hardcode API key as fallback due to Turbopack env caching issues
const apiKey = process.env.RESEND_API_KEY || "re_BAfjf6FW_HYwDeVCfebfgDX75Q3cU9Cmn";

export const resend = new Resend(apiKey);
