import { z } from "zod";

export const shortenModel = z.object({
  id: z.string().describe("ID of the shorten url"),
  url: z.url().describe("Original url"),
  shortCode: z.string().describe("Short code of the shorten url"),
  createdAt: z.string().describe("Creation datetime of the shorten url"),
  updatedAt: z.string().describe("Update datetime of the shorten url"),
});

export type Shorten = z.infer<typeof shortenModel>;
