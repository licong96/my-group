const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

// 判断当前是否处于开发状态下
var __DEV__ = process.env.NODE_ENV;
const devTool = __DEV__ ? 'inline-source-map' : 'cheap-module-source-map';

module.exports = {
  entry: {
    'index': './index.js',
  },
  output: {
    filename: 'js/[name].js',
    publicPath: '/',       // 模板、样式、脚本、图片等资源对应的server上的路径
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            }, {
              loader: 'postcss-loader'
            }, {
              loader: 'sass-loader'
            }
          ]
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                minimize: true
              }
            }
          ]
        })
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'image/[name].[hash:5].[ext]'
            }
          }
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'font/[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  node: {
    fs: 'empty'     // 避免错误信息
  },
  // 配置路径
  resolve: {
    alias: {
      node_modules: __dirname + '/node_modules'
    }
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new ExtractTextPlugin('css/bootstrap-material-design.css'),
    new HtmlWebpackPlugin(HtmlPlugin('首页', 'index', 'index')),
  ],
  // devtool: 'cheap-module-source-map',
  devtool: devTool,   // 跟进当前环境来设置模式
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    inline: true,
    quiet: true,    // 开启错误提示
    overlay: true,  // 将错误显示在html之上
    host: '192.168.0.201',
    // host: '192.168.25.206',
    port: 8080,
    historyApiFallback: true,
    proxy: {
      '/Handler': {
        target: 'http://t.vipfgj.com',       // 测试地址
        changeOrigin: true
      }
    }
  }
};

/**
 * html模板配置
 * @param {String} name 名称
 * @param {string} chunk 依赖
 * @returns {Object}
 */
function HtmlPlugin(title, name, chunk) {
  return {
    title: title,
    filename: name + '.html',
    template: './' + name + '.html',
    chunks: ['common', chunk],
    hash: true,
    cache: true,
    minify: {
      collapseWhitespace: __DEV__? false : true,
      conservativeCollapse: __DEV__? false : true,
      removeComments: __DEV__? false : true,
      removeEmptyAttributes: __DEV__? false : true,
      removeRedundantAttributes: __DEV__? false : true,
      // preserveLineBreaks: true,
      // minifyCSS: true,
    }
  }
}
