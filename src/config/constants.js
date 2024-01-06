const PORT = process.env.PORT || 8080

const DB_URI = process.env.DB_URI || 'mysql://root:@localhost:3306/library_db'

const DB_OBJ_SETUP = {
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306
}

const URLsAllowed = [
  process.env.LOCAL_CLIENT || 'http://127.0.0.1:5500'
]

export {
  PORT,
  DB_URI,
  URLsAllowed,
  DB_OBJ_SETUP
}
