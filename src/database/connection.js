import mysql from 'mysql2/promise'
import { DB_URI } from '../config/database.js'

const database = await mysql.createConnection(DB_URI)

export default database
