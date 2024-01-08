const PORT = process.env.PORT || 8080

const URLsAllowed = [
  process.env.LOCAL_CLIENT || 'http://127.0.0.1:5500'
]

export {
  PORT,
  URLsAllowed
}
