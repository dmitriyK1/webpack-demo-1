const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');

const parts = require('./webpack.parts');

const PATHS = {
  app: path.join(__dirname, 'app'),
  style: [
    path.join(__dirname, 'node_modules', 'purecss'),
    path.join(__dirname, 'app', 'main.css')
  ],
  build: path.join(__dirname, 'build')
};

const common = {
  // Entry accepts a path or an object of entries.
  // We'll be using the latter form given it's
  // convenient with more complex configurations.
  entry: {
    style: PATHS.style,
    app: PATHS.app
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Webpack demo'
    })
  ]
};

module.exports = function(env) {
  if (['build', 'stats'].indexOf(env) >= 0) {
    return merge(
      common,
      {
        devtool: 'source-map',
        output: {
          path: PATHS.build,
          publicPath: '/webpack-demo/',
          filename: '[name].[chunkhash].js',
          chunkFilename: '[chunkhash].js'
        }
      },
      parts.clean(PATHS.build),
      parts.setFreeVariable(
        'process.env.NODE_ENV',
        'production'
      ),
      parts.extractBundle({
        name: 'vendor',
        entries: ['react']
      }),
      parts.minify(),
      parts.extractCSS(PATHS.style),
      parts.purifyCSS([PATHS.app])
    );
  }

  return merge(
    common,
    {
      devtool: 'eval-source-map',
      performance: {
        hints: false
      }
    },
    parts.setupCSS(PATHS.style),
    parts.devServer({
      // Customize host/port here if needed
      host: process.env.HOST,
      port: process.env.PORT
    })
  );
}
