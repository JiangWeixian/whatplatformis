const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { WebpackPluginReactPages } = require('webpack-plugin-react-pages')

const configs = require('./config')

/**
 * @type import('webpack').Configuration
 */
const common = {
  context: configs.path.context,
  entry: ['./src/index.tsx'],
  output: {
    path: configs.path.output,
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', 'jsx'],
    alias: {
      '@': configs.path.project,
      assets: configs.path.assets,
      static: configs.path.static,
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'tsx',
              target: 'es2015',
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[path][name].[ext]',
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: configs.path.static,
          to: 'static',
        },
        {
          from: configs.path.public,
          to: '',
        },
      ],
    }),
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        configFile: configs.path.tsconfig,
      },
      async: true,
    }),
    new WebpackPluginReactPages({
      importMode: 'async',
    }),
  ],
}

module.exports = common
