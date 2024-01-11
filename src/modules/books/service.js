import database from '../../database/connection.js'

class BooksServices {
  async getAllBooks () {
    // ? Busca y devuelve los libros con la información del mismo, el nombre del autor y el género al que pertenecen
    const [data] = await database.execute(`
      SELECT
        b.book_id AS id,
        b.title,
        b.description,
        b.publication_date AS publicationDate,
        b.cover_url AS coverUrl,
        a.name AS author,
        g.name AS genre
      FROM
        books b
      INNER JOIN
        authors a ON b.author_id = a.author_id
      INNER JOIN
        book_genres bg ON b.book_id = bg.book_id
      INNER JOIN
        genres g ON bg.genre_id = g.genre_id
    `)

    return data
  }

  async createOneBook (booksData) {
    const {
      title,
      description,
      publicationDate,
      coverUrl,
      author,
      genre
    } = booksData

    // ? Verifica que el autor exista
    const [authorData] = await database.execute(`
      SELECT
        author_id
      FROM
        authors
      WHERE
        name = ?
    `, [author])

    // ? Si el autor no existe, lo crea
    if (!authorData.length) {
      await database.execute(`
        INSERT INTO
          authors(author_id, name)
        VALUES
          (UUID(), ?)
      `, [author])
    }

    // ? Verifica que el genero exista
    const [genreData] = await database.execute(`
      SELECT
        genre_id
      FROM
        genres
      WHERE
        name = ?   
    `, [genre])

    // ? Si el genero no existe, lo crea
    if (!genreData.length) {
      await database.execute(`
        INSERT INTO
          genres(genre_id, name)
        VALUES
          (UUID(), ?)
      `, [genre])
    }

    // ? Inserta un nuevo libro y crea la relación con su autor
    await database.execute(`
      INSERT INTO
        books(book_id, title, description, publication_date, cover_url, author_id)
      VALUES
        (UUID(), ?, ?, ?, ?, (
          SELECT
            author_id
          FROM
            authors
          WHERE
            name = ?
        ))
    `, [title, description, publicationDate, coverUrl, author])

    // ? Crea la realación del libro con el género
    await database.execute(`
      INSERT INTO
        book_genres(book_id, genre_id)
      VALUES
          (
            (
              SELECT
                book_id
              FROM
                books
              WHERE
                title = ?
            ),
            (
              SELECT
                genre_id
              FROM
                genres
              WHERE
                name = ?
            )
          )

    `, [title, genre])
  }
}

export default BooksServices
