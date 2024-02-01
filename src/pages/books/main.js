const bookList = document.querySelector('#books')

const getBooks = () => {
  fetch('/api/books')
    .then(res => res.json())
    .then(books => {
      books.data.length && books.data.forEach(book => {
        const card = CardComponent(book)
        bookList.insertAdjacentElement('beforeend', card)
      })
    })
}

document.addEventListener('DOMContentLoaded', getBooks)

function CardComponent (props) {
  const { title, author, description } = props

  const cardBook = document.createElement('article')
  const cardBookTitle = document.createElement('h2')
  const cardBookAuthor = document.createElement('p')
  const cardBookDescription = document.createElement('p')

  cardBook.classList.add('card')
  cardBook.classList.add('card-book')
  cardBookTitle.classList.add('card-book-title')
  cardBookAuthor.classList.add('card-book-author')
  cardBookDescription.classList.add('card-book-description')

  cardBookTitle.innerHTML = title
  cardBookAuthor.innerHTML = author
  cardBookDescription.innerHTML = description

  cardBook.insertAdjacentElement('beforeend', cardBookTitle)
  cardBook.insertAdjacentElement('beforeend', cardBookAuthor)
  cardBook.insertAdjacentElement('beforeend', cardBookDescription)

  return cardBook
}
