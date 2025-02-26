const path = require("path");
const autoprefixer = require("autoprefixer");

module.exports = {
    mode: "production",
    entry: {
        form_builder: ["./src/css/styles.css", "./src/js/main.js", './src/js/dragAndDrop.js', './src/js/init_tinymce.js'],
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "../js"),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.(scss)$/,
                use: [
                    {
                        // Adds CSS to the DOM by injecting a `<style>` tag
                        loader: 'style-loader'
                    },
                    {
                        // Interprets `@import` and `url()` like `import/require()` and will resolve them
                        loader: 'css-loader'
                    },
                    {
                        // Loader for webpack to process CSS with PostCSS
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                    autoprefixer,
                                ]
                            }
                        }
                    },
                    {
                        // Loads a SASS/SCSS file and compiles it to CSS
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    },
    watch: true,
}