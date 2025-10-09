/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AuthState {
  isAuthenticated: boolean;
  apiKey: string | null;
  error: string | null;
}

export interface APIResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface PostData {
  content: string;
  author: string;
  timestamp: string;
}

export interface GrokAIResponse {
  reply: string;
  error?: string;
}

export interface AIModel {
  id: string;
  name: string;
  description: string;
}

// export interface GrokAIConfig {
//   apiKey: string;
// }

// export interface ReplyButtonProps {
//   postContent: string;
//   onReplyGenerated: (reply: string) => void;
// }
