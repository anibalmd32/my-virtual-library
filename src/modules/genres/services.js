import database from '../../database/connection.js'

class GenresService {
  async getALlGenres () {
    const [data] = await database.execute('SELECT * FROM genres')
    return data
  }
}

export default GenresService
