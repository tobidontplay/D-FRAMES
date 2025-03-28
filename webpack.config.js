const path = require('path');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  tailwindcss,
                  autoprefixer
                ]
              }
            }
          }
        ]
      }
    ]
  },
  devServer: {
    historyApiFallback: true,
    port: 3001,
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:5001',
        secure: false,
        changeOrigin: true
      }
    ],
    static: {
      directory: path.join(__dirname, 'public')
    },
    hot: true
  }
};