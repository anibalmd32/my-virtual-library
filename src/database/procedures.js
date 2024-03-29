import datatabase from './connection.js'

try {
  // Create book
  try {
    await datatabase.execute(`
        CREATE PROCEDURE IF NOT EXISTS AddBook (
            IN book_title VARCHAR(50),
            IN book_description TEXT,
            IN publication DATE,
            IN cover VARCHAR(255),
            IN author_name VARCHAR(50),
            OUT res VARCHAR(255)
        )
        BEGIN
            DECLARE exit_flag INT DEFAULT 0;

            DECLARE a_id CHAR(36);
            DECLARE b_id CHAR(36);
            DECLARE current_book_title VARCHAR(50);

            DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
            BEGIN
                ROLLBACK;
                SET exit_flag = 1;
                SELECT 'Rolled Back!' INTO res;
            END;

            START TRANSACTION;

                -- Verify author
                SELECT author_id INTO a_id FROM authors WHERE name = author_name;

                IF a_id IS NULL THEN
                    SET a_id = UUID();
                    INSERT INTO authors(author_id, name) VALUES (a_id, author_name);
                END IF;

                -- Create book
                SELECT title INTO current_book_title FROM books WHERE title = book_title;

                IF current_book_title IS NULL THEN    
                    SET b_id = UUID();

                    INSERT INTO books(
                        book_id,
                        title,
                        description,
                        publication_date,
                        cover_url,
                        author_id
                    ) VALUES (
                        b_id,
                        book_title,
                        book_description,
                        publication,
                        cover,
                        a_id
                    );
                ELSE
                    SET exit_flag = 1;
                    SELECT 'Book already exists' INTO res;
                END IF;

                IF exit_flag = 1 THEN
                    ROLLBACK;
                ELSE
                    SELECT b_id INTO res;
                    COMMIT;
                END IF;
              END;
          `)
  } catch (error) {
    throw new Error('Error to create store procedure: AddBook', error)
  }

  // Create relation book - genres
  try {
    await datatabase.execute(`
        CREATE PROCEDURE IF NOT EXISTS BookGenres (
            IN b_id CHAR(36),
            IN genre_name VARCHAR(255),
            OUT res VARCHAR(255)
        )
        BEGIN
            DECLARE exit_flag INT DEFAULT 0;

            DECLARE g_id CHAR(36);

            DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
            BEGIN
                ROLLBACK;
                set exit_flag = 1;
                SELECT 'Rolled Back!' INTO res;
            END;

            START TRANSACTION;

                SELECT genre_id INTO g_id FROM genres WHERE name = genre_name;

                IF g_id IS NULL THEN
                    SET g_id = UUID();
                    INSERT INTO genres(genre_id, name) VALUES (g_id, genre_name);
                END IF;

                INSERT INTO book_genres(book_id, genre_id) VALUES (b_id, g_id);

                IF exit_flag = 1 THEN
                    ROLLBACK;
                    SELECT 'Rolled Back!' INTO res;
                ELSE
                    COMMIT;
                    SELECT 'Book - Genre relation created' INTO res;
                END IF;
        END;
    `)
  } catch (error) {
    throw new Error('Error to create store procedure: BookGenres', error)
  }

  // Create author
  try {
    await datatabase.execute(`
        CREATE PROCEDURE IF NOT EXISTS InsertAuthor(
            IN a_name VARCHAR(50),
            OUT res VARCHAR(255)
        )
        BEGIN
            DECLARE a_id CHAR(36);

            DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
            BEGIN
                ROLLBACK;
                SELECT 'Rolled Back!' INTO res;
            END;

            START TRANSACTION;
                SELECT author_id INTO a_id FROM authors WHERE name = a_name;

                IF a_id IS NULL THEN
                    SET a_id = UUID();
                    INSERT INTO authors(author_id, name) VALUES (a_id, a_name);
                END IF;
            COMMIT;
        END;
    `)
  } catch (error) {
    console.log(error)
    throw new Error('Error to create stored procedure: InsertAuthor', error)
  }

  // Delete book
  try {
    await datatabase.execute(`
        CREATE PROCEDURE IF NOT EXISTS DeleteBook(
            IN b_id CHAR(36),
            OUT res VARCHAR(255)
        )
        BEGIN
            DECLARE id CHAR(36);

            DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
            BEGIN
                ROLLBACK;
                SELECT 'Rolled Back!' INTO res;
            END;

            START TRANSACTION;
                SELECT book_id INTO id FROM books WHERE book_id = b_id;

                IF id IS NULL THEN
                    ROLLBACK;
                    SELECT 'Resource not found' INTO res;
                ELSE
                    DELETE FROM book_genres WHERE book_id = b_id;
                    DELETE FROM books WHERE book_id = b_id;

                    COMMIT;
                END IF;
        END;
    `)
  } catch (error) {
    throw new Error('Error to create stored procedure: DeleteBook', error)
  }

  // Create genre
  try {
    await datatabase.execute(`
        CREATE PROCEDURE IF NOT EXISTS InsertGenre(
            IN g_name VARCHAR(255),
            IN g_description TEXT,
            OUT res VARCHAR(255)
        )
        BEGIN
            DECLARE g_id CHAR(36);

            DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
            BEGIN
                ROLLBACK;
                SELECT 'Rolled Back!' INTO res;
            END;

            START TRANSACTION;
                SELECT genre_id INTO g_id FROM genres WHERE name = g_name;

                IF g_id IS NOT NULL THEN
                    ROLLBACK;
                    SELECT 'Resource already exists' INTO res;
                ELSE
                    SET g_id = UUID();
                    INSERT INTO genres(genre_id, name, description) VALUES (g_id, g_name, g_description);

                    COMMIT;
                END IF;
        END;
    `)
  } catch (error) {
    throw new Error(`Error to create stored procedure: InsertGenre ${error}`)
  }

  console.info('Stored procedures has been execute successfull')
} catch (error) {
  console.error('Error to execute stored procedures', error)
} finally {
  process.exit(1)
}
