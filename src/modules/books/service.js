import { randomUUID } from 'node:crypto'
import database from '../../database/connection.js'
import ORM from '../../database/orm.js'

const booksOrm = new ORM('books')
const authorsOrm = new ORM('authors')
const genresOrm = new ORM('genres')
const bookGenresOrm = new ORM('book_genres')

class BooksServices {
  async getAllBooks (genre) {
    const bookData = await booksOrm.selectJoin({
      select: [
        'book_id',
        'title',
        'description',
        'publication_date',
        'cover_url',
        'authors.name'
      ],
      join: [
        {
          tables: ['authors'],
          on: 'author_id',
          value: 'author_id'
        }
      ]
    })

    const dataToReturn = await Promise.all(
      bookData.map(async (book) => {
        const genresName = await bookGenresOrm.selectJoin({
          select: ['genres.name'],
          join: [
            {
              tables: ['genres'],
              on: 'genre_id',
              value: 'genre_id'
            }
          ],
          where: {
            book_id: book.bookid
          }
        })

        return {
          id: book.bookid,
          title: book.title,
          description: book.description,
          publicationDate: book.publicationdate,
          coverUrl: book.coverurl,
          authorName: book.authorsname,
          genres: genresName.map((genre) => genre.genresname)
        }
      })
    )

    return dataToReturn
  }

  async createOneBook (bookData) {
    const { title, description, publicationDate, coverUrl, author, genres } = bookData
    const dbResErrors = ['Rolled Back!', 'Book already exists']

    await database.execute(`
      CALL AddBook(?, ?, ?, ?, ?, @res)
    `, [title, description, publicationDate, coverUrl, author])

    const bookCreateRes = await database.execute('SELECT @res;')

    if (dbResErrors.includes(bookCreateRes[0][0]['@res'])) {
      throw new Error(bookCreateRes[0][0]['@res'])
    } else {
      const bookId = bookCreateRes[0][0]['@res']

      for (const genre of genres) {
        await database.execute('CALL BookGenres(?, ?, @res)', [bookId, genre])
        const dbRes = await database.execute('SELECT @res;')

        if (dbResErrors.includes(dbRes[0][0]['@res'])) {
          throw new Error(dbRes[0][0]['@res'])
        }
      }
    }
  }

  async updateBookData (bookId, bookData) {
    let query = 'UPDATE books SET '
    const queryParams = []

    for (const dataKey in bookData) {
      if (dataKey === 'author') {
        query += 'author_id = (SELECT author_id FROM authors WHERE name = ?), '
        queryParams.push(bookData[dataKey])
      } else if (dataKey !== 'genre') {
        query += `${dataKey} = ?, `
        queryParams.push(bookData[dataKey])
      }
    }

    query = query.slice(0, -2)

    query += ' WHERE book_id = ?'
    queryParams.push(bookId)

    await database.execute(query, queryParams)

    if (bookData.genre) {
      // ? Verify that the genre exists
      const [data] = await database.execute(
        `
        SELECT
          genre_id
        FROM
          genres
        WHERE
          name = ?
      `,
        [bookData.genre]
      )

      // ? If dosent exist, create it
      if (!data.length) {
        await database.execute(
          `
          INSERT INTO
            genres(genre_id, name)
          VALUES
            (UUID(), ?)
        `,
          [bookData.genre]
        )
      }

      // ? Update the relation between the book and the genre
      await database.execute(
        `
        UPDATE
          book_genres
        SET
          genre_id = (
            SELECT
              genre_id
            FROM
              genres
            WHERE
              name = ?
          )
        WHERE
          book_id = ?
      `,
        [bookData.genre, bookId]
      )
    }
  }
}

export default BooksServices
