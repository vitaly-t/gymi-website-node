module.exports = {
  entry: './demo/index.js',
  output: {
    path: 'demo',
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    loaders: [
      {
        test: /\.(eot|woff|svg|ttf|png)$/,
        loader: 'url',
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css'],
      },
      {
        test: /\.less$/,
        loader: 'style!css!less',
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
    ],
  },
};

