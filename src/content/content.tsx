import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import Textbox from "../components/Textbox";
import { generateJSON,GmailComposeType } from "../openAi/openAi";
import MailSetter from "../components/mailsetter";


const styles = `
  .ai-button-container {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
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
    z-index: 1000;
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

  const handleSubmit = async () => {
    try{
      const data = await generateJSON(textValue);
      setMailData(data);
    } catch(err){
      console.error("Error generating mail data", err);
    }
  };

  return (
    <div className="ai-button-container">
      <div className="ai-button" onClick={() => setIsPopupOpen(!isPopupOpen)}>
        <AIIcon />
      </div>
      {isPopupOpen && (
        <div className="ai-popup" onClick={(e) => e.stopPropagation()}>
          <Textbox
            placeholder="Enter your prompt..."
            rows={4}
            cols={40}
            value={textValue}
            onChange={setTextValue}
            onSubmit={handleSubmit}
          />
          {mailData && <MailSetter data={mailData} />}
        </div>
      )}
    </div>
  );
};


const injectStyles = () => {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
};

const injectExtension = () => {

  const composeBoxSelector = 'div[role="textbox"][aria-label="Message Body"]';
  
  const handleNewComposeBox = (mutations: MutationRecord[]) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          const composeBox = node.querySelector(composeBoxSelector);
          if (composeBox && !composeBox.parentElement?.querySelector('.ai-button-container')) {

            if (composeBox.parentElement) {
              composeBox.parentElement.style.position = 'relative';
            }
            
            
            const container = document.createElement('div');
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


injectStyles();
injectExtension();