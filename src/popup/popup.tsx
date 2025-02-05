import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import Textbox from "../components/Textbox";

export const Popup: React.FC = () => {
  const [apikey, setApikey] = useState<string>("");
  const [isKeySaved, setIsKeySaved] = useState<boolean>(false);


  useEffect(() => {
    chrome.storage.local.get("apiKey", (result) => {
      if (result.apiKey) {
        setIsKeySaved(true);
      }
    });
  }, []);


  const handleSubmit = async () => {
    console.log("Saving API Key", apikey);
    chrome.storage.local.set({ apiKey: apikey }, () => {
      if (chrome.runtime.lastError) {
        console.error("Error saving API Key:", chrome.runtime.lastError);
      } else {
        console.log("API Key saved successfully!");
        setIsKeySaved(true);
      }
    });
  };

  // Reset API key
  const handleReset = () => {
    chrome.storage.local.remove("apiKey", () => {
      if (chrome.runtime.lastError) {
        console.error("Error resetting API Key:", chrome.runtime.lastError);
      } else {
        console.log("API Key reset successfully!");
        setIsKeySaved(false);
      }
    });
  };

  return (
    <div className="min-w-[300px] min-h-[200px] p-6 bg-gradient-to-br from-blue-500 to-purple-600 animate-gradient-x text-white">
      {!isKeySaved ? (
        
        <div className="space-y-4">
          <p className="text-sm text-center">
            Paste your OpenAI API key below to get started.
          </p>
          <Textbox
            placeholder="API key ..."
            value={apikey}
            onChange={setApikey}
            onSubmit={handleSubmit}
          />
        </div>
      ) : (
        
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-bold">Success!</h1>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
          >
            Reset API Key
          </button>
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<Popup />, document.getElementById("root"));