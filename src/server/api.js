class API {
  constructor (baseUrl) {
    this.baseUrl = `/${baseUrl}`
  }

  getAll () {
    const method = 'GET'
    const endpoint = this.baseUrl

    return method && endpoint
  }
}

export default API
