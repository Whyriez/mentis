export interface KeyStatus {
  index: number;
  maskedKey: string;
  failCount: number;
  lastUsedAt?: string;
  isExhausted: boolean;
}

export class GeminiKeyRotator {
  private static instance: GeminiKeyRotator;
  private apiKeys: string[] = [];
  private currentIndex: number = 0;
  private failCounts: Map<number, number> = new Map();

  private constructor() {
    this.reloadKeysFromEnv();
  }

  public static getInstance(): GeminiKeyRotator {
    if (!GeminiKeyRotator.instance) {
      GeminiKeyRotator.instance = new GeminiKeyRotator();
    }
    return GeminiKeyRotator.instance;
  }

  /**
   * Reload API keys from environment variables or custom array
   */
  public reloadKeysFromEnv(customKeys?: string[]): void {
    if (customKeys && customKeys.length > 0) {
      this.apiKeys = customKeys.filter((k) => k.trim().length > 0);
    } else {
      const rawEnv = process.env.GEMINI_API_KEYS || process.env.GEMINI_API_KEY || "";
      this.apiKeys = rawEnv
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k.length > 0);
    }
    this.currentIndex = 0;
    this.failCounts.clear();
  }

  /**
   * Add a new API key to the active rotation pool
   */
  public addApiKey(key: string): void {
    const trimmed = key.trim();
    if (trimmed && !this.apiKeys.includes(trimmed)) {
      this.apiKeys.push(trimmed);
    }
  }

  /**
   * Get count of configured API keys
   */
  public getKeyCount(): number {
    return this.apiKeys.length;
  }

  /**
   * Mask API key for audit logs and UI display
   */
  public static maskKey(key: string): string {
    if (!key || key.length < 8) return "••••••••";
    return `${key.slice(0, 4)}...${key.slice(-4)}`;
  }

  /**
   * Get status summary of all keys in pool
   */
  public getKeyStatuses(): KeyStatus[] {
    return this.apiKeys.map((key, idx) => ({
      index: idx + 1,
      maskedKey: GeminiKeyRotator.maskKey(key),
      failCount: this.failCounts.get(idx) || 0,
      isExhausted: (this.failCounts.get(idx) || 0) >= 3,
    }));
  }

  /**
   * Execute an async API operation with automatic key rotation and failover.
   * If a key returns rate limit (429/403/503), it automatically rotates to the next available key.
   */
  public async executeWithRotation<T>(
    operation: (apiKey: string, keyIndex: number, maskedKey: string) => Promise<T>
  ): Promise<{ result: T; keyIndex: number; maskedKey: string }> {
    if (this.apiKeys.length === 0) {
      throw new Error(
        "No Gemini API key configured. Please set GEMINI_API_KEYS in .env.local or add an API key in Admin Settings."
      );
    }

    const totalKeys = this.apiKeys.length;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < totalKeys; attempt++) {
      const activeIdx = (this.currentIndex + attempt) % totalKeys;
      const apiKey = this.apiKeys[activeIdx];
      const masked = GeminiKeyRotator.maskKey(apiKey);

      try {
        const result = await operation(apiKey, activeIdx + 1, masked);
        // On success, advance current index for round-robin balancing
        this.currentIndex = (activeIdx + 1) % totalKeys;
        this.failCounts.set(activeIdx, 0);
        return { result, keyIndex: activeIdx + 1, maskedKey: masked };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        const currentFails = (this.failCounts.get(activeIdx) || 0) + 1;
        this.failCounts.set(activeIdx, currentFails);
        lastError = err instanceof Error ? err : new Error(errorMessage);

        console.warn(
          `[GeminiKeyRotator] Key #${activeIdx + 1} (${masked}) failed (Attempt ${attempt + 1}/${totalKeys}): ${errorMessage}`
        );

        // If rate limited or quota exceeded, try next key in pool
        const isQuotaOrRateLimit =
          errorMessage.includes("429") ||
          errorMessage.toLowerCase().includes("quota") ||
          errorMessage.toLowerCase().includes("rate limit") ||
          errorMessage.includes("403") ||
          errorMessage.includes("503");

        if (!isQuotaOrRateLimit && attempt === 0 && totalKeys === 1) {
          // Single key failure non-retryable
          throw lastError;
        }
      }
    }

    throw new Error(
      `All ${totalKeys} Gemini API keys in rotation pool failed. Last error: ${lastError?.message}`
    );
  }
}
