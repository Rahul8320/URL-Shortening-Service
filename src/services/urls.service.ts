class UrlsService {
  private urlMap = new Map<string, string>();
  private CHARSET =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  private CHARSET_LEN = 62;

  private randomBytes(n = 12) {
    const arr = new Uint8Array(n);
    crypto.getRandomValues(arr);
    return arr;
  }

  private randomBase62CharIndex(randomByte: number): number {
    // Use rejection sampling: accept bytes < 248 because 248 % 62 == 0
    // This maps uniformly to 0..61 using (byte % 62)
    if (randomByte >= 248) {
      return -1;
    }

    return randomByte % this.CHARSET_LEN;
  }

  private generateCode8(): string {
    const bytes = this.randomBytes(12); // 12 bytes enough to produce 8 chars with rejection
    let code: string = "";

    for (let i = 0; i < bytes.length && code.length < 8; ++i) {
      const idx = this.randomBase62CharIndex(bytes[i]);

      if (idx >= 0) {
        code += this.CHARSET[idx];
      }
    }

    // If not enough chars due to rejections, loop again (very rare)
    if (code.length < 8) {
      return this.generateCode8();
    }

    return code;
  }

  public getShortCode = (longUrl: string): string => {
    const shortCode = this.generateCode8();
    this.urlMap.set(shortCode, longUrl);
    return shortCode;
  };

  public getLongUrl = (shortCode: string): string | undefined => {
    return this.urlMap.get(shortCode);
  };
}

export default new UrlsService();
