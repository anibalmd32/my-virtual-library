import Controller from '../../server/controller.js'
import BooksServices from './service.js'

const service = new BooksServices()

class BooksController extends Controller {
  async getAll () {
    try {
      const genre = this.req.query.genre
      const data = await service.getAllBooks(genre)
      this._goodResponse(data, 'books')
    } catch (error) {
      this._badResponse(error)
    }
  }

  async createOne () {
    try {
      const data = await service.createOneBook(this.req.body)
      this._goodResponse(data, 'new book')
    } catch (error) {
      this._badResponse(error)
    }
  }

  async updateOne () {
    try {
      const data = await service.updateBookData(
        this.req.query.bookId,
        this.req.body
      )
      this._goodResponse(data, 'updated book')
    } catch (error) {
      this._badResponse(error)
    }
  }

  async deleteOne () {
    try {
      const data = await service.deleteOneBook(this.req.query.bookId)

      this._goodResponse(data, 'book deleted')
    } catch (error) {
      this._badResponse(error)
    }
  }
}

export default BooksController
