import { Hono } from "hono";
import { createHash } from "crypto";
import { logger } from "hono/logger";

const app = new Hono();
app.use(logger());

const urlMap = new Map<string, string>();
const CHARSET =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const generateShortCode = (url: string): string => {
  // 1. Create SHA-256 Hash
  const hash = createHash("sha256").update(url).digest("hex");

  // 2. Take a slice of the hash (first 12 characters)
  // We convert hex to a big integer to map it to Base62
  let decimalValue = BigInt(`0x${hash.substring(0, 15)}`);
  const zero = BigInt(0);
  const sixtyTwo = BigInt(62);

  let code = "";
  while (decimalValue > zero && code.length < 10) {
    code += CHARSET[Number(decimalValue % sixtyTwo)];
    decimalValue /= sixtyTwo;
  }

  // 3. Pad if necessary (though with 15 hex chars, it usually hits 10)
  return code.padEnd(10, "0");
};

app.post("/api/urls/shorten", async (c) => {
  const body = await c.req.json();
  const longUrl = body["longUrl"];

  if (!longUrl) {
    return c.json({ message: "longUrl is required" }, 400);
  }

  const shortCode = generateShortCode(longUrl);
  urlMap.set(shortCode, longUrl);

  return c.json({ longUrl, shortCode }, 200);
});

app.get("/api/urls/:shortCode", (c) => {
  const shortCode = c.req.param("shortCode");

  console.log(
    `[${new Date().toLocaleString()}] [INFO] Fetching long url for short code: ${shortCode}`,
  );
  const longUrl = urlMap.get(shortCode);

  if (!longUrl) {
    return c.json({ message: "Short code not found" }, 404);
  }

  return c.redirect(longUrl);
});

export default app;
