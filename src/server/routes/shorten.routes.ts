import { z } from "zod";
import { router, publicProcedure } from "../trpc.ts";
import { createShortenRequest, shortenModel } from "../models/shorten.model.ts";
import ShortenService from "../services/shorten.service.ts";

export const shortenRouter = router({
  createShortenUrl: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: "/shorten.createShortenUrl",
        tags: ["Shorten"],
        description: "Create shorten url form long url",
        contentTypes: ["application/json"],
      },
    })
    .input(createShortenRequest)
    .output(shortenModel)
    .mutation(({ input }) => {
      return ShortenService.createShortenUrl(input.url);
    }),
  getOriginalUrl: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: "/shorten.getOriginalUrl",
        tags: ["Shorten"],
        description: "Get original  url from short code",
        contentTypes: ["application/json"],
      },
    })
    .input(
      z.object({
        shortCode: z.string().describe("Short code of the shorten url"),
      }),
    )
    .output(shortenModel)
    .query(({ input }) => {
      const shorten = ShortenService.getShortenByCode(input.shortCode);

      if (shorten === undefined) {
        throw new Error(`Shorten with code ${input.shortCode} not found`);
      }

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
      return ShortenService.getRecentShortens();
    }),
});
