import { STORAGE_KEYS, ERROR_MESSAGES, APP_CONFIG } from "../config";
import type { APIResponse } from "../types";

export class AuthService {
  static async validateAndStoreKeyValue(
    key: string,
    value: string
  ): Promise<APIResponse> {
    try {
      if (!key || key.length < APP_CONFIG.MINIMUM_KEY_LENGTH) {
        return {
          success: false,
          message: ERROR_MESSAGES.INVALID_KEY,
        };
      }

      if (!value || value.length < APP_CONFIG.MINIMUM_KEY_VALUE_LENGTH) {
        return {
          success: false,
          message: ERROR_MESSAGES.INVALID_KEY_VALUE,
        };
      }

      // Store the API key
      await chrome.storage.sync.set({
        [key]: value,
      });

      console.log("Key stored successfully");

      const stored = await this.getStoredKeyValue(key);
      if (!stored) {
        throw new Error("key storage verification failed");
      }

      return {
        success: true,
        message: "API key stored successfully",
      };
    } catch (error) {
      console.error("Error storing key:", error);
      return {
        success: false,
        message:
          error instanceof Error ? error.message : ERROR_MESSAGES.DEFAULT_ERROR,
      };
    }
  }

  static async getStoredKeyValue(key: string): Promise<string | null> {
    try {
      const result = await chrome.storage.sync.get(STORAGE_KEYS.API_KEY);
      return result[key] || null;
    } catch (error) {
      console.error("Error retrieving key:", error);
      return null;
    }
  }

  static async clearStoredKeyvalue(key: string): Promise<void> {
    try {
      await chrome.storage.sync.remove(key);
    } catch (error) {
      console.error("Error clearing key:", error);
    }
  }

  static async isAuthenticated(): Promise<boolean> {
    try {
      const apiKey = await this.getStoredKeyValue(STORAGE_KEYS.API_KEY);
      return !!apiKey && apiKey.length >= APP_CONFIG.MINIMUM_KEY_VALUE_LENGTH;
    } catch (error) {
      console.error("Error checking authentication:", error);
      return false;
    }
  }
}
