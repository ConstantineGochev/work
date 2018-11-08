const path = require('path')

module.exports = {
    mode:'production',
    entry: "./express-server.js",
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: "build.js",
        library: 'lib'
    },
          externals: {
            uws: "uws"
        },
}