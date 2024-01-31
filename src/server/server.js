import http from 'node:http'
// import apiRouter from './apiRouter.js'
// import clientRouter from './clientRouter.js'
import Router from './router.js'

function server (serverConfig, corsConfig) {
  if (!serverConfig) {
    console.error('Server configuation no provide')
    return null
  }

  if (!corsConfig) {
    console.error('CORS configuration not provide')
    return null
  }

  http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', corsConfig.allowedUrls)
    res.setHeader('Access-Control-Allow-Methods', corsConfig.allowedMethods)
    res.setHeader('Access-Control-Allow-Headers', corsConfig.allowedHeaders)

    // res.setHeader('Content-type', 'application/json')

    const router = new Router(req, res)

    await router.createRouter()

    // req.url.includes('/api') ? await apiRouter(req, res) : await clientRouter(req, res)

    if (!res.writableEnded) {
      res.statusCode = 404
      res.end(JSON.stringify({
        code: 404,
        title: 'Not found',
        message: 'Bad request'
      }))
    }
  }).listen(serverConfig.PORT, serverConfig.serverCallback)
}

export default server
