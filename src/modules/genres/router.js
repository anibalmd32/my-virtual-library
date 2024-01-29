import GenresController from './controller.js'
import API from '../../server/api.js'

async function genresRouter (req, res) {
  const baseUrl = '/genres'
  const genresAPI = new API(req)
  const controller = new GenresController(req, res)

  await genresAPI.get(baseUrl, async () => {
    await controller.getAll()
  })

  await genresAPI.post(baseUrl, async () => {
    await controller.createOne()
  })
}

export default genresRouter
