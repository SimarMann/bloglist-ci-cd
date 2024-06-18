const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = (env, argv) => {
  const { mode } = argv;
  const additionalPlugins =
    mode === 'production' ? [] : [new webpack.HotModuleReplacementPlugin()]; // Enable hot module replacement

  const additionalEntries =
    mode === 'production'
      ? []
      : ['webpack-hot-middleware/client?http://localhost:8000'];

  return {
    mode,
    entry: [
      'core-js/stable', // so we don't need to import it anywhere
      './client',
      ...additionalEntries,
    ],
    resolve: {
      alias: {
        Utilities: path.resolve(__dirname, 'client/util/'),
        Components: path.resolve(__dirname, 'client/components/'),
        Assets: path.resolve(__dirname, 'client/assets/'),
        '@root': path.resolve(__dirname),
      },
      extensions: ['.js', '.jsx'],
    },
    module: {
      rules: [
        {
          // Load JS files
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          // Load other files
          test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
          use: 'asset/resource',
        },
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.BUILT_AT': JSON.stringify(new Date().toISOString()),
        'process.env.NODE_ENV': JSON.stringify(mode),
      }),
      // Skip the part where we would make a html template
      new HtmlWebpackPlugin({
        template: 'index.html',
        favicon: path.resolve(__dirname, 'client/assets/favicon-32x32.png'),
      }),
      ...additionalPlugins,
    ],
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
  };
};
