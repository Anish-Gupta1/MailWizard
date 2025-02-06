import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Textbox from "../components/Textbox";
import { generateJSON, GmailComposeType } from "../openAi/openAi";
import MailSetter from "../components/mailsetter";

const AIIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-blue-400"
  >
    <path d="M12 2a7 7 0 0 1 7 7v1h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6c0-1.1.9-2 2-2h1V9a7 7 0 0 1 7-7z" />
    <path d="M12 6v4" />
    <path d="M8 10h8" />
  </svg>
);

const ExtensionComponent: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [textValue, setTextValue] = useState<string>("");
  const [mailData, setMailData] = useState<GmailComposeType | null>(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [isKeyLoded, setIsKeyLoaded] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmit(true);
      const data = await generateJSON(textValue);
      setMailData(data);
    } catch (err) {
      console.error("Error generating mail data", err);
    }
  };

  useEffect(() => {
    if (mailData) {
      setIsSubmit(false);
      setTextValue("");
      setIsPopupOpen(false);
    }
  }, [mailData]);

  useEffect(() => {
    chrome.storage.local.get("apiKey", (result) => {
      if (result.apiKey) {
        setIsKeyLoaded(true);
      }
    });
  }, [isPopupOpen]);

  return (
    <div className="fixed top-2 right-2 z-50">
      <button
        onClick={() => setIsPopupOpen(!isPopupOpen)}
        className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors duration-200 shadow-lg"
      >
        <AIIcon />
      </button>
      
      {isPopupOpen && (
        <div 
          className="absolute top-full right-0 mt-2 w-80 bg-gray-900 rounded-lg shadow-xl border border-gray-700 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {isKeyLoded ? (
            <div className="p-4 space-y-4">
              <div className="space-y-2">
                <Textbox
                  placeholder="Tell MailWizard what to write..."
                  rows={4}
                  cols={40}
                  disable={isSubmit}
                  value={textValue}
                  onChange={setTextValue}
                  onSubmit={handleSubmit}
                  // className="w-full px-3 py-2 bg-gray-800 text-gray-100 rounded-md border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-gray-500"
                />
                <button
                  onClick={handleSubmit}
                  disabled={isSubmit}
                  className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmit ? "Generating..." : "Generate Email"}
                </button>
              </div>
              {mailData && (
                <div className="border-t border-gray-700 pt-4">
                  <MailSetter data={mailData} />
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 text-gray-300 text-sm">
              <div className="flex items-center space-x-2 mb-2">
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span className="font-medium">API Key Required</span>
              </div>
              <p>Please add your OpenAI API key in the MailWizard extension's popup to enable AI-powered email generation.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const injectExtension = () => {
  const composeBoxSelector = 'div[role="textbox"][aria-label="Message Body"]';

  const handleNewComposeBox = (mutations: MutationRecord[]) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          const composeBox = node.querySelector(composeBoxSelector);
          if (
            composeBox &&
            !composeBox.parentElement?.querySelector(".fixed.top-2.right-2")
          ) {
            const container = document.createElement("div");
            composeBox.parentElement?.appendChild(container);

            const root = createRoot(container);
            root.render(<ExtensionComponent />);
          }
        }
      });
    });
  };

  const observer = new MutationObserver(handleNewComposeBox);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

injectExtension();

export default ExtensionComponent;