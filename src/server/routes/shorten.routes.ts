import { z } from "zod";
import { router, publicProcedure } from "../trpc.ts";
import { type Shorten, shortenModel } from "../models/shorten.model.ts";
import { randomUUID } from "crypto";

const SHORTENS: Shorten[] = [
  {
    id: "1",
    url: "https://www.example.com/some/long/url",
    shortCode: "abc123",
    createdAt: "2021-09-01T12:00:00Z",
    updatedAt: "2021-09-01T12:00:00Z",
  },
];

export const shortenRouter = router({
  createShortenUrl: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/shorten.createShortenUrl",
        tags: ["Shorten"],
        description: "Create shorten url for long url",
        contentTypes: ["application/json"],
      },
    })
    .input(
      z.object({
        url: z.url().describe("Original Long URL"),
      }),
    )
    .output(shortenModel)
    .mutation(({ input }) => {
      const id = randomUUID();
      const shorten: Shorten = {
        id: id,
        url: input.url,
        shortCode: `${id.slice(0, 6)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      SHORTENS.push(shorten);
      return shorten;
    }),
  getRecentShortenUrls: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/shorten.getRecentShortenUrls",
        tags: ["Shorten"],
        description: "Get recent shorten urls",
        contentTypes: ["application/json"],
      },
    })
    .input(z.undefined())
    .output(z.array(shortenModel))
    .query(() => {
      return SHORTENS;
    }),
});
