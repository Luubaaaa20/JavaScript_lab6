let levelsData;
let currentLevel = 0;
let matrix = [];
let stepCount = 0;

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
    opt.textContent = `Рівень ${i+1}`;
    select.appendChild(opt);
  });
  select.addEventListener('change', () => loadLevel(+select.value));
  document.getElementById('reset-btn')
    .addEventListener('click', () => loadLevel(currentLevel));
}
