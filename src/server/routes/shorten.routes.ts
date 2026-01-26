import { z } from "zod";
import { router, publicProcedure } from "../trpc.ts";
import {
  createShortenRequest,
  type Shorten,
  shortenModel,
} from "../models/shorten.model.ts";
import { randomUUID } from "crypto";
import urlShortenService from "../services/urlShorten.service.ts";

const SHORTENS: Shorten[] = [
  {
    id: randomUUID(),
    url: "https://www.example.com/some/long/url",
    shortCode: urlShortenService.generateShortCode(
      "https://www.example.com/some/long/url",
    ),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

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
      const id = randomUUID();
      const shorten: Shorten = {
        id: id,
        url: input.url,
        shortCode: urlShortenService.generateShortCode(input.url),
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
      return SHORTENS.toReversed().slice(0, 5);
    }),
});
