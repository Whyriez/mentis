export interface ErrorLogPayload {
  id: string;
  errorName: string;
  message: string;
  stackTrace?: string;
  route?: string;
  userId?: string;
  timestamp: string;
  severity: "low" | "medium" | "high" | "critical";
}

export class ErrorTracker {
  private static errors: ErrorLogPayload[] = [];

  static captureException(
    err: unknown,
    context?: { route?: string; userId?: string; severity?: "low" | "medium" | "high" | "critical" }
  ): ErrorLogPayload {
    const errorObj = err instanceof Error ? err : new Error(String(err));

    const payload: ErrorLogPayload = {
      id: `err-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      errorName: errorObj.name || "UnhandledError",
      message: errorObj.message || "An unexpected system error occurred",
      stackTrace: errorObj.stack,
      route: context?.route || (typeof window !== "undefined" ? window.location.pathname : "ServerSide"),
      userId: context?.userId || "Anonymous",
      timestamp: new Date().toISOString(),
      severity: context?.severity || "high",
    };

    ErrorTracker.errors.unshift(payload);

    if (process.env.NODE_ENV === "development") {
      console.error("[ErrorTracker Log]:", payload);
    }

    return payload;
  }

  static getRecentErrors(): ErrorLogPayload[] {
    return ErrorTracker.errors;
  }
}
