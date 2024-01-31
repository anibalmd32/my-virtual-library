import AuthorsServices from './service.js'
import Controller from '../../server/controller.js'

const service = new AuthorsServices()

class AuthorsController extends Controller {
  async getAll () {
    try {
      const allAuthors = await service.getAllAuthors()
      this._goodResponse(allAuthors, 'authors')
    } catch (error) {
      this._badResponse(error)
    }
  }
}

export default AuthorsController
