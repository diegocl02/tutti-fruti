var webpack = require('webpack');
var path = require('path');

var BUILD_DIR = path.resolve(__dirname, 'dist/');
var APP_DIR = path.resolve(__dirname, 'src');

module.exports = {
    entry: './src/index.js',
    output: {
        path: BUILD_DIR,
        filename: 'bundle.js',
    },
    resolve: {
        extensions: ['.js', '.json']
    },
    node: {
        console: false,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                include: APP_DIR,
                loader: 'babel-loader',
                query:
                    {
                        presets: ['@babel/react'],
                    }
            },
            { test: /\.css$/, loader: "style-loader!css-loader" },
            {
                test: /\.html$/,
                exclude: /node_modules/,
                loader: 'html-loader'
            },
            {
                test: /\.(ttf|eot|svg)(\?[\s\S]+)?$/,
                use: 'file-loader'
            },
        ]
    }
};
