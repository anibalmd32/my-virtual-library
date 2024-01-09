class Controller {
  constructor (res) {
    this.res = res
  }

  _goodResponse (data, resource) {
    const res = JSON.stringify({
      message: 'success',
      resource: resource || '',
      data
    })

    this.res.statusCode = 200
    this.res.end(res)
  }

  _badResponse (err) {
    this.res.statusCode = 400
    this.res.end(JSON.stringify({
      message: 'bad request',
      err
    }))
  }
}

export default Controller
