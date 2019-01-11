import fs from 'fs';
import { promisify } from 'util';
import { preloadAll } from 'react-loadable';

import { renderPage } from './render-page';

const writeFile = promisify(fs.writeFile);

preloadAll()
  .then(() => {
    const pages = [
      ['/coding/', 'coding.html'],
      ['/launareiknivel', 'launareiknivel.html'],
      ['/launareiknivel', 'laun.html'],
      ['/launareiknivel', 'calculator.html'],
      ['/not-a-page', '404.html'],
    ];

    const posts = ['bitmasks-react-context', 'server-side-rendering-react'];

    const promises = [];

    pages.forEach(([path, filename]) => {
      const page = renderPage(path);
      promises.push(
        writeFile(`build/${filename}`, page, { encoding: 'utf-8' }),
      );
    });

    posts.forEach(post => {
      const page = renderPage(`/coding/${post}`);
      promises.push(
        writeFile(`build/coding/${post}.html`, page, { encoding: 'utf-8' }),
      );
    });

    return Promise.all(promises);
  })
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('\nDone rendering routes to static markup');
  });
