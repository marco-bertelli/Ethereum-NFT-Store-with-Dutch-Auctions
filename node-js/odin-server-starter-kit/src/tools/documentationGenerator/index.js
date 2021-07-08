import fs from 'fs';
import path from 'path';

const docsDir = path.join(__dirname, '../../../docs');
const apiDoc = JSON.parse(fs.readFileSync(path.join(docsDir, 'postman.json'), 'utf8'));

const entities = fs.readdirSync(path.join(docsDir, '/entities')).reduce((total, current) => {
  total[current.split('.')[0]] = JSON.parse(
    fs.readFileSync(path.join(docsDir, '/entities', current), 'utf8')
  );
  return total;
}, {});

for (let i = 0; i < apiDoc.item.length; i++) {
  let item = apiDoc.item[i];
  for (let j = 0; j < item.item.length; j++) {
    let request = item.item[j];
    request.request.body.raw = JSON.stringify(entities[item.name]) || '';
  }
}

fs.writeFileSync(path.join(docsDir, 'postman.json'), JSON.stringify(apiDoc));
