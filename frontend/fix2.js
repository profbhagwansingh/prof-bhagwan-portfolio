const fs = require('fs');
let c = fs.readFileSync('src/app/(public)/ecrrb/apply/page.tsx', 'utf8');

// Replace any occurrence of literal backslash-backtick with just backtick
c = c.replace(/\\`/g, '`');

// Replace any occurrence of literal backslash-dollar with just dollar
c = c.replace(/\\\$/g, '$');

fs.writeFileSync('src/app/(public)/ecrrb/apply/page.tsx', c);
console.log("Fixed syntax errors!");
