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

    const dataToReturn = await Promise.all(bookData.map(async book => {
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
        genres: genresName.map(genre => genre.genresname)
      }
    }))

    return dataToReturn
  }

  async createOneBook (bookData) {
    const {
      title,
      description,
      publicationDate,
      coverUrl,
      author,
      genres
    } = bookData

    const authorData = await authorsOrm.selectData({
      select: ['author_id'],
      where: {
        name: author
      }
    })

    let authorId

    if (!authorData.length) {
      const newAuthor = await authorsOrm.insert({
        data: {
          author_id: randomUUID(),
          name: author
        }
      })

      authorId = newAuthor.author_id
    } else {
      authorId = authorData[0].authorid
    }

    const newBook = await booksOrm.insert({
      data: {
        book_id: randomUUID(),
        title,
        publication_date: publicationDate,
        cover_url: coverUrl,
        description,
        author_id: authorId
      }
    })

    const bookId = newBook.book_id

    for (const genre of genres) {
      const genreData = await genresOrm.selectData({
        select: ['genre_id'],
        where: {
          name: genre
        }
      })

      let genreId

      if (!genreData.length) {
        const newGenre = await genresOrm.insert({
          data: {
            genre_id: randomUUID(),
            name: genre
          }
        })

        genreId = newGenre.genre_id
      } else {
        genreId = genreData[0].genreid
      }

      await bookGenresOrm.insert({
        data: {
          book_id: bookId,
          genre_id: genreId
        }
      })
    }

    return newBook
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
      const [data] = await database.execute(`
        SELECT
          genre_id
        FROM
          genres
        WHERE
          name = ?
      `, [bookData.genre])

      // ? If dosent exist, create it
      if (!data.length) {
        await database.execute(`
          INSERT INTO
            genres(genre_id, name)
          VALUES
            (UUID(), ?)
        `, [bookData.genre])
      }

      // ? Update the relation between the book and the genre
      await database.execute(`
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
      `, [bookData.genre, bookId])
    }
  }
}

export default BooksServices
