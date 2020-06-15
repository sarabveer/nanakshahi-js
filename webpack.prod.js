// eslint-disable-next-line import/no-extraneous-dependencies
const merge = require( 'webpack-merge' )
const config = require( './webpack.config.js' )

module.exports = merge( config, {
  output: {
    filename: 'index.min.js',
  },
  optimization: {
    minimize: true,
  },
} )
