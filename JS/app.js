// ----------------------------------------------------------------
// CONSTANTES
// ----------------------------------------------------------------
const globalStorage = 'savedState'
const db = window.localStorage
var globalObject = {
  activeAccount: 'false'
}

// ----------------------------------------------------------------
// utilitário
// ----------------------------------------------------------------

function updateElement(id, textOrNode) {
  const element = document.getElementById(id)
  element.textContent = '' // Removes all children
  return element.append(textOrNode)
}

function searchDb(key) {
  if (!JSON.parse(db.getItem(key))) {
    return false
  } else {
    return JSON.parse(db.getItem(key))
  }
}

function logout() {
  updateState(globalStorage, 'activeAccount', false)
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

// let state = Object.freeze({
//   account: null
// })

function updateState(key, prop, value) {
  const object = searchDb(key)
  var clone = object
  db.removeItem(key)
  clone[prop] = value
  db.setItem(key, JSON.stringify(clone))
}

// function updateState(property, newData) {
//   state = Object.freeze({
//     ...state,
//     [property]: newData
//   })
//   localStorage.setItem(storageKey, JSON.stringify(state.account))
// }

// ----------------------------------------------------------------
// CADASTRO
// ----------------------------------------------------------------

// function StorageAvailable() {}

let account = null

function User(name, email, birthday, subscription, pw) {
  this.name = name
  this.email = email
  this.birthday = birthday
  this.subscription = subscription
  this.pw = pw
  this.age = ''
}

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
  if (emailElement.className == 'form-control is-valid') {
    if (searchDb(emailElement.value).email == emailElement.value) {
      updateElement('registerError', 'Este e-mail já está cadastrado!')
    } else {
      createAccount(emailElement.value, jsonData)
      updateElement('registerError', 'Conta criada com sucesso!')
      updateState(globalStorage, 'activeAccount', emailElement.value)
      setTimeout("navigate('/calc')", 1500)
    }
  } else {
    updateElement('registerError', 'E-mail inválido')
  }
  // fim condição validação
}

const validateEmail = () => {
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

const validateLoginEmail = () => {
  let emailElement = document.getElementById('emailLogin')
  let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (regex.test(emailElement.value) == true) {
    return (emailElement.className = 'form-control is-valid')
  } else if (emailElement.value == '') {
    return (emailElement.className = 'form-control')
  } else {
    return (emailElement.className = 'form-control is-invalid')
  }
}

const resetLoginMsg = () => {
  let emailElement = document.getElementById('emailLogin')
  if (validateLoginEmail() == true) {
    return (emailElement.className = 'form-control')
  } else if ((emailElement.value = '')) {
    return (emailElement.className = 'form-control')
  } else if (emailElement.className == 'form-control is-invalid') {
    updateElement('loginMsg', '')
    return (emailElement.className = 'form-control')
  }
}

// SIMPLES RESET DE STATUS //

const resetMsg = () => {
  let emailaddress = document.getElementById('email')
  if (emailaddress.className == 'form-control is-invalid') {
    updateElement('registerError', '')
    return (emailaddress.className = 'form-control')
  }
}

// const resetLoginMsg = () => {
//   let emailaddress = document.getElementById('emailLogin')
//   if (emailaddress.className == 'form-control is-invalid') {
//     updateElement('loginMsg', '')
//     return (emailaddress.className = 'form-control')
//   }
// }

function login() {
  const emailLogin = document.getElementById('emailLogin').value
  const passwordLogin = document.getElementById('passwordLogin').value
  if (
    searchDb(emailLogin).email == emailLogin &&
    searchDb(emailLogin).pw == passwordLogin
  ) {
    updateElement('loginMsg', 'Login realizado com sucesso!')
    updateState(globalStorage, 'activeAccount', emailLogin)
    setTimeout("navigate('/calc')", 1500)
  } else if (
    searchDb(emailLogin).email == emailLogin &&
    searchDb(emailLogin).pw != passwordLogin
  ) {
    updateElement('loginMsg', 'Senha incorreta, tente novamente.')
  } else {
    updateElement('loginMsg', 'E-mail não cadastrado.')
  }
}

// ----------------------------------------------------------------
// Calculadora IMC
// ----------------------------------------------------------------

function formulaeIMC(height, weight) {
  return weight / (height * height)
}

function saveRegister() {
  const height = document.getElementById('altura').value
  const weight = document.getElementById('massa').value
  const sexElement = document.getElementById('sexo')
  const sex = sexElement.options[sexElement.selectedIndex].textContent
  data = formulaeIMC(height, weight).toFixed(2)
  const text = 'O seu IMC é de '
  updateElement('valueIMC', text + data)
  updateState(searchDb(globalStorage).activeAccount, 'height', height)
  updateState(searchDb(globalStorage).activeAccount, 'weight', weight)
  updateState(searchDb(globalStorage).activeAccount, 'IMC', data)
  updateState(searchDb(globalStorage).activeAccount, 'sexo', sex)
}

// ----------------------------------------------------------------
// INICIALIZAÇÃO
// ----------------------------------------------------------------

function init() {
  createAccount(globalStorage, JSON.stringify(globalObject))
  setTimeout('updateRoute()', 300)
}

init()

function welcome() {
  const email = searchDb(globalStorage).activeAccount
  updateElement('userName', searchDb(email).name)
}
