import database from '../../database/connection.js'

class AuthorsServices {
  async getAllAuthors () {
    const [data] = await database.execute('SELECT * FROM authors')

    return JSON.stringify(data)
  }
}

export default AuthorsServices
