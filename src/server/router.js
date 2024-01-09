import url, { URL } from 'node:url'
import fs from 'node:fs/promises'
import path from 'node:path'
import createBody from '../libs/createBody.js'

async function router (req, res) {
  const requestUrl = new URL(req.url, `http://${req.headers.host}`)

  req.body = await createBody(req)
  req.url = requestUrl.pathname
  req.query = Object.fromEntries(requestUrl.searchParams)

  const modulesPath = path.join(process.cwd(), 'src', 'modules')
  const modules = await fs.readdir(modulesPath)

  for (const module of modules) {
    const modulePath = path.join(modulesPath, module, 'router.js')
    const routerFileUrl = url.pathToFileURL(modulePath).href

    try {
      const { default: moduleRouter } = await import(routerFileUrl)

      if (!moduleRouter) throw new Error('Default export router not found in:', requestUrl)

      await moduleRouter(req, res)
    } catch (error) {
      console.error(error.message)
    }
  }
}

export default router
