document.getElementById("scan").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: "scan" }, (resp) => {
    console.log("Scan response:", resp);
  });
});

document.getElementById("clear").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: "clear" }, (resp) => {
    console.log("Clear response:", resp);
  });
});

// NEW: Run full EchoAccessible workflow
document.getElementById("run").addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.tabs.sendMessage(tab.id, { action: "run" }, (resp) => {
    console.log("Run EchoAccessible response:", resp);
  });
});
