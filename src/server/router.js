import fs from 'node:fs/promises'
import path from 'node:path'
import url, { URL } from 'node:url'

class Router {
  constructor (req, res) {
    this.req = req
    this.res = res
    this.mimeTypes = {
      html: 'text/html',
      css: 'text/css',
      js: 'text/javascript',
      png: 'image/png',
      json: 'application/json'
    }
  }

  async createRouter () {
    this.req.body = await this.createBody()
    this.req.query = this.createQuries()

    await this.getApiModules()
    await this.getClientModules()
  }

  async getApiModules () {
    const apiPath = path.join(process.cwd(), 'src', 'api')
    const apiModules = await fs.readdir(apiPath)

    this.setHeader(this.mimeTypes.json)

    for (const module of apiModules) {
      try {
        const moduleRouterPath = path.join(apiPath, module, 'router.js')
        const moduleRouterUrl = url.pathToFileURL(moduleRouterPath).href

        const { default: moduleRouter } = await import(moduleRouterUrl)

        if (!moduleRouter) throw new Error(`Default export router not found in: ${moduleRouterUrl}`)

        await moduleRouter(this.req, this.res)
      } catch (error) {
        throw new Error(`Error importing router for module: ${module}. ${error}`)
      }
    }
  }

  async getClientModules () {
    const clientPath = path.join(process.cwd(), 'src', 'pages')
    const clientModules = await fs.readdir(clientPath)

    for (const module of clientModules) {
      try {
        const moduleFiles = await fs.readdir(path.join(clientPath, module))

        if (!moduleFiles.length) {
          this.res.statusCode = 404
          this.res.end(JSON.stringify({
            code: 404,
            title: 'Not found',
            message: 'Bad request'
          }))
        }

        for (const file of moduleFiles) {
          const filePath = path.join(clientPath, module, file)

          if (this.req.url === `/${module}/${file}`) {
            const fileContent = await fs.readFile(filePath, 'utf-8')
            const fileExtension = path.extname(file)
            const contentType = this.mimeTypes[fileExtension.slice(1)]

            this.setHeader(contentType)
            this.res.end(fileContent)
          }
        }
      } catch (error) {
        throw new Error(`Error importing client module for: ${module}. ${error}`)
      }
    }
  }

  createQuries () {
    const requestUrl = new URL(this.req.url, `http://${this.req.headers.host}`)
    this.req.url = requestUrl.pathname
    return Object.fromEntries(requestUrl.searchParams)
  }

  createBody () {
    return new Promise((resolve, reject) => {
      let body = []
      const Methods = ['GET', 'POST', 'PUT', 'DELETE']

      if (Methods.includes(this.req.method)) {
        this.req
          .on('error', err => reject(err))
          .on('data', chuck => {
            chuck && body.push(chuck)
          })
          .on('end', () => {
            body = Buffer.concat(body).toString()
            body ? resolve(JSON.parse(body)) : resolve(null)
          })
      } else {
        resolve(null)
      }
    })
  }

  setHeader (contentType) {
    this.res.setHeader('Content-Type', contentType)
  }
}

export default Router
