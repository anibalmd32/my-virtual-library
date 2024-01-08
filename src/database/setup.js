import mysql from 'mysql2/promise'
import { DB_OBJ_SETUP } from '../config/database.js'

const connection = await mysql.createConnection(DB_OBJ_SETUP)

try {
  await connection.execute('CREATE DATABASE library_db')
  console.info('Database library_db has been created')
} catch (error) {
  console.error('An error ocurred during database creation:', error)
} finally {
  process.exit(1)
}
