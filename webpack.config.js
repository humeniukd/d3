const webpack = require('webpack');

module.exports = {
  entry: './src/app.js',
  resolve: {
    modulesDirectories: ['src', 'node_modules'],
    extensions: ['', '.js']
  },
    output: {
        path: __dirname + '/build',
        publicPath: "/d3/",
        filename: "[name].js", //-[chunkhash]
        chunkFilename: "[name].js"
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
      new webpack.optimize.UglifyJsPlugin({
        output: {comments: false},
        compress: {
          warnings: false
        }
      })
    ],
};
