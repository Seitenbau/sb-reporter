var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin')
const build = '../build/BerichtsgeneratorServer';

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: './index.js',
  target: 'node',
  output: {
    path: path.join(__dirname, build),
    filename: 'berichtsgenerator-server.js',
  },
  resolve: {
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.js$/,
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/config\.js$/),
    new CopyWebpackPlugin(['config.js'], {from: '.', to: path.join(__dirname, build)})
  ],
}
