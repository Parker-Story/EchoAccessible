// ariaInjector.js
// EchoAccessible - ARIA Enhancement Engine (v1)
//
// This module analyzes the DOM and adds missing ARIA attributes
// and semantic roles to improve screen-reader accessibility.
//
// It is intentionally conservative to avoid breaking layouts or
// overriding developer intent. We improve accessibility without
// altering visual behavior.

export function runAriaInjection() {
    console.log("🔍 EchoAccessible: Running ARIA Injector...");

    labelButtons();
    labelClickableDivsAndSpans();
    addNavigationLandmarks();
    fixImageAccessibility();
    labelFormElements();

    console.log("✨ EchoAccessible: ARIA Injection Complete!");
}

/* -------------------------------------------------------
 *  Helpers
 * -----------------------------------------------------*/

// Add aria-labels to <button> elements missing accessible names
function labelButtons() {
    const buttons = document.querySelectorAll("button, [role='button']");

    buttons.forEach((btn, i) => {
        const hasLabel =
            btn.getAttribute("aria-label") ||
            btn.innerText.trim().length > 0 ||
            btn.getAttribute("aria-labelledby");

        if (!hasLabel) {
            btn.setAttribute("aria-label", "button");
            btn.setAttribute("data-echoaccessible", "added-label");
        }
    });
}

// Identify clickable divs/spans and give them semantic roles
function labelClickableDivsAndSpans() {
    const clickable = Array.from(document.querySelectorAll("div, span"))
        .filter(el => {
            const isClickable =
                el.onclick ||
                el.getAttribute("onclick") ||
                el.getAttribute("role") === "button" ||
                getComputedStyle(el).cursor === "pointer";

            return isClickable;
        });

    clickable.forEach((el) => {
        if (!el.getAttribute("role")) {
            el.setAttribute("role", "button");
            el.setAttribute("tabindex", "0");
            el.setAttribute("data-echoaccessible", "role-button");
        }

        // Add default label if it’s visually empty
        const visibleText = el.innerText.trim();
        if (visibleText.length === 0 && !el.getAttribute("aria-label")) {
            el.setAttribute("aria-label", "clickable element");
        }
    });
}

// Add roles to navbars, headers, footers, and main content areas
function addNavigationLandmarks() {
    const landmarks = [
        { selector: "header", role: "banner" },
        { selector: "footer", role: "contentinfo" },
        { selector: "main", role: "main" },
        { selector: "nav", role: "navigation" },
        { selector: "[aria-label='navigation']", role: "navigation" }
    ];

    landmarks.forEach(({ selector, role }) => {
        document.querySelectorAll(selector).forEach(el => {
            if (!el.getAttribute("role")) {
                el.setAttribute("role", role);
                el.setAttribute("data-echoaccessible", "landmark");
            }
        });
    });
}

// Add alt text to images missing it
function fixImageAccessibility() {
    const images = document.querySelectorAll("img");

    images.forEach((img) => {
        const alt = img.getAttribute("alt");

        // If alt="" is intentionally empty, skip it (decorative)
        if (alt === "") return;

        if (alt === null) {
            img.setAttribute("alt", "Image");
            img.setAttribute("data-echoaccessible", "added-alt");
        }
    });
}

// Add roles + labels for form elements
function labelFormElements() {
    const inputs = document.querySelectorAll("input, textarea, select");

    inputs.forEach((el) => {
        const type = el.getAttribute("type") || "text";

        // Skip labeled elements
        const hasLabel = el.labels?.length > 0;
        const hasAria = el.getAttribute("aria-label") || el.getAttribute("aria-labelledby");

        if (!hasLabel && !hasAria) {
            el.setAttribute("aria-label", `${type} input`);
            el.setAttribute("data-echoaccessible", "input-label");
        }

        // Add roles to more obscure inputs
        if (!el.getAttribute("role")) {
            if (type === "search") el.setAttribute("role", "searchbox");
            if (type === "checkbox") el.setAttribute("role", "checkbox");
            if (type === "radio") el.setAttribute("role", "radio");
        }
    });
}

export default { runAriaInjection };
