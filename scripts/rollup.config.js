const alias = require('rollup-plugin-alias');
const eslintPlugin = require('rollup-plugin-eslint');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const babel = require('rollup-plugin-babel');
const replace = require('rollup-plugin-replace');

const servePlugin = require('rollup-plugin-serve');
const livereloadPlugin = require('rollup-plugin-livereload')

const filesize = require('rollup-plugin-filesize');
const uglify = require('rollup-plugin-uglify');
const { minify } = require('uglify-es');

const isDev = process.env.NODE_ENV === 'development';

let plugins = [
    alias({
        resolve: ['.js']
    }),
    replace({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    resolve(),
    commonjs({
        // non-CommonJS modules will be ignored, but you can also
        // specifically include/exclude files
        include: 'node_modules/**'
    })
]

module.exports = (config = {}) => {
    const { eslint, serve = {}, livereload = {} } = config
    if (eslint) {
        plugins.push(eslintPlugin(eslint))
    }
    plugins.push(babel({
        runtimeHelpers: true,
        exclude: 'node_modules/**' // only transpile our source code
    }))

    if (isDev) {
        plugins = plugins.concat([
            servePlugin(Object.assign({
                contentBase: './',   // 启动文件夹;
                host: '127.0.0.1',      // 设置服务器;
                port: 8080
            }, serve)),
            livereloadPlugin({
                watch: 'src/'     // 监听文件夹;
            }, livereload)
        ])
    } else {
        plugins = plugins.concat([uglify(
            {
                compress: {
                    drop_console: true
                }
            },
            minify
        ),
        filesize()])
    }

    return {
        plugins
    }
}
