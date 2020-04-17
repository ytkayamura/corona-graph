module.exports = (env, argv) => ({
  mode: argv.mode,
  entry: './src/client/main.tsx',
  output: {
    path: `${__dirname}/dist/public`,
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      }
    ]
  },
  resolve: {
    extensions: [
      '.ts', '.tsx', '.js', '.json'
    ],
  },
  devServer: {
    contentBase: `${__dirname}/dist/public`,
    proxy: [{
      context: '/api',
      target: 'http://localhost:8081',
    }],
  },
});
