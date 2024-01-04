import database from './connection.js'

function createTables () {
  (async () => {
    try {
      await database.execute(`CREATE TABLE IF NOT EXISTS authors(
        author_id CHAR(36) UNIQUE NOT NULL,
        name VARCHAR(50) NOT NULL,
        biography TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (author_id)
      )`)
    } catch (err) {
      console.error('Error to create authors table', err)
    }
  })();

  (async () => {
    try {
      await database.execute(`CREATE TABLE IF NOT EXISTS books(
        book_id CHAR(36) UNIQUE NOT NULL,
        title VARCHAR(50) UNIQUE NOT NULL,
        description TEXT,
        publication_date DATE,
        cover_url VARCHAR(255),
        author_id CHAR(36) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (book_id),
        FOREIGN KEY (author_id) REFERENCES authors(author_id) ON UPDATE CASCADE ON DELETE RESTRICT
      )`)
    } catch (err) {
      console.error('Error to create books table', err)
    }
  })();

  (async () => {
    try {
      await database.execute(`CREATE TABLE IF NOT EXISTS genres(
        genre_id CHAR(36) UNIQUE NOT NULL,
        name VARCHAR(16) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (genre_id)
      )`)
    } catch (err) {
      console.error('Error to create generes table', err)
    }
  })();

  (async () => {
    try {
      await database.execute(`CREATE TABLE IF NOT EXISTS book_genres(
        book_id CHAR(36) NOT NULL,
        genre_id CHAR(36) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (book_id, genre_id),
        FOREIGN KEY (book_id) REFERENCES books(book_id) ON UPDATE CASCADE ON DELETE RESTRICT,
        FOREIGN KEY (genre_id) REFERENCES genres(genre_id) ON UPDATE CASCADE ON DELETE RESTRICT
      )`)
    } catch (err) {
      console.error('Error to create books_generes table', err)
    }
  })();

  (async () => {
    try {
      await database.execute(`CREATE TABLE IF NOT EXISTS users(
        user_id CHAR(36) UNIQUE NOT NULL,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id)
      )`)
    } catch (err) {
      console.error('Error to create users table', err)
    }
  })();

  (async () => {
    try {
      await database.execute(`CREATE TABLE IF NOT EXISTS reading_list(
        list_id CHAR(36) UNIQUE NOT NULL,
        name VARCHAR(50) UNIQUE NOT NULL,
        user_id CHAR(36) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (list_id),
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE RESTRICT
      )`)
    } catch (err) {
      console.error('Error to create reading_list table', err)
    }
  })();

  (async () => {
    try {
      await database.execute(`CREATE TABLE IF NOT EXISTS books_in_list(
        book_id CHAR(36) NOT NULL,
        list_id CHAR(36) NOT NULL,
        start_reading_date DATE NOT NULL DEFAULT NOW(),
        end_reading_date DATE,
        reading_status INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (book_id, list_id),
        FOREIGN KEY (book_id) REFERENCES books(book_id) ON UPDATE CASCADE ON DELETE RESTRICT,
        FOREIGN KEY (list_id) REFERENCES reading_list(list_id) ON UPDATE CASCADE ON DELETE RESTRICT
      )`)
    } catch (err) {
      console.error('Error to create books_in_list table', err)
    }
  })();

  (async () => {
    try {
      await database.execute(`CREATE TABLE IF NOT EXISTS user_session(
        session_token VARCHAR(255) UNIQUE NOT NULL,
        user_id CHAR(36) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (session_token),
        FOREIGN KEY (user_id) REFERENCES users(user_id) ON UPDATE CASCADE ON DELETE RESTRICT
      )`)
    } catch (err) {
      console.error('Error to create user_session table', err)
    }
  })();

  (async () => {
    try {
      await database.execute(`CREATE TABLE IF NOT EXISTS tokens_blacklist(
        session_token VARCHAR(255) UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (session_token)
      )`)
    } catch (err) {
      console.error('Error to create tokens_blacklist table', err)
    }
  })()
}

createTables()
