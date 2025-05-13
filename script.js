let levelsData;
let currentLevel = 0;
let matrix = [];
let stepCount = 0;
let lastClicked = null;

document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
    .then(res => res.json())
    .then(data => {
      levelsData = data.levels;
      initControls();
      loadLevel(0);
    })
    .catch(err => console.error('Помилка завантаження даних:', err));
});

function initControls() {
  const select = document.getElementById('level-select');
  levelsData.forEach((lvl, i) => {
    const opt = document.createElement('option');
    opt.value = i;
    opt.textContent = `Рівень ${i + 1}`;
    select.appendChild(opt);
  });
  select.addEventListener('change', () => loadLevel(+select.value));
  document.getElementById('reset-btn')
    .addEventListener('click', () => loadLevel(currentLevel));
}

function loadLevel(levelIndex) {
  currentLevel = levelIndex;
  matrix = levelsData[levelIndex].matrix.map(row => row.slice());
  stepCount = 0;
  lastClicked = null;                    // скидати історію кліків
  document.getElementById('step-count').textContent = stepCount;
  document.getElementById('min-steps').textContent = levelsData[levelIndex].minSteps;
  renderGrid();
}

function renderGrid() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  matrix.forEach((row, i) => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row';
    row.forEach((cell, j) => {
      const cellDiv = document.createElement('div');
      cellDiv.className = cell ? 'cell on' : 'cell off';
      cellDiv.dataset.i = i;
      cellDiv.dataset.j = j;
      cellDiv.addEventListener('click', onCellClick);
      rowDiv.appendChild(cellDiv);
    });
    grid.appendChild(rowDiv);
  });
}

function onCellClick(evt) {
  const i = +evt.currentTarget.dataset.i;
  const j = +evt.currentTarget.dataset.j;

  const isDouble = lastClicked
    && lastClicked.i === i
    && lastClicked.j === j;

  [[i,j],[i-1,j],[i+1,j],[i,j-1],[i,j+1]].forEach(([x,y]) => toggleCell(x,y));

  if (isDouble) {
    lastClicked = null;
  } else {
    stepCount++;
    lastClicked = { i, j };
    if (checkWin()) {
      setTimeout(() => alert(`Перемога за ${stepCount} кроків!`), 100);
    }
  }

  document.getElementById('step-count').textContent = stepCount;
}

function toggleCell(i, j) {
  if (i >= 0 && i < 5 && j >= 0 && j < 5) {
    matrix[i][j] ^= 1;
    const cell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
    cell.classList.toggle('on');
    cell.classList.toggle('off');
  }
}

function checkWin() {
  return matrix.flat().every(v => v === 0);
}
