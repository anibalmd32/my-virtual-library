const DB_URI = process.env.DB_URI || 'mysql://root:@localhost:3307/library_db'

const DB_OBJ_SETUP = {
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3307
}

export {
  DB_URI,
  DB_OBJ_SETUP
}
