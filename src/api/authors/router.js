import AuthorsController from './controller.js'
import API from '../../server/api.js'

async function authorsRouter (req, res) {
  const authorsAPI = new API(req)
  const controller = new AuthorsController(req, res)

  await authorsAPI.get('/authors', async () => await controller.getAll())
}

export default authorsRouter
