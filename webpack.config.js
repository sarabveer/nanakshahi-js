const { BannerPlugin } = require( 'webpack' )
const path = require( 'path' )
const { author, license, version } = require( './package.json' )

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
    new BannerPlugin( `nanakshahi-js v${version} | ${author} | ${license} | https://github.com/Sarabveer/nanakshahi-js` ),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
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
