const PORT = process.env.PORT || 8080
const DATABSE_URI = process.env.DATABSE_URI || 'mysql://root:@localhost:3306/library_db'

const URLsAllowed = [
  process.env.LOCAL_CLIENT || 'http://127.0.0.1:5500'
]

export {
  PORT,
  DATABSE_URI,
  URLsAllowed
}
