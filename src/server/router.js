import { URL } from 'node:url'
import createBody from '../libs/createBody.js'

// Modules
import authorsRouter from '../modules/authors/routes.js'
import genresRouter from '../modules/genres/router.js'

async function router (req, res) {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`)

  req.body = await createBody(req)
  req.url = requestUrl.pathname
  req.query = Object.fromEntries(requestUrl.searchParams)

  await authorsRouter(req, res)
  await genresRouter(req, res)
}

export default router
