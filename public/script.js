const form = document.getElementById('form')
const email = document.getElementById('email')
const password = document.getElementById('password')
const error_message = document.getElementById('error_message')

form.addEventListener('submit', async (e) => {
  try {
    e.preventDefault()
    const regex = new RegExp(/^(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/)
    const isGoodPassword = regex.test(password.value)

    if (isGoodPassword) {
      const postCredentials = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email.value,
          password: password.value
        })
      })
      const response = await postCredentials.json()

      if (response.token) {
        localStorage.setItem('token', response.token)
        window.location.href = '/dashboard'
      }
      else {
        throw response
      }
    }
    else {
      throw `Votre mot de passe ne respecte pas le format requis`
    }
  }
  catch (err) {
    error_message.innerHTML = err.message ? err.message : err
  }
})