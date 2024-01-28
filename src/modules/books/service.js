import database from '../../database/connection.js'
import spErrors from '../../libs/spErrors.js'

class BooksServices {
  async getAllBooks (genre) {
    let query = 'SELECT * FROM book_data'
    const params = []

    if (genre) {
      query += ' WHERE genres LIKE ?'
      params.push('%' + genre + '%')
    }
    const [booksData] = await database.execute(query, params)

    return booksData
  }

  async createOneBook (bookData) {
    const { title, description, publicationDate, coverUrl, author, genres } = bookData

    await database.execute(`
      CALL AddBook(?, ?, ?, ?, ?, @res)
    `, [title, description, publicationDate, coverUrl, author])

    const bookCreatedRes = await database.execute('SELECT @res;')

    if (spErrors.includes(bookCreatedRes[0][0]['@res'])) {
      throw new Error(bookCreatedRes[0][0]['@res'])
    } else {
      const bookId = bookCreatedRes[0][0]['@res']

      for (const genre of genres) {
        await database.execute('CALL BookGenres(?, ?, @res)', [bookId, genre])
        const dbRes = await database.execute('SELECT @res;')

        if (spErrors.includes(dbRes[0][0]['@res'])) {
          throw new Error(dbRes[0][0]['@res'])
        }
      }
    }
  }

  async updateBookData (bookId, bookData) {
    let query = 'UPDATE books SET '
    const queryParams = []

    // ? Update book data
    for (const dataKey in bookData) {
      if (dataKey === 'author') {
        await database.execute(
          'CALL InsertAuthor(?, @res)',
          [bookData[dataKey]]
        )

        const authorInsertedRes = await database.execute('SELECT @res;')

        if (spErrors.includes(authorInsertedRes[0][0]['@res'])) {
          throw new Error(authorInsertedRes[0][0]['@res'])
        }

        query += 'author_id = (SELECT author_id FROM authors WHERE name = ?), '
        queryParams.push(bookData[dataKey])
      } else if (dataKey !== 'genres') {
        query += `${dataKey} = ?, `
        queryParams.push(bookData[dataKey])
      }
    }

    query = query.slice(0, -2)

    query += ' WHERE book_id = ?'
    queryParams.push(bookId)

    await database.execute(query, queryParams)

    // ? Update book - genres relation
    if (bookData.genres && bookData.genres.length) {
      await database.execute(
        'DELETE FROM book_genres WHERE book_id = ?',
        [bookId]
      )

      for (const genre of bookData.genres) {
        await database.execute('CALL BookGenres(?, ?, @res)', [bookId, genre])
        const dbRes = await database.execute('SELECT @res;')

        if (spErrors.includes(dbRes[0][0]['@res'])) {
          throw new Error(dbRes[0][0]['@res'])
        }
      }
    }
  }
}

export default BooksServices
