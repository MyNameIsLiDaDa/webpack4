'use strict';

const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const htmlPlugs = new HtmlWebpackPlugin({
    template: path.join(__dirname, './src/index.html'),
    filename: 'index.html'
})
const hotServer = new webpack.HotModuleReplacementPlugin()
const config = {
    // entry: {
    //     index: './src/index.js',
    // },
    entry: path.join(__dirname, './src/index.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'out.js',
    },
    module: {
        rules: [
            { test: /\.txt$/, use: 'raw-loader' },
            { test: /\.js$/, use: 'babel-loader' },
            { test: /\.css$/, use: ['style-loader','css-loader'] },

            { test: /\.less$/, use: ['style-loader', 'css-loader', 'less-loader'] },

            { test: /\.(woff|woff2|eot|ttf)$/, use: 'file-loader' },
            // { test: /\.(png|jpg|gif|svg|JPG)$/, use: 'file-loader'},
            {
                test: /\.(png|jpg|gif|svg|JPG)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10240
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        htmlPlugs,
        hotServer
    ],
    devServer: {
        contentBase: path.join(__dirname, './dist'),
        hot: true
    },
    mode: 'development',
    // production
};
module.exports = config;