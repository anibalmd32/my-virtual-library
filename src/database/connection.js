import mysql from 'mysql2/promise'

const database = await mysql.createConnection('mysql://root:@localhost:3306/library_db')

export default database
