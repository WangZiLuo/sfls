
var webpack = require('webpack')
var path = require('path')
var fs = require('fs')
var glob = require("glob")

var debug = process.argv.indexOf('-d') !== -1 

var plugins = [
    new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: debug,
        },
        output: {
            comments: false,
        },
    })
]

var globmaths = glob.sync("./src/pages/*.js", {
    nodir: true,
})

var entry = globmaths.reduce(function(obj, file) {
    var filename = path.basename(file).split(".")[0]
    obj[filename] = ["babel-polyfill", file]
    return obj
}, {})

module.exports = {
    entry: entry,
    output: {
        path: `./lib`,
        filename: "[name].js",
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        }, ]
    },
    plugins: plugins,
};
