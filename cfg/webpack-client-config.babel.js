import { resolve } from 'path';
import webpack from 'webpack';
import { ReactLoadablePlugin } from 'react-loadable/webpack';
import HashedChunkIds from 'webpack-hashed-chunkids';
import CopyPlugin from 'copy-webpack-plugin';

const isProd = process.env.NODE_ENV === 'production';

export default {
  context: resolve('./src'),
  entry: {
    client: './client',
    ...(isProd
      ? {
          vendor: [
            'react',
            'react-dom',
            'react-router-dom',
            'react-loadable',
            'glamor',
            'glamorous',
            'history/createBrowserHistory',
          ],
        }
      : {}),
  },
  output: {
    path: resolve('./build'),
    filename: isProd ? '[name]-[chunkhash].js' : '[name].js',
    chunkFilename: isProd ? '[name]-[chunkhash].js' : '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          cacheDirectory: false,
        },
      },
    ],
  },
  plugins: [
    new ReactLoadablePlugin({
      filename: './build/react-loadable.json',
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',
    }),
    new CopyPlugin(['../static/favicon.ico', '../static/robots.txt']),
    ...(isProd
      ? [
          new webpack.optimize.ModuleConcatenationPlugin(),
          new webpack.HashedModuleIdsPlugin(),
          new HashedChunkIds(),
          new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: Infinity,
          }),
          new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime',
          }),
          new webpack.optimize.UglifyJsPlugin({
            output: {
              comments: false,
            },
          }),
        ]
      : [new webpack.NamedModulesPlugin()]),
  ],
};
