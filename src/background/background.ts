chrome.runtime.onInstalled.addListener(() => {
    console.log('Extension installed!');
  });
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes("mail.google.com")){
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["content.js"]
    });
  }
  });
