
const express = require('express')
const path = require('path')
const port = 8156
const app = express()

//if(process.env.NODE_ENV ==- 'production') {
    app.use(express.static(path.join(__dirname, '/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '/build/index.html'))
    })
//}

app.listen(port)
console.log('server started')
