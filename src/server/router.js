import authorsRouter from '../modules/authors/routes.js'

async function router (req, res) {
  await authorsRouter(req, res)
}

export default router
