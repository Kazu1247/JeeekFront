module.exports = {
  devtool: 'source-map',
  // NODE_ENVにproductionを設定すると最適化される状態で、
  // developmentに設定するとソースマップ有効でJSファイルが出力される。
  mode: process.env.NODE_ENV || 'development',

  entry: './src/App.tsx',
  output: {
    path: `${__dirname}/public`,
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        // 拡張子.tsもしくは.tsxの場合
        test: /\.tsx?$/,
        // 静的チェックからのコンパイル
        use: [
          // 下から順に処理される
          { loader: 'babel-loader' },
          { loader: 'ts-loader' },
        ],
        exclude: /node_modules/
      },
      {
        // 拡張子.jsの場合(ErrorBoundaryのため)
        test: /\.js?$/,
        use: [
          { loader: 'babel-loader' },
        ],
        exclude: /node_modules/
      },
    ]
  },
  // import文で.tsや.tsxファイルを解決するため
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  },
  devServer: {
    contentBase: `${__dirname}/public`,
    watchContentBase: true,
    historyApiFallback: true, // 開発時はroot以外のurlも直接指定したいので
    inline: true,
    hot: true,
    open: true,
    port: 5000,
    overlay: {
      warnings: true,
      errors: true
    }
  }
}
