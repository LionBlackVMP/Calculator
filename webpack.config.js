import path from "path";
import { fileURLToPath } from "url";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default () => {
  return {
    entry: {
      entry: "./src/index.js",
    },

    devtool: "source-map",
    output: {
      path: path.join(__dirname, "./dist"),
      filename: "[name].[contenthash].js",
      assetModuleFilename: "assets/[hash][ext][query]",
      clean: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        filename: "index.html",
      }),
      new CleanWebpackPlugin(),
    ],
    module: {
      rules: [
        {
          test: /\.(jpg|png|svg)$/,
          type: "asset/resource",
        },
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "postcss-loader",
              options: {
                postcssOptions: {
                  plugins: [
                    [
                      "postcss-preset-env",
                      {
                        browsers: "last 2 versions",
                      },
                    ],
                  ],
                },
              },
            },
            "sass-loader",
          ],
        },
      ],
    },
  };
};
