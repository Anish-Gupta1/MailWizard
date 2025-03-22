import { z } from "zod";

export const GmailComposeSchema = z.object({
  to: z.array(z.string().email()).nullable(),
  bcc: z.array(z.string().email()).nullable(),
  cc: z.array(z.string().email()).nullable(),
  subject: z.string().nullable(),
  description: z.string().nullable(),
});

export type GmailComposeType = z.infer<typeof GmailComposeSchema>;