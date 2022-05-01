function calcIMC(height, weight) {
  return weight / (height * height)
}

const calculate = document.getElementById('calcular')

calculate.addEventListener('click', () => {
  const height = document.getElementById('altura').value
  const weight = document.getElementById('massa').value
  const element = document.getElementById('valueIMC')
  element.innerHTML = calcIMC(height, weight).toFixed(2)
})
