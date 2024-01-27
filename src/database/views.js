import database from './connection.js'

try {
  try {
    await database.execute(`
        CREATE VIEW IF NOT EXISTS book_data AS
        SELECT
            b.title AS title,
            b.description AS description,
            b.publication_date AS publication,
            b.cover_url AS cover,
            a.name AS author,
            GROUP_CONCAT(g.name SEPARATOR ', ') AS genres
        FROM books AS b
        INNER JOIN authors AS a ON a.author_id = b.author_id
        INNER JOIN book_genres AS bg ON bg.book_id = b.book_id
        INNER JOIN genres AS g ON g.genre_id = bg.genre_id
        GROUP BY b.title;
      `)
  } catch (error) {
    throw new Error(`Error to create book_data view: ${error}`)
  }

  console.info('Data views has been created')
} catch (error) {
  console.info('Error executing views', error)
} finally {
  process.exit(1)
}
