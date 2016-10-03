const webpack = require('webpack');

const SRC_DIR = path.join(__dirname, 'client', 'src');
const DIST_DIR = path.join(__dirname, 'client', 'public');

const config = {
  devtool: 'inline-sourcemap',
  resolve: {
    root: __dirname,
    modulesDirectories: ['node_modules'],
    extensions: ['', '.js', '.jsx']
  },
  entry: './oublic/index.js',
  output: {
    path: './public',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        include: "./public",
        loader: 'babel'
      }
    ]
  }
};

module.exports = config;
