import API from '../../server/api.js'
async function booksRouter (req, res) {
  const booksAPI = new API(req)

  booksAPI.get('/books', () => {
    res.end(JSON.stringify({ message: 'obteniendo libros' }))
  })
}

export default booksRouter
