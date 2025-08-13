import fs from 'fs';
import path from 'path';

// List of files to update with their new layout references
const filesToUpdate = [
  { file: 'src/center.njk', oldLayout: 'layouts/general.njk', newLayout: 'general.njk' },
  { file: 'src/faculty-search.njk', oldLayout: 'layouts/faculty.njk', newLayout: 'faculty.njk' },
  { file: 'src/faculty.njk', oldLayout: 'layouts/faculty.njk', newLayout: 'faculty.njk' },
  { file: 'src/forms.njk', oldLayout: 'layouts/general.njk', newLayout: 'general.njk' },
  { file: 'src/general.njk', oldLayout: 'layouts/general.njk', newLayout: 'general.njk' },
  { file: 'src/index.njk', oldLayout: 'layouts/home.njk', newLayout: 'home.njk' },
  { file: 'src/map.njk', oldLayout: 'layouts/general.njk', newLayout: 'general.njk' },
  { file: 'src/program-grad.njk', oldLayout: 'layouts/program.njk', newLayout: 'program.njk' },
  { file: 'src/program.njk', oldLayout: 'layouts/program.njk', newLayout: 'program.njk' },
  { file: 'src/programs.njk', oldLayout: 'layouts/general.njk', newLayout: 'general.njk' },
  { file: 'src/slate.njk', oldLayout: 'layouts/slate.njk', newLayout: 'slate.njk' },
];

// Update each file
filesToUpdate.forEach(({ file, oldLayout, newLayout }) => {
  try {
    const filePath = path.resolve(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Update the layout reference
      const updatedContent = content.replace(
        new RegExp(`^layout:\\s*${oldLayout}`, 'm'),
        `layout: ${newLayout}`
      );
      
      // Only write if there was a change
      if (updatedContent !== content) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`Updated layout in ${file} from ${oldLayout} to ${newLayout}`);
      } else {
        console.log(`No change needed for ${file}`);
      }
    } else {
      console.warn(`File not found: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${file}:`, error.message);
  }
});

console.log('Layout update complete!');
