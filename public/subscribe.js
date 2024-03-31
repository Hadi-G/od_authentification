const subscribe_form = document.getElementById('subscribe_form')
const first_name = document.getElementById('first_name')
const last_name = document.getElementById('last_name')
const second_email = document.getElementById('second_email')
const first_password = document.getElementById('first_password')
const confirm_password = document.getElementById('confirm_password')
const second_error_message = document.getElementById('second_error_message')

subscribe_form.addEventListener('submit', async (e) => {
  try {
    e.preventDefault()
    const regex = new RegExp(/^(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&])[A-Za-z\d@#$!%*?&]{8,}$/)
    const isGoodPassword = regex.test(first_password.value)
  
    if (!isGoodPassword) {
      throw `Votre mot de passe ne respecte pas le format requis`
    }
    if (first_password.value !== confirm_password.value) {
      throw `Les mots de passe ne sont pas identiques`
    }
    const postSubscription = await fetch('/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        first_name: first_name.value,
        last_name: last_name.value,
        email: second_email.value,
        password: first_password.value
      })
    })
    const response = await postSubscription.json()

    if (response.token) {
      localStorage.setItem('token', response.token)
      window.location.href = '/dashboard'
    }
    else {
      throw response
    }
  }
  catch (err) {
    second_error_message.innerHTML = err.message ? err.message : err;
  }
})