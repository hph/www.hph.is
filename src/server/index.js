import Loadable from 'react-loadable';

import createServer from './create-server';

export default function startServer() {
  const server = createServer();
  Loadable.preloadAll()
    .then(() => {
      const port = process.env.PORT || 4000;
      server.listen(port);
      console.log(`Server listening on http://localhost:${port}`); // eslint-disable-line no-console
    })
    .catch(error => {
      console.log('Preloading components failed; could not start server.'); // eslint-disable-line no-console
      console.log('Full error:', error); // eslint-disable-line no-console
      process.exit(1);
    });
}

if (require.main === module) {
  startServer();
}
