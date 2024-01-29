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

  await genresAPI.put(baseUrl, async () => {
    await controller.updateOne()
  })

  await genresAPI.delete(baseUrl, async () => {
    await controller.deleteOne()
  })
}

export default genresRouter
