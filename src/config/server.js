const PORT = process.env.PORT || 8080

const serverConfig = {
  PORT,
  serverCallback: () => {
    console.info('Sever listening on port:', PORT)
  }
}

const corsConfig = {
  allowedUrls: [
    process.env.LOCAL_CLIENT || 'http://127.0.0.1:5500',
    process.env.CLOUD_CLIENT
  ],
  allowedMethods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'].join(', '),
  allowedHeaders: [
    'Content-type',
    'Authorization'
  ].join(', ')
}

export {
  serverConfig,
  corsConfig
}
