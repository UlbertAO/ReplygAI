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
  console.log("Icon URL:", img.src);
  img.alt = "AI Reply";
  img.style.width = "20px";
  img.style.height = "20px";
  img.style.display = "block";

  button.appendChild(img);
  return button;
}

function handleReplyClick(
  data: { content: string; author: string },
  article: Element
): void {
  console.log("Reply button clicked for post:", data);

  // Click the native reply button first
  const nativeReplyButton = article.querySelector('[data-testid="reply"]');
  (nativeReplyButton as HTMLElement)?.click();

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
