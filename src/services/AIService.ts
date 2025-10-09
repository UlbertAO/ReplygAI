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
              content: `You are ReplygAI, an AI. Your task is to generate a reply to an X post that matches the tone and humor of the provided post content.
                The reply should be natural, engaging, and appropriate for the X platform, aligning with its conversational style.
                \n\n**Instructions**:
                \n1. **Tone Analysis**: Analyze the post to determine its tone: **funny** (humor, sarcasm, puns), **professional** (formal, respectful), **neutral** (casual, conversational), or **technical** (jargon, code-related). Default to neutral if ambiguous.
                \n2. **Reply Generation**: Generate a concise reply (1-2 sentences, max 280 characters) that mirrors or complements the tone, is contextually relevant, and complies with X’s guidelines. Avoid offensive language. For sensitive topics, reply neutrally. For funny posts, use wit; for professional, be formal; for technical, be precise.
                \n3. **Output should only contain**: Return plain text for the X reply box.
                \n\n**Post Content**: ${postData.content.trim()}`,
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
