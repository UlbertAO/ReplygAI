import { STORAGE_KEYS, ERROR_MESSAGES, APP_CONFIG } from "../config";
import type { APIResponse } from "../types";

export class AuthService {
  static async validateAndStoreApiKey(apiKey: string): Promise<APIResponse> {
    try {
      if (!apiKey || apiKey.length < APP_CONFIG.MINIMUM_API_KEY_LENGTH) {
        return {
          success: false,
          message: ERROR_MESSAGES.INVALID_API_KEY,
        };
      }

      // Store the API key
      localStorage.setItem(STORAGE_KEYS.API_KEY, apiKey);

      return {
        success: true,
        message: "API key stored successfully",
      };
    } catch (error) {
      console.error("Error storing API key:", error);
      return {
        success: false,
        message: ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  }

  static getStoredApiKey(): string | null {
    return localStorage.getItem(STORAGE_KEYS.API_KEY);
  }

  static clearStoredApiKey(): void {
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
  }

  static isAuthenticated(): boolean {
    const apiKey = this.getStoredApiKey();
    return !!apiKey && apiKey.length >= APP_CONFIG.MINIMUM_API_KEY_LENGTH;
  }
}
