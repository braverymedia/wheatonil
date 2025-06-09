const fs = require('fs');
const path = require('path');

// Path to the HTML head file
const htmlHeadPath = path.join(__dirname, 'src/_includes/components/html-head.njk');

// Read the file
let html = fs.readFileSync(htmlHeadPath, 'utf8');

// Replace the old script tags with the new ones
const newScripts = `
    <script type="module" src="/assets/js/wheaton.js"></script>
    <script nomodule src="/assets/js/legacy.js"></script>
    <script src="/assets/js/program-finder-2023.bundle.js"></script>`;

// Update the HTML
const updatedHtml = html.replace(
    /<script src="\/assets\/js\/wheaton\.bundle\.js"><\/script>\s*<script src="\/assets\/js\/program-finder-2023\.bundle\.js"><\/script>/,
    newScripts
);

// Write the updated HTML back to the file
fs.writeFileSync(htmlHeadPath, updatedHtml, 'utf8');

console.log('HTML updated successfully!');
