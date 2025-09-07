const REPLY_BUTTON_CLASS = "grok-ai-reply-button";

function createReplyButton(): HTMLButtonElement {
  const button = document.createElement("button");
  button.className = REPLY_BUTTON_CLASS;
  button.innerHTML = "AI Reply";
  return button;
}

function handleReplyClick(postContent: string, author: string): void {
  console.log("Reply button clicked for post:", postContent);

  chrome.runtime.sendMessage(
    {
      type: "GENERATE_REPLY",
      data: {
        content: postContent,
        author,
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

      replyButton.addEventListener("click", () =>
        handleReplyClick(tweetText, author)
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
