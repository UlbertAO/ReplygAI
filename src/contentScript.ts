const REPLY_BUTTON_CLASS = "grok-ai-reply-button";

function createReplyButton(): HTMLButtonElement {
  const button = document.createElement("button");
  button.className = REPLY_BUTTON_CLASS;
  button.style.background = "none";
  button.style.border = "none";
  button.style.padding = "0";
  button.style.cursor = "pointer";
  button.title = "AI Reply";

  const img = document.createElement("img");
  img.src = chrome.runtime.getURL("icon.png");
  img.alt = "AI Reply";
  img.style.width = "20px";
  img.style.height = "20px";
  img.style.display = "block";

  button.appendChild(img);
  return button;
}

function simulateTyping(element: HTMLElement, text: string) {
  element.focus();

  if (document.activeElement !== element) {
    console.warn("Textarea is not active, trying to focus again...");
    element.focus();
  }

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
  const waitForTextarea = setInterval(() => {
    // Find the textarea inside a modal dialog
    const replyDialog = document.querySelector(
      '[aria-labelledby="modal-header"][aria-modal="true"][role="dialog"]'
    );

    const tweetTextarea: HTMLElement | null | undefined =
      replyDialog?.querySelector(
        '[data-testid="tweetTextarea_0"][contenteditable="true"]'
      );
    if (tweetTextarea) {
      clearInterval(waitForTextarea);

      // Now send message to generate reply
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
          }
        }
      );
    }
  }, 300);

  // Clear the interval after 5 seconds if textarea is not found (reply dialog didnt open)
  setTimeout(() => {
    clearInterval(waitForTextarea);
  }, 5000);
}

function injectReplyButtons(): void {
  // Twitter/X specific selectors
  const articleElements = document.querySelectorAll(
    'article[data-testid="tweet"]'
  );

  articleElements.forEach((article) => {
    if (!article.querySelector(`.${REPLY_BUTTON_CLASS}`)) {
      const replyButton = createReplyButton();
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
