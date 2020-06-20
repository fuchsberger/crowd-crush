const path = require('path')
const glob = require('glob')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
// const webpack = require("webpack")

module.exports = (env, options) => ({
  stats: 'errors-warnings',
  optimization: {
    minimizer: [
      new TerserPlugin({ test: /\.js(\?.*)?$/i, }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  entry: './js/app.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, '../priv/static/js')
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/i,
        use: { loader: 'babel-loader' }
      },
      {
        test: /\.(s?)css/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: ['node_modules/bootstrap/scss']
              }
            }
          }
        ]
      },
      {
        test: /\.(eot|png|svg|ttf|woff|woff2)$/i,
        use: {
          loader: 'url-loader',
          options: { limit: 8192 }
        }
      }
    ]
  },
  plugins: [
    // new webpack.ProvidePlugin({
    //   $: "jquery",
    //   jQuery: "jquery"
    // }),
    new MiniCssExtractPlugin({ filename: '../css/app.css' }),
    new CopyWebpackPlugin({
      patterns: [{ from: 'static/', to: '../' }]
    })
  ]
});
