let passwordCheckedTabs = {};

chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId === 0) {  // Only for main frame
    passwordCheckedTabs[details.tabId] = false;
  }
});

chrome.tabs.onRemoved.addListener((tabId) => {
  delete passwordCheckedTabs[tabId];
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "checkPasswordStatus") {
    sendResponse({checked: passwordCheckedTabs[sender.tab.id] || false});
  } else if (request.action === "setPasswordChecked") {
    passwordCheckedTabs[sender.tab.id] = true;
    sendResponse({success: true});
  }
});
