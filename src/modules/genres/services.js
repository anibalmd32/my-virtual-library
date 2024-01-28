import database from '../../database/connection.js'

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

  async createGenre (genreData) {}

  async updateOneGenre (genreData, genreId) {}

  async deleteOneGenre (genreId) {}
}

export default GenresService
