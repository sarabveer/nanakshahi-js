const { BannerPlugin } = require( 'webpack' )
const path = require( 'path' )
const { author, version } = require( './package.json' )

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
    new BannerPlugin( `nanakshahi-js v${version} | ${author} | https://github.com/Sarabveer/nanakshahi-js` ),
  ],
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [ '@babel/plugin-proposal-class-properties' ],
            presets: [ '@babel/preset-env' ],
          },
        },
      },
    ],
  },
}
