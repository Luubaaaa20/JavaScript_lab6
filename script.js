let levelsData
let currentLevel = 0
let matrix = []
let stepCount = 0
let lastClicked = null

document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
    .then(r => r.json())
    .then(d => {
      levelsData = d.levels
      initControls()
      loadLevel(0)
    })
})

function initControls() {
  const s = document.getElementById('level-select')
  levelsData.forEach((l,i) => {
    const o = document.createElement('option')
    o.value = i
    o.textContent = `Рівень ${i+1}`
    s.appendChild(o)
  })
  s.addEventListener('change', () => loadLevel(+s.value))
  document.getElementById('reset-btn')
    .addEventListener('click', () => loadLevel(currentLevel))
}

function loadLevel(i) {
  currentLevel = i
  matrix = levelsData[i].matrix.map(r => r.slice())
  stepCount = 0
  lastClicked = null
  updateDisplay()
  renderGrid()
}

function onCellClick(e) {
  const i = +e.currentTarget.dataset.i
  const j = +e.currentTarget.dataset.j
  const isDouble = lastClicked && lastClicked.i === i && lastClicked.j === j
  [[i,j],[i-1,j],[i+1,j],[i,j-1],[i,j+1]]
    .forEach(([x,y]) => toggleCell(x,y))
  if (isDouble) {
    stepCount--
    lastClicked = null
  } else {
    stepCount++
    lastClicked = {i,j}
    if (matrix.flat().every(v=>v===0))
      setTimeout(()=>alert(`Перемога за ${stepCount} кроків!`),100)
  }
  updateDisplay()
}

function toggleCell(i,j) {
  if (i<0||i>4||j<0||j>4) return
  matrix[i][j] ^= 1
  const c = document.querySelector(`[data-i="${i}"][data-j="${j}"]`)
  c.classList.toggle('on')
  c.classList.toggle('off')
}

function renderGrid() {
  const g = document.getElementById('grid')
  g.innerHTML = ''
  matrix.forEach((row,i) => {
    const r = document.createElement('div')
    r.className = 'row'
    row.forEach((c,j) => {
      const d = document.createElement('div')
      d.className = c ? 'cell on' : 'cell off'
      d.dataset.i = i
      d.dataset.j = j
      d.addEventListener('click', onCellClick)
      r.appendChild(d)
    })
    g.appendChild(r)
  })
}

function updateDisplay() {
  document.getElementById('step-count').textContent = stepCount
  document.getElementById('min-steps').textContent = levelsData[currentLevel].minSteps
}
