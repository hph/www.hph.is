import webpack from 'webpack';
import { resolve } from 'path';

const isProd = process.env.NODE_ENV === 'production';

export default {
  target: 'node',
  context: resolve('./src'),
  externals: {
    // Ignore server-side modules in order to make bundling faster and to
    // ignore certain Webpack warnings caused by dynammic imports within these
    // modules.
    express: 'commonjs ../node_modules/express/',
    helmet: 'commonjs ../node_modules/helmet/',
    compression: 'commonjs ../node_modules/compression/',
  },
  entry: {
    server: './server',
  },
  output: {
    path: resolve('./build'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          cacheDirectory: false,
          plugins: ['react-loadable/babel', 'dynamic-import-node'],
        },
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
    ...(isProd ? [new webpack.optimize.UglifyJsPlugin()] : []),
  ],
};
