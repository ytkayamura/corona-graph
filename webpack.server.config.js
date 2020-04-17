const nodeExternals = require('webpack-node-externals');

module.exports = (env, argv) => ({
  mode: argv.mode,
  entry: './src/server/server.ts',
  target: 'node',
  externals: [nodeExternals()],
  output: {
    filename: 'server.js',
    path: `${__dirname}/dist`,
  },
  node: {
    __filename: false,
    __dirname: false
  },
  module: {
    rules: [
      {
        loader: 'ts-loader',
        test: /\.ts$/,
        exclude: [
          /node_modules/,
        ],
        options: {
          configFile: 'tsconfig.server.json',
        },
      },
    ],
  },
  resolve: {
    extensions: [ '.ts' ],
  },
});
