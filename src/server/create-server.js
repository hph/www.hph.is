import Express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';

import renderPage from './render-page';
import forceTls from './force-tls';
import slashCoding from './slash-coding';

const isProd = process.env.NODE_ENV === 'production';

export default function createServer() {
  const server = new Express();
  if (isProd) {
    server.use(forceTls);
  }
  server.use(cookieParser());
  server.use(helmet());
  server.use(compression());
  server.use(Express.static('build', isProd ? { maxAge: '1 year' } : {}));
  server.use(slashCoding);
  server.get('*', renderPage);
  return server;
}
