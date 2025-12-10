/**
 * content.js
 * Orchestrates all EchoAccessible modules
 * - Extracts structure
 * - Rewrites DOM
 * - (Placeholder) Generates alt-text
 * - (Placeholder) Injects ARIA tags
 */

// ----- Orchestrator -----
import { runAriaInjection } from "./ariaInjector.js";

function runEchoAccessible(options = {}) {
    console.log("EchoAccessible running...");

    // Step 1: Extract structure from DOM
    if (typeof extractStructure !== "function") {
        console.error("extractStructure() not found!");
        return;
    }
    const structure = extractStructure();

    // Step 2: Rewrite the DOM
    if (typeof rewriteDOM !== "function") {
        console.error("rewriteDOM() not found!");
        return;
    }
    rewriteDOM(structure);

    // Step 3: Generate alt-text (placeholder)
    if (options.altText && typeof generateAltText === "function") {
        generateAltText();
    }

    // Step 4: Inject ARIA tags (placeholder)
    if (options.aria && typeof injectAriaTags === "function") {
        injectAriaTags();
    }

    console.log("EchoAccessible run complete.");
}

// ----- Message listener for popup buttons -----
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg && msg.action === "run") {
        runEchoAccessible({ altText: true, aria: true });
        sendResponse({ status: "done" });
    }

    if (message.action === "injectAria") {
    runAriaInjection();
    sendResponse({ status: "ARIA injection complete" });
    }

    if (msg && msg.action === "scan") {
        // MVP legacy scan (highlight low-contrast) for testing
        if (typeof scanPage === "function") scanPage();
        sendResponse({ status: "scanned" });
    }

    if (msg && msg.action === "clear") {
        document.querySelectorAll(".ea-low-contrast").forEach(n => n.classList.remove("ea-low-contrast"));
        sendResponse({ status: "cleared" });
    }
});
