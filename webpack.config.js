const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');


let fileName = process.env.npm_config_NAME
let type = process.env.npm_config_TYPE
module.exports = {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, 'output')
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, `src/template/model${type ? ('_' + type) : ''}.js`),
            to: path.resolve(__dirname, `output/models/${fileName.toLocaleLowerCase()}.js`),
            transform: function (content, path) {
                let contentStr = content.toString()
                return contentStr.replace(/TemplateManager/g, fileName).replace(/templatemanager/g, fileName.toLocaleLowerCase())
            },
            toType: 'template',
        }, {
            from: path.resolve(__dirname, `src/template/page${type ? ('_' + type) : ''}.js`),
            to: path.resolve(__dirname, `output/${fileName}.js`),
            transform: function (content, path) {
                let contentStr = content.toString()
                return contentStr.replace(/TemplateManager/g, fileName).replace(/templatemanager/g, fileName.toLocaleLowerCase())
            },
            toType: 'template',
        }]),

    ]
}