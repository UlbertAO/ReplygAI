import { useState, useEffect } from "react";
import "./App.css";
import { AuthService } from "./services/AuthService";
import type { AuthState } from "./types";
import APIKeyForm from "./components/APIKeyForm";
import GeneralInfo from "./components/GeneralInfo";
import { STORAGE_KEYS } from "./config";

function App() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    apiKey: null,
    error: null,
  });

  useEffect(() => {
    const fetchApiKey = async () => {
      const storedApiKey = await AuthService.getStoredKeyValue(
        STORAGE_KEYS.API_KEY
      );
      chrome.storage.local.get("apiKeyError", (result) => {
        const error = result.apiKeyError || null;
        if (storedApiKey) {
          setAuthState({
            isAuthenticated: true,
            apiKey: storedApiKey,
            error: null,
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            apiKey: null,
            error: error,
          });
        }
        // Clear the error after showing it once
        if (error) chrome.storage.local.remove("apiKeyError");
      });
    };
    fetchApiKey();
  }, []);

  return authState.isAuthenticated ? (
    <GeneralInfo setAuthState={setAuthState} />
  ) : (
    <APIKeyForm authState={authState} setAuthState={setAuthState} />
  );
}

export default App;
