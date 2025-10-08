export const STORAGE_KEYS = {
  API_KEY: "OPENROUTER_API_KEY",
};

export const API_ENDPOINTS = {
  OPENROUTER_API_KEY: "https://openrouter.ai/api/v1/chat/completions ",
};

export const APP_CONFIG = {
  MINIMUM_KEY_LENGTH: 2,
  MINIMUM_KEY_VALUE_LENGTH: 2,
  MAX_REPLY_LENGTH: 280,
};

export const ERROR_MESSAGES = {
  INVALID_KEY: "Invalid storage key.",
  INVALID_KEY_VALUE: "Invalid key's value. Please check and try again.",
  NETWORK_ERROR: "Network error. Please check your connection.",
  API_ERROR: "Error communicating with Grok AI. Please try again.",
  UNAUTHORIZED: "Unauthorized. Please check your API key.",
  TOO_MANY_REQUEST: "Too Many Requests. Please try after some time.",
  DEFAULT_ERROR: "An unexpected error occurred. Please try again.",
};
