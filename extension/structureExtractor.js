/**
 * structureExtractor.js
 * Extracts a simple visual structure from the DOM
 * Groups elements into columns based on horizontal position
 */

function extractStructure(root = document.body) {
    const allElements = Array.from(root.querySelectorAll("*"))
        .filter(el => el.offsetParent !== null); // visible elements only

    // Map elements to their bounding rects
    const elementsWithRect = allElements.map(el => {
        const rect = el.getBoundingClientRect();
        return { el, rect };
    });

    // Sort elements top → bottom
    elementsWithRect.sort((a, b) => a.rect.top - b.rect.top);

    // Group into columns based on left position
    const columns = [];

    elementsWithRect.forEach(({ el, rect }) => {
        let foundColumn = false;
        for (const col of columns) {
            if (Math.abs(col[0].rect.left - rect.left) < threshold) {
                col.push({ el, rect });
                foundColumn = true;
                break;
            }
        }
        if (!foundColumn) {
            columns.push([{ el, rect }]);
        }
    });

    console.log("Structure extracted:", columns);
    return columns;
}

// Test function (call in DevTools)
function testStructure() {
    const structure = extractStructure();
    structure.forEach((col, i) => {
        console.log(`Column ${i + 1}:`, col.map(e => e.el.tagName));
    });
    return structure;
}
