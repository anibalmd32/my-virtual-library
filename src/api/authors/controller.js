import AuthorsServices from './service.js'
import Controller from '../../server/controller.js'

const service = new AuthorsServices()

class AuthorsController extends Controller {
  async getAll () {
    try {
      const allAuthors = await service.getAllAuthors(this.req.query.authorName)
      this._goodResponse(allAuthors, 'authors')
    } catch (error) {
      this._badResponse(error)
    }
  }

  async createOne () {
    try {
      const data = await service.createAuthor(this.req.body)
      this._goodResponse(data, 'new author')
    } catch (error) {
      this._badResponse(error)
    }
  }

  async updateOne () {
    try {
      const data = await service.updateAuthor(
        this.req.query.authorId,
        this.req.body
      )
      this._goodResponse(data, 'updated author')
    } catch (error) {
      this._badResponse(error)
    }
  }

  async deleteOne () {
    try {
      const data = await service.deleteAuthor(this.req.query.authorId)
      this._goodResponse(data, 'author deleted')
    } catch (error) {
      this._badResponse(error)
    }
  }
}

export default AuthorsController
