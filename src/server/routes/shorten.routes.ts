import { z } from "zod";
import { router, publicProcedure } from "../trpc.ts";
import { type Shorten, shortenModel } from "../models/shorten.model.ts";

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
  getRecentShortenUrls: publicProcedure
    .input(z.undefined())
    .output(z.array(shortenModel))
    .query(() => {
      return SHORTENS;
    }),
});
