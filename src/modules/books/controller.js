import Controller from '../../server/controller.js'
import BooksServices from './service.js'

const service = new BooksServices()

class BooksController extends Controller {
  async getAll () {
    try {
      const data = await service.getAllBooks()
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
}

export default BooksController