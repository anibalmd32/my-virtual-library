import AuthorsServices from './service.js'

const service = new AuthorsServices()

class AuthorsController {
  constructor (req, res) {
    this.req = req
    this.res = res
  }

  async getAll () {
    try {
      const allAuthors = await service.getAllAuthors()
      this._goodResponse(allAuthors)
    } catch (error) {
      this._badResponse(error)
    }
  }

  _goodResponse (data) {
    this.res.statusCode = 200
    this.res.end(data)
  }

  _badResponse (err) {
    this.res.statusCode = 400
    this.res.end(JSON.stringify({
      message: 'bad request',
      err
    }))
  }
}

export default AuthorsController
