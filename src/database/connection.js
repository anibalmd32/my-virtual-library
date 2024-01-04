import mysql from 'mysql2/promise'
import { DATABSE_URI } from '../config/constants.js'

const database = await mysql.createConnection(DATABSE_URI)

export default database
