import Controller from '../../server/controller.js'
import GenresService from './services.js'

const service = new GenresService()

class GenresController extends Controller {
  async getAll () {
    try {
      const data = await service.getGenres(this.req.query.genreName)
      this._goodResponse(data, 'genres')
    } catch (error) {
      this._badResponse(error)
    }
  }

  async createOne () {
    try {
      const data = await service.createGenre(this.req.body)
      this._goodResponse(data, 'genre')
    } catch (error) {
      this._badResponse(error)
    }
  }
}

export default GenresController
