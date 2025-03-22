import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import Textbox from "../components/Textbox";
import { generategptJSON } from "../openAi/openAi";
import MailSetter from "../components/mailsetter";
import "../styles/index.css";
import { GmailComposeType } from "../zod/zod";
import { generateclaudeJSON } from "../anthropic/claude";


const styles = `
  .ai-button-container {
    position: absolute;
    top: 100px;
    right: 10px;
    z-index: 9999;
  }

  .ai-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    cursor: pointer;
    border-radius: 50%;
    background-color: #f1f3f4;
    transition: background-color 0.2s;
  }
  
  .ai-button:hover {
    background-color: #e8eaed;
  }
  
  .ai-popup {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    padding: 16px;
    margin-top: 8px;
    min-width: 300px;
    z-index: 9999;
  }
`;

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
  const [generateJSON, setGenerateJSON] = useState<typeof generategptJSON | typeof generateclaudeJSON>(generategptJSON);

  const handleSubmit = async () => {
    try {
      setIsSubmit(true);
      const data = await generateJSON(textValue);
      if (data) {
        setMailData(data);
      }
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
        if (result.apiKey.startsWith("sk-ant-")) {
          setGenerateJSON(() => generateclaudeJSON);
        } else {
          setGenerateJSON(() => generategptJSON);
        }
      } else {
        setIsKeyLoaded(false);
      }
    });
  }, [isPopupOpen]);

  return (
    <div className="mail-wizard-root">
      <div className="ai-button-container">
        <div className="ai-button" onClick={() => setIsPopupOpen(!isPopupOpen)}>
          <AIIcon />
        </div>
        {isPopupOpen && (
          <div className="ai-popup" onClick={(e) => e.stopPropagation()}>
            {isKeyLoded ? (
              <Textbox
                placeholder="✨ Let the magic begin... What would you like to write?"
                rows={4}
                cols={40}
                disable={isSubmit}
                value={textValue}
                onChange={setTextValue}
                onSubmit={handleSubmit}
              />
            ) : (
              <div className="ai-popup" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center space-x-2 mb-2">
                  <svg
                    className="w-5 h-5 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                  <span className="font-medium text-purple-400">
                    Magic Key Required
                  </span>
                </div>
                <p className="text-sm">
                  Please add your OpenAI or Anthropic API key in the MailWizard extension's
                  popup to unlock the magic of AI-powered email generation. ✨
                </p>
              </div>
            )}
            {mailData && <MailSetter data={mailData} />}
          </div>
        )}
      </div>
    </div>
  );
};

const injectStyles = () => {
  if (!document.querySelector("#mail-wizard-styles")) {
    const styleSheet = document.createElement("style");
    styleSheet.id = "mail-wizard-styles";
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
  }
};

const injectExtension = () => {
  const composeBoxSelector = 'div[role="textbox"][aria-label="Message Body"]';

  const handleNewComposeBox = (mutations: MutationRecord[]) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          const composeBox = node.querySelector(composeBoxSelector);
          if (composeBox) {
            const composeContainer = composeBox.closest(".M9") as HTMLElement;

            if (
              composeContainer &&
              !composeContainer.querySelector(".mail-wizard-root")
            ) {
              composeContainer.style.position = "relative";

              const container = document.createElement("div");
              composeContainer.appendChild(container);

              const root = createRoot(container);
              root.render(<ExtensionComponent />);
            }
          }
        }
      });
    });
  };

  const existingObserver = (window as any).mailWizardObserver;
  if (existingObserver) {
    existingObserver.disconnect();
  }

  const observer = new MutationObserver(handleNewComposeBox);
  (window as any).mailWizardObserver = observer;

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
};

injectStyles();
injectExtension();

export default ExtensionComponent;
