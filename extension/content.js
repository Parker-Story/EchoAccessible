// Basic scanning logic (MVP). Marks elements with class "ea-low-contrast".
// NOTE: This is a simple, conservative luminance check for demo purposes.

function parseRgb(colorStr) {
  if (!colorStr) return null;
  const m = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

function luminance([r, g, b]) {
  // simple perceived luminance
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function getEffectiveBackgroundColor(el) {
  // Walk up until a non-transparent background is found.
  let node = el;
  while (node && node !== document.documentElement) {
    const bg = window.getComputedStyle(node).backgroundColor;
    if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg;
    node = node.parentElement;
  }
  // fallback white
  return 'rgb(255,255,255)';
}

function isLowContrast(el) {
  try {
    const style = window.getComputedStyle(el);
    const fg = parseRgb(style.color) || [0,0,0];
    const bg = parseRgb(getEffectiveBackgroundColor(el)) || [255,255,255];
    if (!fg || !bg) return false;
    const L1 = luminance(fg);
    const L2 = luminance(bg);
    return Math.abs(L1 - L2) < 50; // conservative threshold for MVP
  } catch (e) {
    return false;
  }
}

function scanPage() {
  // remove previous marks
  document.querySelectorAll(".ea-low-contrast").forEach(n => n.classList.remove("ea-low-contrast"));

  const all = Array.from(document.querySelectorAll("body *"));
  for (const el of all) {
    // skip invisible elements
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden" || style.opacity === "0") continue;
    if (isLowContrast(el)) {
      el.classList.add("ea-low-contrast");
    }
  }
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.action === "scan") {
    scanPage();
    sendResponse({ status: "scanned" });
  }
  if (msg && msg.action === "clear") {
    document.querySelectorAll(".ea-low-contrast").forEach(n => n.classList.remove("ea-low-contrast"));
    sendResponse({ status: "cleared" });
  }
});
