import http from 'node:http'
import database from './database/connection.js'
import { PORT, URLsAllowed } from './config/server.js'

const server = http.createServer().listen(PORT, () => {
  console.info(`Server running on port ${PORT}`)
})

server.on('request', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', URLsAllowed)
  res.setHeader('Content-type', 'application/json')

  if (!res.writableEnded) {
    res.statusCode = 404
    res.end(JSON.stringify({
      code: 404,
      title: 'Not found',
      message: 'Bad request'
    }))
  }
})
