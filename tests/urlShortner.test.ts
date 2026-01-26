import UrlShortenerService from "../src/server/services/urlShorten.service";

describe("UrlShortener Logic", () => {
  let shortener: typeof UrlShortenerService;

  beforeEach(() => {
    shortener = UrlShortenerService;
  });

  test("should return a string of exactly 10 characters", () => {
    const url = "https://google.com";
    const code = shortener.generateShortCode(url);
    expect(code).toHaveLength(10);
  });

  test("Mass Test: should return a string of exactly 10 characters", () => {
    for (let i = 0; i < 100; i++) {
      const url = "https://google.com" + "a".repeat(i + 10);
      const code = shortener.generateShortCode(url);
      expect(code).toHaveLength(10);
    }
  });

  test("should be deterministic (same URL produces same code)", () => {
    const url = "https://example.com/test-path?param=1";
    const code1 = shortener.generateShortCode(url);
    const code2 = shortener.generateShortCode(url);

    expect(code1).toBe(code2);
  });

  test("Mass Test: should be deterministic (same URL produces same code)", () => {
    for (let i = 0; i < 100; i++) {
      const url = "https://example.com/test-path?param=1";
      const code1 = shortener.generateShortCode(url);
      const code2 = shortener.generateShortCode(url);
      expect(code1).toBe(code2);
    }
  });

  test("should produce different codes for different URLs", () => {
    const code1 = shortener.generateShortCode("https://google.com");
    const code2 = shortener.generateShortCode("https://google.com/search");

    expect(code1).not.toBe(code2);
  });

  test("Mass Test: should produce different codes for different URLs", () => {
    for (let i = 0; i < 100; i++) {
      const code1 = shortener.generateShortCode(
        "https://google.com/search?query=test+with+jest+in+express+app+using+typescript",
      );
      const code2 = shortener.generateShortCode(
        `https://google.com/search?query=test+with+jest+in+express+app+using+typescript+${i}`,
      );

      expect(code1).not.toBe(code2);
    }
  });

  test("should only contain Base62 characters", () => {
    const url = "https://complex-url.io/path#hash";
    const code = shortener.generateShortCode(url);

    // Regex for alphanumeric 0-9, a-z, A-Z
    expect(code).toMatch(/^[a-zA-Z0-9]+$/);
  });

  test("Mass Test: should only contain Base62 characters", () => {
    for (let i = 0; i < 100; i++) {
      const url = "https://complex-url.io/path#hash" + "a".repeat(i + 10);
      const code = shortener.generateShortCode(url);

      // Regex for alphanumeric 0-9, a-z, A-Z
      expect(code).toMatch(/^[a-zA-Z0-9]+$/);
    }
  });

  test("should handle extremely long URLs without breaking", () => {
    const longUrl = "https://example.com/" + "a".repeat(2000);
    const code = shortener.generateShortCode(longUrl);

    expect(code).toHaveLength(10);
    expect(typeof code).toBe("string");
  });

  test("Mass Uniqueness: should have no collisions in 1,000 unique URLs", () => {
    const codes = new Set<string>();
    const iterations = 1000;

    for (let i = 0; i < iterations; i++) {
      const url = `https://test.com/resurces/book/page-number/11/authors/121/id/${i}`;
      codes.add(shortener.generateShortCode(url));
    }

    // If size matches iterations, every code was unique
    expect(codes.size).toBe(iterations);
  });
});
