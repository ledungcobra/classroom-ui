import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
const WebpackPwaManifest = require('webpack-pwa-manifest');

const config: webpack.Configuration = {
  entry: ['./src/index.tsx'],
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        use: 'babel-loader',
        test: /\.tsx?$/,
        exclude: /node_modules/,
      },
      {
        test: /\.s?[ac]ss$/i,
        use: [
          process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|ico|ttf|svg|woff|eot)$/i,
        loader: 'file-loader',
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
      },
    ],
  },
  ignoreWarnings: [/Failed to parse source map/],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devServer: {
    static: path.join(__dirname, 'build'),
    compress: true,
    port: 3456,
    client: {
      overlay: true,
    },
    historyApiFallback: true,
    hot: true,
  },
  plugins: [
    // new WebpackPwaManifest({
    //   name: 'Classroom - App',
    //   short_name: 'Classroom - App',
    //   description: 'Classroom - App!',
    //   background_color: '#000000',
    //   crossorigin: 'use-credentials',
    //   icons: [
    //     {
    //       src: path.resolve('public/favicon.ico'),
    //       sizes: [16, 24, 32, 64], // multiple sizes
    //     },
    //     {
    //       src: path.resolve('public/logo192.png'),
    //       size: '192x192',
    //     },
    //     {
    //       src: path.resolve('public/logo512.png'),
    //       size: '512x512',
    //     },
    //   ],
    // }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index.html'),
      favicon: path.join(__dirname, 'public', 'favicon.ico'),
    }),
    new WebpackManifestPlugin({
      fileName: 'asset-manifest.json',
    }),
    new Dotenv({
      path: './.env',
      safe: true,
      allowEmptyValues: true,
      systemvars: true,
      silent: true,
      defaults: false,
    }),
    new MiniCssExtractPlugin({
      filename: 'public/[name].css',
      chunkFilename: '[id].css',
    }),
    // new CopyWebpackPlugin({ patterns: [{ from: 'public/one' }] }),
  ],
};
export default config;
