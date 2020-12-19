// @ts-check
const fs = require('fs');
const path = require('path');

const componentName = process.argv
  .slice(2)
  .find(v => !/-/.test(v))
  .replace(/^\w/, function (chr) {
    return chr.toUpperCase();
  });
const componentOnly = process.argv.find(v => v === '-s');
const dist = path.join(
  __dirname,
  `../packages/web/components`,
  componentOnly ? '' : componentName
);

const write = (path, content) => {
  fs.writeFileSync(
    path,
    content.replace(/^ {2}/gm, '').replace(/^ *\n/, ''),
    'utf-8'
  );
};

if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist);
}

const index = `export * from './${componentName}';`;

const reactComponent = `
import React from 'react';
import classes from './${componentName}.module.scss'
  
  export function ${componentName}() {
    return (
      <div className={classes['${componentName
        .split(/(?=[A-Z])/)
        .map(str => str.toLocaleLowerCase())
        .join('-')}']}></div>
    );
  }
  `;

const scss = `@import '~styles/utils';`;

if (!componentOnly) {
  write(`${dist}/index.ts`, index);
  write(`${dist}/${componentName}.module.scss`, scss);
}
write(`${dist}/${componentName}.tsx`, reactComponent);
