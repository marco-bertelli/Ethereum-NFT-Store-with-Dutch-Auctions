/* eslint-disable no-console */
import path from 'path';
import _ from 'lodash';
import fs from 'fs';
import dummy from '@becodebg/mongoose-dummy';
import appRoot from 'app-root-path';

let allModules = {};

const docsDir = path.join(__dirname, '../../../docs/entities');

fs.readdirSync(appRoot.toString() + '/src/api')
  .filter(f => !f.startsWith('_'))
  .map(f => ({
    name: f,
    module: path.join(appRoot.toString() + '/src/api', f)
  }))
  .filter(a => fs.statSync(a.module).isDirectory())
  .forEach(a => {
    if (fs.existsSync(path.join(a.module, '/model.js'))) {
      allModules[a.name] = require(path.join(a.module, '/model.js'));
    }
  });

const ignoredFields = ['_id', 'created_at', '__v', /detail.*_info/];
try {
  fs.mkdirSync(docsDir);
} catch (e) {
  console.log('Output directory already exists');
}
_.forEach(allModules, model => {
  let toWrite = '';
  let randomObject = dummy(model.default, {
    autoDetect: false,
    ignore: ignoredFields,
    returnDate: true
  });
  toWrite += JSON.stringify(randomObject, null, 2);

  fs.writeFile(path.join(docsDir, model.default.modelName + '.json'), toWrite, function(err) {
    if (err) {
      return console.log(err);
    }
    console.log(model.default.modelName + ' file was saved!');
  });
});
