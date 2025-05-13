const levelsData = [];
let currentLevel = 0;
let matrix = [];
let stepCount = 0;
let lastClicked = null;

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const response = await fetch('data.json');
    if (!response.ok) throw new Error('Не вдалося завантажити data.json');
    const data = await response.json();
    Object.assign(levelsData, data.levels);
    initControls();
    loadLevel(0);
  } catch (error) {
    console.error('Помилка:', error);
    alert('Не вдалося завантажити рівні. Перевірте підключення або файл data.json.');
  }
});

function initControls() {
  const select = document.getElementById('level-select');
  levelsData.forEach((level, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `Рівень ${index + 1}`;
    select.appendChild(option);
  });
  select.addEventListener('change', () => loadLevel(+select.value));
  document.getElementById('reset-btn').addEventListener('click', () => loadLevel(currentLevel));
}

function loadLevel(index) {
  currentLevel = index;
  matrix = levelsData[index].matrix.map(row => [...row]);
  stepCount = 0;
  lastClicked = null;
  updateDisplay();
  renderGrid();
}

function onCellClick(event) {
  const { i, j } = event.currentTarget.dataset;
  const row = +i;
  const col = +j;
  const isDouble = lastClicked && lastClicked.i === row && lastClicked.j === col;

  [[row, col], [row - 1, col], [row + 1, col], [row, col - 1], [row, col + 1]].forEach(([x, y]) =>
    toggleCell(x, y)
  );

  stepCount = isDouble ? stepCount - 1 : stepCount + 1;
  lastClicked = isDouble ? null : { i: row, j: col };

  if (matrix.flat().every(v => v === 0)) {
    setTimeout(() => alert(`Перемога за ${stepCount} кроків!`), 100);
  }

  updateDisplay();
}

function toggleCell(row, col) {
  if (row < 0 || row > 4 || col < 0 || col > 4) return;
  matrix[row][col] ^= 1;
  const cell = document.querySelector(`[data-i="${row}"][data-j="${col}"]`);
  cell.classList.toggle('on');
  cell.classList.toggle('off');
}

function renderGrid() {
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  matrix.forEach((row, rowIndex) => {
    const rowElement = document.createElement('div');
    rowElement.className = 'row';
    row.forEach((cell, colIndex) => {
      const cellElement = document.createElement('div');
      cellElement.className = `cell ${cell ? 'on' : 'off'}`;
      cellElement.dataset.i = rowIndex;
      cellElement.dataset.j = colIndex;
      cellElement.addEventListener('click', onCellClick);
      rowElement.appendChild(cellElement);
    });
    grid.appendChild(rowElement);
  });
}

function updateDisplay() {
  document.getElementById('step-count').textContent = stepCount;
  document.getElementById('min-steps').textContent = levelsData[currentLevel].minSteps;
}
