const update = document.querySelector('#update-button')
const deleteBtn = document.querySelector('#delete-button')
const messageDiv = document.querySelector('#message')

update.addEventListener('click', _ => {
  fetch('/quotes', {
    method: 'put',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      name: 'Qui-Gon Jinn',
      quote: 'Your focus determines your reality.',
    }),
  })
    .then(res => {
      if (res.ok) return res.json()
    })
    .then(response => {
      console.log(response)
      window.location.reload(true)
    })
})

deleteBtn.addEventListener('click', _ => {
  fetch('/quotes', {
    method: 'delete',
    headers: {'content-Type': 'application/json'},
    body: JSON.stringify({
      name: 'Qui-Gon Jinn',
    }),
  })
    .then(res => {
      if (res.ok) return res.json()
    })
    .then(response => {
      if (response === 'No quote to delete') {
        messageDiv.textContent = 'No Darth Vader quote to delete'
      } else {
        window.location.reload(true)
      }
    })
})
