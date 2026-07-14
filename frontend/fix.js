const fs = require('fs');
let c = fs.readFileSync('src/app/(public)/ecrrb/apply/page.tsx', 'utf8');
c = c.split('\\\\`').join('`').split('\\\\$').join('$');
fs.writeFileSync('src/app/(public)/ecrrb/apply/page.tsx', c);
