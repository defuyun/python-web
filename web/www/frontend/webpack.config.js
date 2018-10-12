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
	const chunkhash = env.hot === 'hot' ? '[hash:5]' : '[chunkhash:5]';
	const contenthash = env.hot === 'hot' ? '[hash:5]' : '[contenthash:5]';

  let config = {
    mode : env.mode,

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
					exclude : /node_modules/,
          use : [
						env.hot === 'hot' ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader : "css-loader",
              options : {
                // the importLoaders options tells us how many loaders after css-loader do we apply to @import css files
                // you have 2 files style.css, body.css and in style.css you import body.css
                // without importLoader option set, only style.css will be parsed by postcss-loader （or should I say postcss-loader does not
                // deal with import, leaves it alone and throws it into css-loader, css-loader sees the import and if importLoader is set, it will
                // ask postcss-loader to parse this import)
                importLoaders : 1,
                modules : true,
                localIdentName : 'whitelist[hash:base64:10]',
								sourceMap : true,
              }
            },
            {
              loader : 'postcss-loader',
              options : {
                plugins: () => ([
                  require('autoprefixer'),
                  require('precss'),
                  require('postcss-calc'),
                ]),
              }
            }
          ],
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
                // esmodule (I don't know what this is) is needed for transform runtime to compile,
                // or rather the compiled code from transform runtime is fed into preset env, and since transform
                // runtime uses this esmodule standard you need to set this option in order for preset env to understand the code
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
            loader: 'url-loader',
            options: {
							limit : 8192,
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
      new PurifyCssPlugin({
        paths : glob.sync(`${workspace}/**/*.js`, {nodir : true}),
        purifyOptions : {
          whitelist : ['*whitelist*'],
        },
      }),
      new webpack.DefinePlugin(env),
      new CleanWebpackPlugin(['dist']),
    ]
  }

	if (env.hot === 'hot') {
		config.plugins.push(new webpack.HotModuleReplacementPlugin());
	}

	return config;
}
