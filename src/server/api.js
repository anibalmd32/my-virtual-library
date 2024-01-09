class API {
  constructor (req) {
    this.req = req
    this.method = this.req.method
    this.url = this.req.url
  }

  async get (endpoint, controller) {
    if (this.method === 'GET' && this.url === endpoint) {
      await controller()
    }
  }

  async post (endpoint, controller) {
    if (this.method === 'POST' && this.url === endpoint) {
      await controller()
    }
  }

  async put (endpoint, controller) {
    if (this.method === 'PUT' && this.url === endpoint) {
      await controller()
    }
  }

  async patch (endpoint, controller) {
    if (this.method === 'PATCH' && this.url === endpoint) {
      await controller()
    }
  }

  async delete (endpoint, controller) {
    if (this.method === 'DELETE' && this.url === endpoint) {
      await controller()
    }
  }
}

export default API
