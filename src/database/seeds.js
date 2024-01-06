import database from './connection.js'

try {
  try {
    await database.execute(`
      INSERT INTO authors(author_id, name, biography) VALUES
        (
          UUID(),
          LOWER('Miguel de Cervantes'),
          '(1547-1616) Escritor español, autor de la obra maestra de la literatura universal "Don Quijote de la Mancha"'
        ),
        (
          UUID(),
          LOWER('William Shakespeare'),
          '(1564-1616) Dramaturgo inglés, considerado uno de los más grandes escritores de la historia'
        ),
        (
          UUID(),
          LOWER('Jane Austen'),
          '(1775-1817) Escritora británica, autora de novelas románticas como "Orgullo y prejuicio" y "Emma"'
        ),
        (
          UUID(),
          LOWER('Charles Dickens'),
          '(1812-1870) Escritor británico, autor de novelas sociales como "Oliver Twist" y "David Copperfield"'
        ),
        (
          UUID(),
          LOWER('Leo Tolstói'),
          '(1828-1910) Escritor ruso, autor de novelas épicas como "Guerra y paz" y "Anna Karenina"'
        ),
        (
          UUID(),
          LOWER('Fiódor Dostoyevski'),
          '(1821-1881) Escritor ruso, autor de novelas psicológicas como "Crimen y castigo" y "Los hermanos Karamazov"'
        ),
        (
          UUID(),
          LOWER('Franz Kafka'),
          '(1883-1924) Escritor checo, autor de novelas y relatos cortos surrealistas como "El proceso" y "La metamorfosis"'
        ),
        (
          UUID(),
          LOWER('Ernest Hemingway'),
          '(1899-1961) Escritor estadounidense, autor de novelas y relatos cortos de estilo realista como "Adiós a las armas" y "El viejo y el mar"'
        ),
        (
          UUID(),
          LOWER('Gabriel García Márquez'),
          '(1927-2014) Escritor colombiano, autor de novelas de realismo mágico como "Cien años de soledad" y "El amor en los tiempos del cólera"'
        ),
        (
          UUID(),
          LOWER('J. R. R. Tolkien'),
          '(1892-1973) Escritor británico, autor de la trilogía de fantasía "El señor de los anillos"'
        )
    `)

    console.info('The authors table has been seeding 🌿')
  } catch (error) {
    throw new Error('Error seeding authors table', error)
  }
} catch (error) {
  console.error('Error to execute seeds: ', error)
} finally {
  process.exit(1)
}
