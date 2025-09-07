import { GrokAIService } from "./services/GrokAIService";

console.log("Background script loaded at:", new Date().toISOString());

chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed and background script loaded");
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  console.log("Background script received message:", message);

  if (message.type === "GENERATE_REPLY") {
    // Handle the async operation
    (async () => {
      try {
        const response = await GrokAIService.generateReply(message.data);
        console.log("Generated response:", response);
        sendResponse(response);
      } catch (error) {
        console.error("Error generating reply:", error);
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        sendResponse({ error: errorMessage });
      }
    })();

    // Return true to keep the message channel open for the async response
    return true;
  }
});
