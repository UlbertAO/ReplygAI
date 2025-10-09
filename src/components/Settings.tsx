import { useEffect, useState } from "react";
import { AuthService } from "../services/AuthService";
import type { AIModel } from "../types";
import { STORAGE_KEYS } from "../config";

type SettingsProps = {
  onBack: () => void;
};

const Settings = ({ onBack }: SettingsProps) => {
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [models] = useState<AIModel[]>(AuthService.getAvailableModels());

  useEffect(() => {
    const loadSelectedModel = async () => {
      const currentModel = await AuthService.getCurrentModel();
      setSelectedModel(currentModel);
    };

    loadSelectedModel();
  }, []);

  const handleModelChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const modelId = event.target.value;
    setSelectedModel(modelId);
    await AuthService.validateAndStoreKeyValue(
      STORAGE_KEYS.SELECTED_MODEL,
      modelId
    );
  };

  return (
    <div className="app-container">
      <div className="settings-header">
        <button onClick={onBack} className="back-button">
          ←
        </button>
        <h3>Settings</h3>
      </div>

      <div className="settings-content">
        <section className="settings-section">
          <b>General Settings</b>
          <div className="settings-item">
            <p>- Logout to change your API key.</p>
          </div>
        </section>

        <section className="settings-section">
          <b>AI Settings</b>
          <div className="settings-item">
            <label htmlFor="model-select">Select AI Model:</label>
            <select
              id="model-select"
              value={selectedModel}
              onChange={handleModelChange}
              className="model-select"
            >
              {models.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            <p className="model-description">
              {models.find((m) => m.id === selectedModel)?.description}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
