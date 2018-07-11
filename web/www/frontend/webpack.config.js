const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMd5Hash = require('webpack-md5-hash');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// env is undefined unless you set the value manually on the command line,
// in my configure I'd have to set this in the package.json script
module.exports = (env, argv) => {
	return {
		entry: {
			main : './src/index.js'
		},
		output : {
			path : path.resolve(__dirname, `dist/${argv.mode}`),
			filename : '[name].[chunkhash].js'
		},
		stats : {
			children : false
		},
		module : {
			rules : [
				{
					test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					use : {
						loader: 'babel-loader'
					}
				},
				{
					test: /\.less$/,
					use : [
						'style-loader',
						MiniCssExtractPlugin.loader,
						'css-loader',
						{
							loader : 'less-loader',
							options : {
								javascriptEnabled : true
							}
						}
					]
				},
				{
					test: /\.jpe?g$|\.gif$|\.ico$|\.png$|\.svg$/,
					use: 'file-loader?name=[name].[ext]?[hash]'
				},
				{
					test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
					loader: 'url-loader?limit=10000&mimetype=application/font-woff'
				},
				
				{
					test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
					loader: 'file-loader'
				},
				{
					test: /\.otf(\?.*)?$/,
					use: 'file-loader?name=/fonts/[name].  [ext]&mimetype=application/font-otf'
				}
			]	
		},
		resolve : {
			alias : {
				common : path.resolve('src/js/common'),
				components : path.resolve('src/js/components'),
				contents : path.resolve('src/js/contents')
			}
		},
		plugins: [
			new CleanWebpackPlugin('dist', {}),
			new MiniCssExtractPlugin({
				filename: '[name].[contenthash].css',
			}),
			new HtmlWebpackPlugin({
				inject: false,
				hash: true,
				template: './src/index.html',
				filename: 'index.html',
				favicon: 'src/images/favicon.ico'
			}),
			new WebpackMd5Hash()
		]
	}
}