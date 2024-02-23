const { join } = require('path');

const { NxWebpackPlugin } = require('@nx/webpack');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apps/mail-app'),
  },
  plugins: [
    new NxWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      sourceMap: true,
    }),
  ],
};
