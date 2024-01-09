import server from './server/server.js'
import { serverConfig, corsConfig } from './config/server.js'

server(serverConfig, corsConfig)
