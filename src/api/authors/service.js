import database from '../../database/connection.js'

class AuthorsServices {
  async getAllAuthors (authorName) {
    let query = 'SELECT * FROM authors'
    const queryParams = []

    if (authorName) {
      query += ' WHERE name LIKE ?'
      queryParams.push(`%${authorName}%`)
    }

    const [data] = await database.query(query, queryParams)

    return data
  }

  async createAuthor (authorData) {
    const { name, biography } = authorData

    await database.execute(
      'INSERT INTO authors(author_id, name, biography) VALUES (UUID(), ?, ?)',
      [name, biography || null]
    )
  }

  async updateAuthor (authorId, authorData) {
    let query = 'UPDATE authors SET '
    const queryParams = []

    for (const key in authorData) {
      query += `${key} = ?, `
      queryParams.push(authorData[key])
    }

    query = query.slice(0, -2)
    query += ' WHERE author_id = ?'
    queryParams.push(authorId)

    const [data] = await database.query(query, queryParams)

    return data
  }

  async deleteAuthor (authorId) {
    await database.execute('DELETE FROM authors WHERE author_id = ?', [authorId])
  }
}

export default AuthorsServices
