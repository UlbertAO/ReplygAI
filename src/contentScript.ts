const REPLY_BUTTON_CLASS = "replygai-reply-button";
const REGENERATE_BUTTON_CLASS = "replygai-regenerate-button";

function createReplyButton(type: "reply" | "regenerate"): HTMLButtonElement {
  const button = document.createElement("button");
  button.className =
    type == "regenerate" ? REGENERATE_BUTTON_CLASS : REPLY_BUTTON_CLASS;
  button.style.background = "none";
  button.style.border = "none";
  button.style.padding = "0";
  button.style.cursor = "pointer";
  button.title = type == "regenerate" ? "Regenerate AI Reply" : "AI Reply";

  const img = document.createElement("img");
  img.src = chrome.runtime.getURL("icon.png");
  img.alt = type == "regenerate" ? "Regenerate AI Reply" : "AI Reply";
  img.style.width = "20px";
  img.style.height = "20px";
  img.style.display = "block";

  button.appendChild(img);
  return button;
}

function simulateTyping(element: HTMLElement, text: string) {
  if (document.activeElement !== element) {
    console.warn("Textarea is not active, trying to focus again...");
    const replyDialog = document.querySelector(
      '[aria-labelledby="modal-header"][aria-modal="true"][role="dialog"]'
    );
    const tweetTextarea: HTMLElement | null | undefined =
      replyDialog?.querySelector(
        '[data-testid="tweetTextarea_0"][contenteditable="true"]'
      );
    element = tweetTextarea as HTMLElement;
  }
  element.focus();

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false); // Place caret at the end

  selection?.removeAllRanges();
  selection?.addRange(range);

  const success = document.execCommand("insertText", false, text);
  return success;
}

function handleReplyClick(
  data: { content: string; author: string },
  article: Element
): void {
  // Click reply button first
  const replyButton = article.querySelector('[data-testid="reply"]');
  (replyButton as HTMLElement)?.click();

  // Wait for the reply dialog to appear and find the tweet textarea
  const waitForModal = setInterval(() => {
    const replyDialog = document.querySelector(
      '[aria-labelledby="modal-header"][aria-modal="true"][role="dialog"]'
    );
    const tweetTextarea: HTMLElement | null | undefined =
      replyDialog?.querySelector(
        '[data-testid="tweetTextarea_0"][contenteditable="true"]'
      );
    if (replyDialog && tweetTextarea) {
      clearInterval(waitForModal);

      // Inject AI reply icon below user's photo in the modal
      const userPhotoContainer =
        replyDialog?.querySelectorAll(
          '[data-testid^="UserAvatar-Container-"]'
        )?.[1]?.parentElement || null;
      if (
        userPhotoContainer &&
        !replyDialog.querySelector("." + REGENERATE_BUTTON_CLASS)
      ) {
        const regenerateButton = createReplyButton("regenerate");

        // TODO : clear text area manually before regenerating then only it would work
        // Add click handler to regenerate AI reply
        regenerateButton.addEventListener("click", () => {
          generateReply(data, tweetTextarea);
        });

        userPhotoContainer.style.gap = "18px";
        userPhotoContainer.style.alignItems = "center";
        userPhotoContainer.appendChild(regenerateButton);
      }
      // Now send message to generate reply

      generateReply(data, tweetTextarea);
    }
  }, 300);

  // Clear the interval after 5 seconds if modal is not found
  setTimeout(() => {
    clearInterval(waitForModal);
  }, 5000);
}

function generateReply(
  data: { content: string; author: string },
  tweetTextarea: HTMLElement | null | undefined
): void {
  chrome.runtime.sendMessage(
    {
      type: "GENERATE_REPLY",
      data: {
        content: data.content,
        author: data.author,
        timestamp: new Date().toISOString(),
      },
    },
    (response) => {
      if (chrome.runtime.lastError) {
        console.error("Runtime error:", chrome.runtime.lastError);
        return;
      }
      console.log("Response from background:", response);
      // Populate the textarea with the AI response
      if (response && !response.error) {
        const success = simulateTyping(
          tweetTextarea as HTMLDivElement,
          response.reply
        );
        if (!success) {
          console.error("Failed to insert reply.");
        }
      } else {
        console.error("Error in response:", response.error);
        chrome.runtime.sendMessage({
          type: "SHOW_ERROR_UI",
          error: response.error,
        });
      }
    }
  );
}

function injectReplyButtons(): void {
  // Twitter/X specific selectors
  const articleElements = document.querySelectorAll(
    'article[data-testid="tweet"]'
  );

  articleElements.forEach((article) => {
    if (!article.querySelector(`.${REPLY_BUTTON_CLASS}`)) {
      const replyButton = createReplyButton("reply");
      const tweetText =
        article.querySelector('[data-testid="tweetText"]')?.textContent || "";
      const author =
        article.querySelector('[data-testid="User-Name"]')?.textContent || "";

      const data = {
        content: tweetText,
        author: author,
      };
      replyButton.addEventListener("click", () =>
        handleReplyClick(data, article)
      );

      // Find the native reply button container and insert our button next to it
      const replyContainer = article.querySelector(
        '[data-testid="reply"]'
      )?.parentElement;
      if (replyContainer) {
        replyContainer.appendChild(replyButton);
      }
    }
  });
}

// Start observing DOM changes to handle dynamically loaded content
const observer = new MutationObserver(() => {
  injectReplyButtons();
});

//scope can be reduced to specific containers if needed
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Initial injection
injectReplyButtons();
