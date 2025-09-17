import { AuthService } from "../services/AuthService";
import type { AuthState } from "../types";

type GeneralInfoProps = {
  setAuthState: (authState: AuthState) => void;
};

const GeneralInfo = ({ setAuthState }: GeneralInfoProps) => {
  const handleLogout = async () => {
    await AuthService.clearStoredApiKey();
    setAuthState({
      isAuthenticated: false,
      apiKey: null,
      error: null,
    });
    // setApiKeyInput("");
  };

  return (
    <div className="app-container">
      <h1>ReplygAI</h1>
      <p>Successfully authenticated! </p>
      <p>You can now use the AI reply feature onX/Twitter.</p>
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
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  );
};

export default GeneralInfo;
