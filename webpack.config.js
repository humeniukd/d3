const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'eval',
  entry: './src/app.js',
  resolve: {
    modulesDirectories: ['src', 'node_modules'],
    extensions: ['', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /worker\.js$/,
        loader: 'worker-loader'
      },
      { test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      template: 'src/index.html'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    hot: true,
    quiet: true,
    inline: true,
    stats: false,
    watchOptions: { poll: 1000, ignored: /node_modules/ }
  }
};
