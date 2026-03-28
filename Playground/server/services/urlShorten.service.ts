import { createHash } from "crypto";

class UrlShortener {
  // Base62 character set
  private static readonly CHARSET =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  /**
   * Generates a unique, deterministic 10-character code
   */
  public generateShortCode(url: string): string {
    // 1. Create SHA-256 Hash
    const hash = createHash("sha256").update(url).digest("hex");

    // 2. Take a slice of the hash (first 12 characters)
    // We convert hex to a big integer to map it to Base62
    let decimalValue = BigInt(`0x${hash.substring(0, 15)}`);
    const zero = BigInt(0);
    const sixtyTwo = BigInt(62);

    let code = "";
    while (decimalValue > zero && code.length < 10) {
      code += UrlShortener.CHARSET[Number(decimalValue % sixtyTwo)];
      decimalValue /= sixtyTwo;
    }

    // 3. Pad if necessary (though with 15 hex chars, it usually hits 10)
    return code.padEnd(10, "0");
  }
}

export default new UrlShortener();
