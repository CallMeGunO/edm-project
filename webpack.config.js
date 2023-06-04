/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, options) => {
    const getEnv = () => {
        const envPath = options.mode === 'development' ? './.env.development' : './.env.production'
        return new Dotenv({ path: envPath })
    }

    return {
        context: path.resolve(__dirname, './src'),
        entry: './index.tsx',
        devtool: options.mode === 'development' ? 'inline-source-map' : false,
        output: {
            filename: 'edmpage.js',
            path: path.resolve(__dirname, './dist'),
        },
        resolve: {
            modules: [path.resolve(__dirname, './src'), 'node_modules'],
            extensions: ['.tsx', '.ts', '.js', '.jsx', '.css'],
        },
        plugins: [
            getEnv(),
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, 'public', 'index.html'),
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.(ts|js)x?$/,
                    exclude: /node_modules/,
                    use:
                        options.mode === 'development'
                            ? {
                                  loader: 'ts-loader',
                              }
                            : {
                                  loader: 'babel-loader',
                                  options: {
                                      presets: [
                                          [
                                              '@babel/preset-env',
                                              {
                                                  useBuiltIns: 'usage',
                                                  corejs: '3.25',
                                                  targets: '> 0.2%, not dead',
                                              },
                                          ],
                                          '@babel/preset-react',
                                          '@babel/preset-typescript',
                                      ],
                                  },
                              },
                },
                {
                    test: /\.css$/i,
                    exclude: [/node_modules/, /StaticStyles/],
                    use: [
                        {
                            loader: 'style-loader',
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    localIdentName: '[local]-[hash:base64:5]',
                                    exportLocalsConvention: 'camelCase',
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    include: [/node_modules/, /StaticStyles/],
                    use: ['style-loader', 'css-loader'],
                },
            ],
        },
        performance: {
            hints: false,
            maxEntrypointSize: 512000,
            maxAssetSize: 512000,
        },
    }
}
