// Minimal background to keep manifest happy. Could later handle messaging/auth.
chrome.runtime.onInstalled.addListener(() => {
  console.log("EchoAccessible installed.");
});
