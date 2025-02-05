const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
    popup: "./src/popup/popup.tsx",
    background: "./src/background/background.ts",
    content: "./src/content/content.tsx",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader", // Add PostCSS loader
            options: {
              postcssOptions: {
                plugins: [
                  require("tailwindcss"), // Add Tailwind CSS
                  require("autoprefixer"), // Add Autoprefixer
                ],
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "public/manifest.json", to: "manifest.json" },
        { from: "public/icon.png", to: "icon.png" },
        { from: "public/popup.html", to: "popup.html" },
        { from: "src/styles/index.css", to: "popup.css" },
      ],
    }),
  ],
  mode: "development",
};
