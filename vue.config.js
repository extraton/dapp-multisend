const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: {
    plugins: [
      new CopyPlugin({
        patterns: [
          {from: './node_modules/@tonclient/lib-web/tonclient.wasm', to: 'tonclient_1.5.3.wasm'},
        ],
      }),
    ],
  },
}
