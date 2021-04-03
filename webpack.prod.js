/* eslint-disable import/no-extraneous-dependencies */
const { merge } = require( 'webpack-merge' )
const TerserPlugin = require( 'terser-webpack-plugin' )
const config = require( './webpack.config.js' )

module.exports = merge( config, {
  output: {
    filename: 'index.min.js',
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin( {
        extractComments: false,
      } ),
    ],
  },
} )
