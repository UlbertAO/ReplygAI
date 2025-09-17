import React, { useState } from "react";
import { AuthService } from "../services/AuthService";
import type { AuthState } from "../types";

type APIKeyFormProps = {
  authState: AuthState;
  setAuthState: (authState: AuthState) => void;
};

const APIKeyForm = ({ authState, setAuthState }: APIKeyFormProps) => {
  const [apiKeyInput, setApiKeyInput] = useState("");

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

  return (
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
};

export default APIKeyForm;
