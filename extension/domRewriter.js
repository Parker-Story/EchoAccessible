/**
 * domRewriter.js
 * Reorders elements vertically based on extracted structure
 * Flattens nested divs
 */

function rewriteDOM(structure = null) {
    if (!structure) {
        // Default: extract structure if not provided
        if (typeof extractStructure !== "function") {
            console.error("extractStructure() not found!");
            return;
        }
        structure = extractStructure();
    }

    console.log("Rewriting DOM based on structure...");

    // Create a container to temporarily hold reordered elements
    const container = document.createElement("div");
    container.id = "ea-rewritten-container";

    structure.forEach(col => {
        // Sort elements in column top → bottom
        col.sort((a, b) => a.rect.top - b.rect.top);

        col.forEach(({ el }) => {
            // Flatten nested divs by appending children directly
            if (el.tagName === "DIV" && el.children.length > 0) {
                Array.from(el.children).forEach(child => {
                    container.appendChild(child);
                });
            } else {
                container.appendChild(el);
            }
        });
    });

    // Replace original body content with rewritten content
    document.body.innerHTML = "";
    document.body.appendChild(container);

    console.log("DOM rewriting complete. New body appended.");
}

// Test function (call in DevTools)
function testRewrite() {
    const structure = typeof extractStructure === "function" ? extractStructure() : null;
    rewriteDOM(structure);
}
