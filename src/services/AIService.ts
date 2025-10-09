/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_ENDPOINTS, ERROR_MESSAGES, STORAGE_KEYS } from "../config";
import type { GrokAIResponse, PostData } from "../types";
import { APIErrorHandler } from "../utils/errorHandler";
import { AuthService } from "./AuthService";

export class AIService {
  private static async makeRequest(
    endpoint: string,
    data: any
  ): Promise<Response> {
    const apiKey = await AuthService.getStoredKeyValue(STORAGE_KEYS.API_KEY);
    if (!apiKey) {
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
    }

    return fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(data),
    });
  }

  static async generateReply(postData: PostData): Promise<GrokAIResponse> {
    try {
      const modelId = await AuthService.getCurrentModel();
      const response = await this.makeRequest(
        API_ENDPOINTS.OPENROUTER_API_KEY,
        {
          model: modelId,
          messages: [
            {
              role: "user",
              content: `You are ReplygAI, an expert in crafting engaging, human-like replies for X posts. Your goal is to generate a reply that hooks users by sounding natural, relatable, and conversational, just like a skilled social media user.

**How to craft your reply:**
1. Analyze the original post’s tone carefully and classify it as funny (witty, humorous, punny), professional (formal, respectful), neutral (casual, friendly), or technical (precise, jargon-focused).
2. Create a concise (1-2 sentences, max 280 characters), original reply that matches or complements this tone, using varied sentence structures and natural, conversational language.
3. Make the reply emotionally engaging or thought-provoking to spark interaction—use light humor, empathy, or insight as appropriate.
4. Avoid generic, robotic phrasing or overly formal language that sounds AI-generated.
5. For sensitive topics, respond neutrally, showing respect and care.
6. When possible, include a subtle conversational hook or a brief open-ended question to encourage further replies.
7. Ensure the reply is respectful, contextually relevant.

**Output only the plain text reply, ready for posting.**

**Original X Post:** ${postData.content.trim()}`,
            },
          ],
        }
      );

      if (!response.ok) {
        await APIErrorHandler.handleError(response);
      }

      const data = await response.json();
      return {
        reply: data.choices[0]?.message?.content || "",
      };
    } catch (error) {
      return {
        reply: "",
        error:
          error instanceof Error ? error.message : ERROR_MESSAGES.NETWORK_ERROR,
      };
    }
  }
}
