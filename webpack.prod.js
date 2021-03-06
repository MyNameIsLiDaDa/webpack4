'use strict';

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const cssPlugin = new OptimizeCSSAssetsWebpackPlugin({
    assetNameRegExp: /\.css$/g,
    cssProcessor: require('cssnano')
})
const htmlPlugs = new HtmlWebpackPlugin ({
    template: path.join(__dirname, './src/index.html'),
    filename: 'index_[contenthash:8].html',
    chunks: ['index'],
    inject: true,
    minify: {
        html5: true,
        collapseWhitespace: true,
        preserveLineBreaks: true,
        minifyCSS: true,
        minifyJS: true,
        removeComments: false
    }
})

const miniCss = new MiniCssExtractPlugin ({
    filename: '[name]_[contenthash:8].css'
})

const config = {
    entry: {
        index: './src/index.js',
        search: './src/search.js'
    },
    // entry: path.join(__dirname, './src/index.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name]_[chunkhash:6].js',
    },
    module: {
        rules: [
            { test: /\.txt$/, use: 'raw-loader' },
            { test: /\.js$/, use: 'babel-loader' },
            { 
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },

            { 
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ] 
            },

            { test: /\.(woff|woff2|eot|ttf)$/, use: 'file-loader' },
            // { test: /\.(png|jpg|gif|svg|JPG)$/, use: 'file-loader'},
            {
                test: /\.(png|jpg|gif|svg|JPG)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name]_[hash:6].[ext]'
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        htmlPlugs,
        miniCss,
        cssPlugin,
        new CleanWebpackPlugin()
    ],
    mode: 'production',
    // development
};
module.exports = config;