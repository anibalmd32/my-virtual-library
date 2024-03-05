const DB_URI = process.env.DB_URI || 'mysql://root@localhost:3306/library_db'

const DB_OBJ_SETUP = {
  user: process.env.DB_USER || 'root',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306
}

export {
  DB_URI,
  DB_OBJ_SETUP
}
