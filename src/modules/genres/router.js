import GenresController from './controller.js'
import API from '../../server/api.js'

async function genresRouter (req, res) {
  const genresAPI = new API(req)
  const controller = new GenresController(req, res)

  await genresAPI.get('/genres', async () => {
    await controller.getAll()
  })

  await genresAPI.post('/genres', () => {
    console.log(req.body)
    res.end(JSON.stringify({ message: 'creado...', body: req.body }))
  })
}

export default genresRouter
