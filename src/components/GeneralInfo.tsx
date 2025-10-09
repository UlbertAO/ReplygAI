import { AuthService } from "../services/AuthService";
import type { AuthState } from "../types";
import { useEffect, useState } from "react";
import Settings from "./Settings";
import { STORAGE_KEYS } from "../config";

type GeneralInfoProps = {
  setAuthState: (authState: AuthState) => void;
};

const GeneralInfo = ({ setAuthState }: GeneralInfoProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored error message when component mounts
    chrome.storage.local.get(["lastError"], (result) => {
      if (result.lastError) {
        setError(result.lastError);
        // Clear the error after displaying it
        chrome.storage.local.remove("lastError");
      }
    });
  }, []);

  const handleLogout = async () => {
    await AuthService.clearStoredKeyvalue(STORAGE_KEYS.API_KEY);
    setAuthState({
      isAuthenticated: false,
      apiKey: null,
      error: null,
    });
  };

  const handleSettingsClick = () => {
    setShowSettings(true);
  };

  const handleBackClick = () => {
    setShowSettings(false);
  };

  if (showSettings) {
    return <Settings onBack={handleBackClick} />;
  }
  return (
    <div className="app-container">
      <div className="header">
        <h1>ReplygAI</h1>
        <button
          onClick={handleSettingsClick}
          className="settings-button"
          title="Settings"
        >
          ⚙️
        </button>
      </div>
      <p>Successfully authenticated! </p>
      <p>You can now use the AI reply feature on X/Twitter.</p>
      <div className="instruction-container">
        <h2>How to use:</h2>
        <ol>
          <li>
            Navigate to{" "}
            <a
              href="https://x.com/home"
              target="_blank"
              rel="noopener noreferrer"
            >
              Twitter/X
            </a>
          </li>
          <li>Look for the LOGO button next to regular reply buttons</li>
          <li>Click it to generate an AI-powered response</li>
          <li>Edit the generated reply if needed and post!</li>
        </ol>
      </div>
      {error && (
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={() => setError(null)} className="error-close-button">
            ✕
          </button>
        </div>
      )}
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default GeneralInfo;
