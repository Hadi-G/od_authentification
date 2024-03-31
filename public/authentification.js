const disconnect_button = document.getElementById('disconnect_button')
const connexion_buttons = document.getElementById('connexion_buttons')
const welcome = document.getElementById('welcome')
const third_error_message = document.getElementById('third_error_message')

const token = localStorage.getItem('token')

const disconect = () => {
  localStorage.removeItem('token')
  disconnect_button.style.display = 'none'
  connexion_buttons.style.display = 'block'
  window.location.href = '/'
}

if (!token) {
  disconect()
}
else {
  disconnect_button.style.display = 'block'
  connexion_buttons.style.display = 'none'

  fetch('/user_data', {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  })
  .then(response => {
    if (!response.ok) {
      return disconect()
    }
    return response.json()
  })
  .then(user_data => {
    if (!user_data) {
      throw user_data
    }
    welcome.innerHTML = `Bienvenue ${user_data.first_name} ${user_data.last_name}`
  })
  .catch(err => third_error_message.innerHTML = err.message ? err.message : err)
}

disconnect_button.addEventListener('click', () => {
  disconect()
})