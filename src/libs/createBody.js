function createBody (req) {
  return new Promise((resolve, reject) => {
    let body = []
    const method = ['POST', 'PUT', 'PATCH']

    if (method.includes(req.method)) {
      req
        .on('error', err => reject(err))
        .on('data', chunk => {
          chunk && body.push(chunk)
        })
        .on('end', () => {
          body = Buffer.concat(body).toString()
          body ? resolve(JSON.parse(body)) : resolve(null)
        })
    } else {
      resolve(null)
    }
  })
}

export default createBody
