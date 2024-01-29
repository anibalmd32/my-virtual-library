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

  async updateOne () {
    try {
      const data = await service.updateOneGenre(
        this.req.body,
        this.req.query.genreId
      )

      this._goodResponse(data, 'update genre')
    } catch (error) {
      this._badResponse(error)
    }
  }

  async deleteOne () {
    try {
      const data = await service.deleteOneGenre(this.req.query.genreId)
      this._goodResponse(data, 'delete genre')
    } catch (error) {
      this._badResponse(error)
    }
  }
}

export default GenresController
