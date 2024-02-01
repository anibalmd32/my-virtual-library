import AuthorsController from './controller.js'
import API from '../../server/api.js'

async function authorsRouter (req, res) {
  const baseUrl = '/api/authors'
  const authorsAPI = new API(req)
  const controller = new AuthorsController(req, res)

  await authorsAPI.get(baseUrl, async () => await controller.getAll())
  await authorsAPI.post(baseUrl, async () => await controller.createOne())
  await authorsAPI.put(baseUrl, async () => await controller.updateOne())
  await authorsAPI.delete(baseUrl, async () => await controller.deleteOne())
}

export default authorsRouter
