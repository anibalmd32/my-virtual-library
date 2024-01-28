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
}

export default GenresController
