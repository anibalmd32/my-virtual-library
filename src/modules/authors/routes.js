import AuthorsController from './controller.js'
import API from '../../server/api.js'

async function authorsRouter (req, res) {
  const authorsAPI = new API('authors')
  const controller = new AuthorsController(req, res)

  authorsAPI.getAll() && await controller.getAll()
}

export default authorsRouter
