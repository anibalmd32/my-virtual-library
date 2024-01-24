const DB_URI = process.env.DB_URI || 'mysql://root:d3b324@localhost:3306/library_db'

const DB_OBJ_SETUP = {
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'd3b324',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306
}

export {
  DB_URI,
  DB_OBJ_SETUP
}
