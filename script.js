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
    const o = document.createElement('option');
    o.value = i; o.textContent = `Рівень ${i+1}`;
    select.appendChild(o);
  });
  select.addEventListener('change', () => loadLevel(+select.value));
  document.getElementById('reset-btn')
          .addEventListener('click', () => loadLevel(currentLevel));
}

function loadLevel(idx) {
  currentLevel = idx;
  matrix = levelsData[idx].matrix.map(r => r.slice());
  stepCount = 0;
  lastClicked = null;
  updateDisplay();
  renderGrid();
}

function onCellClick(evt) {
  const i = +evt.currentTarget.dataset.i;
  const j = +evt.currentTarget.dataset.j;
  const isDouble = lastClicked && lastClicked.i === i && lastClicked.j === j;

  // Toggle центра й сусідів
  [[i,j],[i-1,j],[i+1,j],[i,j-1],[i,j+1]].forEach(
    ([x,y]) => toggleCell(x,y)
  );

  if (isDouble) {
    // скасувати хід: зменшуємо лічильник
    stepCount--;
    lastClicked = null;
  } else {
    // звичайний хід
    stepCount++;
    lastClicked = { i, j };
    if (checkWin()) {
      setTimeout(() => alert(`Перемога за ${stepCount} кроків!`), 100);
    }
  }

  updateDisplay();
}

function toggleCell(i, j) {
  if (i < 0 || i > 4 || j < 0 || j > 4) return;
  matrix[i][j] ^= 1;
  const cell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
  cell.classList.toggle('on');
  cell.classList.toggle('off');
}

function checkWin() {
  return matrix.flat().every(v => v === 0);
}

function renderGrid() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  matrix.forEach((row, i) => {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'row';
    row.forEach((cell, j) => {
      const d = document.createElement('div');
      d.className = cell ? 'cell on' : 'cell off';
      d.dataset.i = i; d.dataset.j = j;
      d.addEventListener('click', onCellClick);
      rowDiv.appendChild(d);
    });
    grid.appendChild(rowDiv);
  });
}

function updateDisplay() {
  document.getElementById('step-count').textContent = stepCount;
  document.getElementById('min-steps')
          .textContent = levelsData[currentLevel].minSteps;
}
