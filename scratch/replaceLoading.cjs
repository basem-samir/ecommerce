const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../src/pages');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.jsx')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk(srcDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Check if file has a loading tag we can replace
  const loadingRegex = /<p[^>]*>\s*Loading[^<]*<\/p>/g;
  if (loadingRegex.test(content)) {
    console.log(`Replacing in ${file}`);
    
    // Determine the relative path to components/Loader
    // Assuming all files in this script are 1 or 2 levels deep in src/pages
    const depth = file.split(path.sep).length - srcDir.split(path.sep).length;
    const relPath = depth === 1 ? '../components/Loader' : '../../components/Loader';
    
    // Add import if not present
    if (!content.includes('Loader')) {
      // Find the last import
      const lastImportIndex = content.lastIndexOf('import ');
      if (lastImportIndex !== -1) {
        const endOfLastImport = content.indexOf('\n', lastImportIndex);
        content = content.slice(0, endOfLastImport + 1) + `import Loader from '${relPath}';\n` + content.slice(endOfLastImport + 1);
      } else {
        content = `import Loader from '${relPath}';\n` + content;
      }
    }
    
    // If it's a table-based page, use skeleton-table
    let loaderType = 'spinner';
    if (file.includes('Admin') || file.includes('Orders') || file.includes('Cancellations')) {
        loaderType = 'skeleton-table';
    } else if (file.includes('Products')) {
        loaderType = 'skeleton-card';
    }

    content = content.replace(loadingRegex, `<Loader type="${loaderType}" />`);
    fs.writeFileSync(file, content, 'utf8');
  }
});
console.log('Done!');
