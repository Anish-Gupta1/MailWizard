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

  const handleReset = () => {
    chrome.storage.local.remove("apiKey", () => {
      if (chrome.runtime.lastError) {
        console.error("Error resetting API Key:", chrome.runtime.lastError);
      } else {
        console.log("API Key reset successfully!");
        setIsKeySaved(false); // Show the input form again
      }
    });
  };


  if (!isKeySaved) {
    return (
      <>
        <div>Paste your OpenAI key: </div>
        <Textbox
          placeholder="API key ..."
          value={apikey}
          onChange={setApikey}
          onSubmit={handleSubmit}
        />
      </>
    );
  } else {
    return (
      <div >
        <div>You have submitted your OpenAI key!</div>
        <button
          onClick={handleReset}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Reset API Key
        </button>
      </div>
    );
  }
};

ReactDOM.render(<Popup />, document.getElementById("root"));