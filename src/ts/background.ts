import { AppConfig } from "./app-config";

let lastActiveTab: chrome.tabs.Tab;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case "authorization":
      lastActiveTab = sender.tab;
      chrome.runtime.openOptionsPage();
      break;

    case "options":
      if (lastActiveTab) {
        chrome.tabs.sendMessage(lastActiveTab.id, AppConfig.convertObjectToConfig(message.data));
        chrome.tabs.update(lastActiveTab.id, { active: true } );
        lastActiveTab = null;
      }
      break;
  }
});
