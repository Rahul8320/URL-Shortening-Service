import { Hono } from "hono";
import UrlService from "../services/urls.service";

const urls = new Hono().basePath("/urls");

urls.post("/shorten", async (c) => {
  const body = await c.req.json();
  const longUrl: string | undefined = body["longUrl"];

  if (!longUrl || longUrl.trim().length == 0) {
    return c.json({ message: "longUrl is required" }, 400);
  }

  const shortCode = UrlService.getShortCode(longUrl);
  const shortUrl = c.req.url.replace("shorten", shortCode);

  return c.json({ longUrl, shortCode, shortUrl }, 200);
});

urls.get("/:shortCode", (c) => {
  const shortCode = c.req.param("shortCode");

  console.log(
    `[${new Date().toLocaleString()}] [INFO] Fetching long url for short code: ${shortCode}`,
  );
  const longUrl = UrlService.getLongUrl(shortCode);

  if (!longUrl) {
    return c.json({ message: "Short code not found" }, 404);
  }

  return c.json({ shortCode, longUrl }, 200);
});

export default urls;
