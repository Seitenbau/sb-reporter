var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
const CopyWebpackPlugin = require('copy-webpack-plugin')

const build = '../build/third-Api-Service';

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
    filename: 'berichtsgenerator-server.js'
  },
  externals: nodeModules,
  plugins: [
      new webpack.IgnorePlugin(/^\.\/transformers$/),
      new CopyWebpackPlugin(['config.js', 'transformers/**'], {from: '.', to: path.join(__dirname, build)}),
  ],
}
