// ----------------------------------------------------------------
// CONSTANTES
// ----------------------------------------------------------------
const storageKey = 'savedAccount'
const db = window.localStorage
db.setItem('0', '0')

// ----------------------------------------------------------------
// utilitário
// ----------------------------------------------------------------

function updateElement(id, textOrNode) {
  const element = document.getElementById(id)
  element.textContent = '' // Removes all children
  return element.append(textOrNode)
}

function logout() {
  updateState('account', null)
  navigate('/register')
}

// ----------------------------------------------------------------
// Rotas
// ----------------------------------------------------------------

const routes = {
  '/register': { title: 'Register', templateId: 'register', init: 'refresh' },
  '/calc': { title: 'Calculadora', templateId: 'calc' }
}

function navigate(path) {
  window.history.pushState({}, path, window.location.origin + path)
  updateRoute()
}

function updateRoute() {
  const path = window.location.pathname
  const route = routes[path]

  if (!route) {
    return navigate('/register')
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

// ----------------------------------------------------------------
// GLOBAL
// ----------------------------------------------------------------

let state = Object.freeze({
  account: null
})

function updateState(property, newData) {
  state = Object.freeze({
    ...state,
    [property]: newData
  })
  localStorage.setItem(storageKey, JSON.stringify(state.account))
}

// ----------------------------------------------------------------
// CADASTRO
// ----------------------------------------------------------------

// function StorageAvailable() {}

let account = null

function Costumer(name, email, birthday, subscription, pw) {
  this.name = name
  this.email = email
  this.birthday = birthday
  this.subscription = subscription
  this.pw = pw
  this.age = ''
}

// async function createAccount(account) {
//   const birthday = document.getElementById('birthday').value
//   const costumerName = document.getElementById('name').value
//   const email = document.getElementById('email').value
//   const subscription = document.getElementById('subscription').value
//   const pw = document.getElementById('password').value
//   const registerOnStorage = document.getElementById('registrate')
//   db.setItem(
//     `${email}`,
//     JSON.stringify(
//       new Costumer(costumerName, email, birthday, subscription, pw)
//     )
//   )
// }

function createAccount(email, account) {
  return db.setItem(email, account)
}

function register() {
  const registerForm = document.getElementById('registerForm')
  const formData = new FormData(registerForm)
  const data = Object.fromEntries(formData)
  const subscriptionElement = document.getElementById('subscription')
  const selectedSubscription =
    subscriptionElement.options[subscriptionElement.selectedIndex].textContent
  const pw = document.getElementById('password').value
  data.subscription = selectedSubscription
  data.pw = pw
  const jsonData = JSON.stringify(data)
  // inicio condição validação
  const emailElement = document.getElementById('email')
  var dbElements = []
  if (emailElement.className == 'form-control is-valid') {
    for (let i = 0; i < db.length; i++) {
      dbElements.push(db.key(i))
    }
    if (
      dbElements.filter(function (element) {
        return element == emailElement.value
      }) == emailElement.value
    ) {
      updateElement('registerError', 'Este e-mail já está cadastrado!')
    } else {
      createAccount(emailElement.value, jsonData)
      updateElement('registerError', 'Conta criada com sucesso!')
      setTimeout("navigate('/calc')", 2000)
    }
  } else {
    updateElement('registerError', 'E-mail inválido')
  }
  // fim condição validação
}

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

// const resetMsg = () => {
//   let emailElement = document.getElementById('email')
//   if (validarEmail() == true) {
//     return (emailElement.className = 'form-control')
//   } else if ((emailElement.value = '')) {
//     return (emailElement.className = 'form-control')
//   } else if (emailElement.className == 'form-control is-invalid') {
//     return (emailElement.className = 'form-control')
//   }
// }

// SIMPLES RESET DE STATUS //

const resetMsg = () => {
  let emailaddress = document.getElementById('email')
  if (emailaddress.className == 'form-control is-invalid') {
    updateElement('registerError', '')
    return (emailaddress.className = 'form-control')
  }
}

// ----------------------------------------------------------------
// Calculadora IMC
// ----------------------------------------------------------------

function formulaeIMC(height, weight) {
  return weight / (height * height)
}

function calculateIMC() {
  const height = document.getElementById('altura').value
  console.log(height)
  const weight = document.getElementById('massa').value
  console.log(weight)
  const element = document.getElementById('valueIMC')
  console.log(element)
  updateElement('valueIMC', `${formulaeIMC(height, weight).toFixed(2)}`)
  // element.innerHTML = formulaeIMC(height, weight).toFixed(2)
}

// ----------------------------------------------------------------
// INICIALIZAÇÃO
// ----------------------------------------------------------------

function init() {
  // Restore state
  // const savedState = localStorage.getItem(storageKey)
  // if (savedState) {
  //   updateState('account', JSON.parse(savedState))
  // }

  // Update route for browser back/next buttons
  window.onpopstate = () => updateRoute()
  updateRoute()
}

init()
