import { randomUUID } from "crypto";
import { type Shorten } from "../models/shorten.model.ts";
import UrlShortenService from "./urlShorten.service.ts";

class ShortenService {
  private static readonly SHORTEN: Shorten[] = [
    {
      id: randomUUID(),
      url: "https://www.example.com/some/long/url",
      shortCode: UrlShortenService.generateShortCode(
        "https://www.example.com/some/long/url",
      ),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  public getRecentShortens(limit: number = 5): Shorten[] {
    return ShortenService.SHORTEN.toReversed().slice(0, limit);
  }

  public getShortenByCode(shortCode: string): Shorten | undefined {
    return ShortenService.SHORTEN.find(
      (shorten) =>
        shorten.shortCode.toLocaleLowerCase() === shortCode.toLocaleLowerCase(),
    );
  }

  public getShortenByUrl(url: string): Shorten | undefined {
    return ShortenService.SHORTEN.find(
      (shorten) => shorten.url.toLocaleLowerCase() === url.toLocaleLowerCase(),
    );
  }

  public createShortenUrl(url: string): Shorten {
    const existingShorten = this.getShortenByUrl(url);

    if (existingShorten !== undefined) {
      return existingShorten;
    }

    const shorten: Shorten = {
      id: randomUUID(),
      url: url,
      shortCode: UrlShortenService.generateShortCode(url),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    ShortenService.SHORTEN.push(shorten);
    return shorten;
  }
}

export default new ShortenService();
