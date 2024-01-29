import database from '../../database/connection.js'
import spErrors from '../../libs/spErrors.js'

class GenresService {
  async getGenres (genreName) {
    let query = 'SELECT * FROM genres'
    const params = []

    if (genreName) {
      query += ' WHERE name LIKE ?'
      params.push(`%${genreName}%`)
    }

    const [data] = await database.execute(query, params)

    return data
  }

  async createGenre (genreData) {
    const { name, description } = genreData

    await database.execute(
      'CALL InsertGenre(?, ?, @res)',
      [name, description]
    )

    const genreInsertedRes = await database.execute('SELECT @res')

    if (spErrors.includes(genreInsertedRes[0][0]['@res'])) {
      throw new Error(genreInsertedRes[0][0]['@res'])
    }
  }

  async updateOneGenre (genreData, genreId) {
    let query = 'UPDATE genres SET '
    const params = []

    for (const genreProp in genreData) {
      query += `${genreProp} = ?, `
      params.push(genreData[genreProp])
    }

    query = query.slice(0, -2)
    query += ' WHERE genre_id = ?'
    params.push(genreId)

    await database.execute(query, params)
  }

  async deleteOneGenre (genreId) {
    await database.execute('DELETE FROM genres WHERE genre_id = ?', [genreId])
  }
}

export default GenresService
