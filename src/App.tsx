import { useState, useEffect } from "react";
import "./App.css";
import { AuthService } from "./services/AuthService";
import type { AuthState } from "./types";

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    apiKey: null,
    error: null,
  });

  const [apiKeyInput, setApiKeyInput] = useState("");

  useEffect(() => {
    const fetchApiKey = async () => {
      const storedApiKey = await AuthService.getStoredApiKey();
      if (storedApiKey) {
        setAuthState({
          isAuthenticated: true,
          apiKey: storedApiKey,
          error: null,
        });
      }
    };
    fetchApiKey();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await AuthService.validateAndStoreApiKey(apiKeyInput);

    if (response.success) {
      setAuthState({
        isAuthenticated: true,
        apiKey: apiKeyInput,
        error: null,
      });
    } else {
      setAuthState({
        isAuthenticated: false,
        apiKey: null,
        error: response.message,
      });
    }
  };

  const handleLogout = async () => {
    await AuthService.clearStoredApiKey();
    setAuthState({
      isAuthenticated: false,
      apiKey: null,
      error: null,
    });
    setApiKeyInput("");
  };

  return authState.isAuthenticated ? (
    <div className="app-container">
      <h1>ReplygAI</h1>
      <p>
        Successfully authenticated! You can now use the AI reply feature on
        X/Twitter.
      </p>
      <div className="instruction-container">
        <h2>How to use:</h2>
        <ol>
          <li>Navigate to Twitter/X</li>
          <li>Look for the LOGO button next to regular reply buttons</li>
          <li>Click it to generate an AI-powered response</li>
          <li>Edit the generated reply if needed and post!</li>
        </ol>
      </div>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  ) : (
    <div className="app-container">
      <h1>ReplygAI</h1>
      <p>Please enter your Open Router API key to continue:</p>
      <form onSubmit={handleSubmit} className="api-key-form">
        <input
          type="password"
          value={apiKeyInput}
          onChange={(e) => setApiKeyInput(e.target.value)}
          placeholder="Enter your API key"
          className="api-key-input"
        />
        {authState.error && (
          <div className="error-message">{authState.error}</div>
          // add animation effect (fade in/out
        )}
        <button type="submit" className="submit-button" disabled={!apiKeyInput}>
          Save API Key
        </button>
        {/* add click effect */}
      </form>
      <p className="help-text">
        Don't have an API key? Visit{" "}
        <a
          href="https://openrouter.ai/"
          target="_blank"
          rel="noopener noreferrer"
        >
          openrouter.ai
        </a>{" "}
        to get one.
      </p>
    </div>
  );
}

export default App;
