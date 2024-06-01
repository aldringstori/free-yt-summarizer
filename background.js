// background.js

const sendMessageToTab = (tabId, message) => {
    chrome.tabs.sendMessage(tabId, message, (response) => {
      if (chrome.runtime.lastError) {
        // Retry sending the message if there was an error
        setTimeout(() => sendMessageToTab(tabId, message), 1000);
      } else {
        console.log("Message sent to tab:", response);
      }
    });
  };
  
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.includes("youtube.com/watch")) {
      const queryParameters = tab.url.split("?")[1];
      const urlParameters = new URLSearchParams(queryParameters);
  
      sendMessageToTab(tabId, {
        type: "NEW",
        videoId: urlParameters.get("v"),
      });
    }
  });
