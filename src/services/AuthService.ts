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
      await chrome.storage.sync.set({
        [STORAGE_KEYS.API_KEY]: apiKey,
      });

      const stored = await this.getStoredApiKey();
      if (!stored) {
        throw new Error("API key storage verification failed");
      }

      return {
        success: true,
        message: "API key stored successfully",
      };
    } catch (error) {
      console.error("Error storing API key:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  }

  static async getStoredApiKey(): Promise<string | null> {
    try {
      const result = await chrome.storage.sync.get(STORAGE_KEYS.API_KEY);
      return result[STORAGE_KEYS.API_KEY] || null;
    } catch (error) {
      console.error("Error retrieving API key:", error);
      return null;
    }
  }

  static async clearStoredApiKey(): Promise<void> {
    try {
      await chrome.storage.sync.remove(STORAGE_KEYS.API_KEY);
    } catch (error) {
      console.error("Error clearing API key:", error);
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    try {
      const apiKey = await this.getStoredApiKey();
      return !!apiKey && apiKey.length >= APP_CONFIG.MINIMUM_API_KEY_LENGTH;
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  }
}
