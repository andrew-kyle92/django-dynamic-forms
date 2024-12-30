const path = require("path");

module.exports = {
    mode: "development",
    entry: {
        form_builder: ["./src/css/styles.css", "./src/js/main.js",],
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "../js"),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.css/i,
                use: ["style-loader", "css-loader"],
            },
        ],
    },
    watch: true,
}