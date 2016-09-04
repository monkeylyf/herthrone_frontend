var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'src/dist');
var APP_DIR = path.resolve(__dirname, 'src');

var config = {
  entry: APP_DIR + '/index.jsx',
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js'
  },
  module: {
    loaders : [
      {
        test : /\.jsx?/,
        include : APP_DIR,
        loader : 'babel'
      }
    ]
  },
  plugins: [
    function() {
      this.plugin('watch-run', function(watching, callback) {
        const options = {
          weekday: 'long',
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        };
        console.log('\nCompiling @' + (new Date()).toLocaleTimeString('ja-JP', options));
        callback();
      })
    }
  ]
};

module.exports = config;
