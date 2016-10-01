var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './src/app.js',
  output: { path: __dirname + '/dist', filename: 'bundle.js' },
  module: {
   loaders: [
     {
       test: /.jsx?$/,
       loader: 'babel-loader',
       exclude: /node_modules/,
       query: {
         presets: ['es2015', 'react']
       }
     },
     {
       test: /.scss$/,
       exclude: /node_modules/,
       loader: ExtractTextPlugin('css!sass')
     }
   ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  devServer: {
    contentBase: './dist',
    hot: true
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('dist/main.css', {
      allChunks: true
    })
  ]
};
