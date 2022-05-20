const routes = {
  '/loading': { templateId: 'loading' },
  '/calc': { templateId: 'calc' }
}

function navigate(path) {
  window.history.pushState({}, path, window.location.origin + path)
  updateRoute()
}

function updateRoute() {
  const path = window.location.pathname
  const route = routes[path]

  if (!route) {
    return navigate('/dashboard')
  }

  const template = document.getElementById(route.templateId)
  const view = template.content.cloneNode(true)
  const app = document.getElementById('app')
  app.innerHTML = ''
  app.appendChild(view)

  if (typeof route.init === 'function') {
    route.init()
  }

  document.title = route.title
}

function StorageAvailable() {}

const db = window.localStorage

const nascimento = document.getElementById('nascimento').value
const nome = document.getElementById('nome').value
const email = document.getElementById('email').value
const plano = document.getElementById('plano').value
const senha = document.getElementById('password').value
const cadastrar = document.getElementById('cadastrar')

function validarEmail() {
  let emailElement = document.getElementById('email')
  let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (regex.test(emailElement.value) == true) {
    return (emailElement.className = 'form-control is-valid')
  } else if (emailElement.value == '') {
    return (emailElement.className = 'form-control')
  } else {
    return (emailElement.className = 'form-control is-invalid')
  }
}

const resetMsg = () => {
  let emailElement = document.getElementById('email')
  if (validarEmail() == true) {
    return (emailElement.className = 'form-control')
  } else if ((emailElement.value = '')) {
    return (emailElement.className = 'form-control')
  } else if (emailElement.className == 'form-control is-invalid') {
    return (emailElement.className = 'form-control')
  }
}

// SIMPLES RESET DE STATUS //
// const resetMsg = () => {
//   let emailaddress = document.getElementById('email')
//   if (emailaddress.className == 'form-control is-invalid') {
//     return (emailaddress.className = 'form-control')
//   }
// }

function Cliente(nome, email, nascimento, plano, senha) {
  this.Nome = nome
  this.Email = email
  this.Nascimento = nascimento
  this.Plano = plano
  this.Senha = senha
  this.Idade = ''
}

console.log(db.length)

cadastrar.addEventListener('click', () => {
  let message = document.getElementById('btnError')
  // var regex = (regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  // if (regex.test(emailElement.value) == true) {
  for (let i = 0; i < db.length; i++) {
    if (db.key(i) == email) {
      return (message.textContent = 'Este e-mail já cadastrado!')
    } else {
      db.setItem(
        `${email}`,
        JSON.stringify(new Cliente(nome, email, nascimento, plano, senha))
      )
      console.log('newUserAddedSuccessfully')
      // message.textContent = ''
      // updateRoute('calc')
    }
  }
})

updateRoute('calc')
