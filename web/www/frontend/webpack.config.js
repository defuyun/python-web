const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PurifyCssPlugin = require('purifycss-webpack');
const ReactRootPlugin = require('html-webpack-root-plugin');
const UglifyJsPlugin = require('webpack-uglify-harmony-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path');
const glob = require('glob');
const webpack = require('webpack');

const workspace = path.join(__dirname, 'src');

module.exports = env => {
  env['BASE_URL'] = JSON.stringify((env.mode === 'development' ?  'http://localhost:8080' : ''));
  env['HOT'] = JSON.stringify(env.hot);

  const chunkhash = env.hot ? '[hash:5]' : '[chunkhash:5]';
  const contenthash = env.hot ? '[hash:5]' : '[contenthash:5]';

  let config = {
    mode : env.mode,
		
		devServer : {
			hot : env.hot ? true : false,
		},

    output : {
      filename : `[name].${chunkhash}.js`,
      chunkFilename :  `[name].${chunkhash}.js`,
    },

    entry : {
      app : [`${workspace}/index.js`],
    },

    module : {
      rules : [
        {
          test : /\.css$/,
					include : path.join(__dirname, 'src'),
          use : [
            env.hot ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader : "css-loader",
              options : {
								modules : true,
								localIdentName : 'whitelist[hash:base64:10]',
                sourceMap : true,
                importLoaders : 1,
              }
            },
            {
              loader : 'postcss-loader',
              options : {
								sourceMap : true,
								ident : 'postcss',
                plugins: [
                  require('autoprefixer'),
                  require('precss'),
                  require('postcss-calc'),
                ],
              }
            }
          ],
        },
				{
					test : /\.css$/,
					include : path.join(__dirname, 'node_modules'),
					use : [
						env.hot ? 'style-loader' : MiniCssExtractPlugin.loader,
						'css-loader?sourceMap=true'
					]
				},
        {
          test : /\.(png|jpg|gif|svg)$/i,
          use : {
            loader : 'url-loader',
            options : {
              limit : 8192,
              name : './images/[name].[hash:5].[ext]'
            }
          }
        },
        {
          test : /\.(ts|js|tsx|jsx)$/,
          exclude : /node_modules/,
          use : {
            loader : 'babel-loader',
            options : {
              presets : [
                ['@babel/preset-env', {targets: {'esmodules': true}}],
                ['@babel/preset-react', {development : env.mode === 'development'}],
              ],
              plugins : [
                '@babel/plugin-transform-runtime',
                '@babel/plugin-syntax-dynamic-import',
								['react-css-modules',{exclude : '/node_modules/', generateScopedName : 'whitelist[hash:base64:10]'}],
                'react-hot-loader/babel',
              ],
            }
          }
        },
        {
          test: /\.(ttf|eot|woff|woff2)$/,
          use: {
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]',
            }, 
          }
        }
      ]
    },

    optimization : {
      splitChunks : {
        chunks : 'initial',
      },

      minimizer : [
        new UglifyJsPlugin(),
        new OptimizeCssAssetsPlugin(),
      ],

      runtimeChunk : {
        name : 'manifest',
      }
    },

    plugins : [
      new HtmlWebpackPlugin({
        favicon : './images/favicon.ico'
      }),
      new ReactRootPlugin(),
      new MiniCssExtractPlugin({
        filename : `[name].${contenthash}.css`
      }),
      new webpack.DefinePlugin(env),
      new CleanWebpackPlugin(['dist']),
    ]
  }

  if (env.hot) {
		console.log('[HOT] pushing plugin');
    config.plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  return config;
}
