import { createHash } from "crypto";

class UrlsService {
  private urlMap = new Map<string, string>();
  private CHARSET =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  private generateShortCode = (url: string): string => {
    // 1. Create SHA-256 Hash
    const hash = createHash("sha256").update(url).digest("hex");

    // 2. Take a slice of the hash (first 12 characters)
    // We convert hex to a big integer to map it to Base62
    let decimalValue = BigInt(`0x${hash.substring(0, 15)}`);
    const zero = BigInt(0);
    const sixtyTwo = BigInt(62);

    let code = "";
    while (decimalValue > zero && code.length < 10) {
      code += this.CHARSET[Number(decimalValue % sixtyTwo)];
      decimalValue /= sixtyTwo;
    }

    // 3. Pad if necessary (though with 15 hex chars, it usually hits 10)
    return code.padEnd(10, "0");
  };

  public getShortCode = (longUrl: string): string => {
    const shortCode = this.generateShortCode(longUrl);
    this.urlMap.set(shortCode, longUrl);
    return shortCode;
  };

  public getLongUrl = (shortCode: string): string | undefined => {
    return this.urlMap.get(shortCode);
  };
}

export default new UrlsService();
