import Loadable from 'react-loadable';

import createServer from './create-server';
import log from './logger';

export default function startServer() {
  const server = createServer();
  Loadable.preloadAll()
    .then(() => {
      const port = process.env.PORT || 4000;
      server.listen(port, error => {
        if (error) {
          console.log(error);
          return;
        }
        log.info(`Server listening on http://localhost:${port}`);
      });
    })
    .catch(({ message, stack }) => {
      log.error(
        {
          message,
          stack,
        },
        'Preloading components failed; could not start server',
      );
      process.exit(1);
    });
}

if (require.main === module) {
  startServer();
}
