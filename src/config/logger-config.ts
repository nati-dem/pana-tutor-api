const path = require('path')
const rfs = require('rotating-file-stream')
const fs = require('fs')

export const rotatingAccessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
})

// create a write stream (in append mode)
export const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

