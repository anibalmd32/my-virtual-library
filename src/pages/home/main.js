import test from './lib.js'
const btn = document.querySelector('button')

btn.addEventListener('click', async () => {
  const res = await fetch('/api/genres?genreName=realismo')
  const data = await res.json()

  console.log(data)
})

test()
