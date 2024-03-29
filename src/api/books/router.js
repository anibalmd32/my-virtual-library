import API from '../../server/api.js'
import BooksController from './controller.js'

async function booksRouter (req, res) {
  const baseUrl = '/api/books'
  const booksAPI = new API(req)
  const constroller = new BooksController(req, res)

  await booksAPI.get(baseUrl, async () => {
    await constroller.getAll()
  })

  await booksAPI.post(baseUrl, async () => {
    await constroller.createOne()
  })

  await booksAPI.put(baseUrl, async () => {
    await constroller.updateOne()
  })

  await booksAPI.delete(baseUrl, async () => {
    await constroller.deleteOne()
  })
}

export default booksRouter
