import { STORAGE_KEYS } from "../config";
import { AuthService } from "../services/AuthService";

export interface APIErrorResponse {
  status: number;
  message: string;
  action?: () => Promise<void>;
}

export class APIErrorHandler {
  private static errorMap = new Map<number, APIErrorResponse>([
    [400, { status: 400, message: "Bad Request - Please check your input" }],
    [
      401,
      {
        status: 401,
        message: "Unauthorized - Please check your API key",
        action: async () =>
          await AuthService.clearStoredKeyvalue(STORAGE_KEYS.API_KEY),
      },
    ],
    [403, { status: 403, message: "Forbidden - Access denied" }],
    [404, { status: 404, message: "Not Found - Resource not available" }],
    [
      429,
      { status: 429, message: "Too Many Requests - Please try again later" },
    ],
    [500, { status: 500, message: "Internal Server Error" }],
    [502, { status: 502, message: "Bad Gateway" }],
    [503, { status: 503, message: "Service Unavailable" }],
    [504, { status: 504, message: "Gateway Timeout" }],
  ]);

  static async handleError(response: Response): Promise<never> {
    const errorResponse = this.errorMap.get(response.status) || {
      status: response.status,
      message: "Unknown error occurred",
    };

    if (errorResponse.action) {
      await errorResponse.action();
    }

    throw new Error(errorResponse.message);
  }
}
