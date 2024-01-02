import http from 'node:http';
import { PORT } from './src/config/constants.js';

const server = http.createServer().listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

server.on('request', (req, res) => {
  res.writeHead(200, {
    'Content-type': 'text/plain',
  }).end('Success');
});
