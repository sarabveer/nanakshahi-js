const path = require( 'path' )
const { BannerPlugin } = require( 'webpack' )
const { version, author, license } = require( './package.json' )

module.exports = {
  mode: 'production',
  entry: './index.js',
  output: {
    filename: 'index.js',
    path: path.resolve( __dirname, 'dist' ),
    library: 'nanakshahi',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new BannerPlugin( `nanakshahi-js v${version} | ${license} | Copyright (C) ${author}` ),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [ '@babel/preset-env' ],
          },
        },
      },
    ],
  },
}
