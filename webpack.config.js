const path = require('path');

module.exports = {
    target: 'web',
    mode: 'development',
    entry: {
        'script.js': path.resolve(__dirname, 'src', 'main.ts')
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        pathinfo: false,
        filename: '[name]'
    },
    module: {
        rules: [
            { 
                test: /\.tsx?$/,
                exclude: /node_modules/, 
                use: {
                    loader: 'swc-loader',
                    options: {
                        jsc: {
                            parser: {
                                syntax: 'typescript'
                            }
                        }
                    }
                }
            }
        ]
    },
    optimization: {
        removeAvailableModules: false,
        removeEmptyChunks: false,
        splitChunks: false,
    },
    experiments: {
        asyncWebAssembly: true
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    watch: true
};