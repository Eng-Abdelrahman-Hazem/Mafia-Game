const state = {
  cash: 2500,
  energy: 40,
  influence: 0
};

const canvas = document.getElementById('sceneCanvas');
const ctx = canvas.getContext('2d');
const feed = document.getElementById('feed');
const ui = {
  cash: document.getElementById('cash'),
  energy: document.getElementById('energy'),
  influence: document.getElementById('influence'),
  crimeBtn: document.getElementById('crimeBtn'),
  raidBtn: document.getElementById('raidBtn'),
  resetBtn: document.getElementById('resetBtn')
};

const actor = { x: 36, y: 166, color: '#5cd7ff' };
const target = { x: 314, y: 64, color: '#ff6f91' };

function renderHud() {
  ui.cash.textContent = String(state.cash);
  ui.energy.textContent = String(state.energy);
  ui.influence.textContent = String(state.influence);
}

function addFeed(text, cssClass = '') {
  const li = document.createElement('li');
  li.textContent = text;
  if (cssClass) li.classList.add(cssClass);
  feed.prepend(li);
}

function drawBase() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
  grad.addColorStop(0, '#1a2740');
  grad.addColorStop(1, '#0e1522');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#212f44';
  ctx.fillRect(0, 180, canvas.width, 40);

  ctx.fillStyle = '#203148';
  ctx.fillRect(260, 25, 75, 75);
  ctx.fillStyle = '#2e4669';
  ctx.fillRect(25, 140, 72, 55);

  drawEntity(actor.x, actor.y, actor.color);
  drawEntity(target.x, target.y, target.color);
}

function drawEntity(x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillRect(x - 2, y - 2, 4, 4);
}

function animateMove(from, to, duration = 700) {
  return new Promise((resolve) => {
    const start = performance.now();

    function frame(now) {
      const t = Math.min((now - start) / duration, 1);
      actor.x = from.x + (to.x - from.x) * t;
      actor.y = from.y + (to.y - from.y) * t;
      drawBase();

      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    }

    requestAnimationFrame(frame);
  });
}

function pulseAt(x, y, color) {
  return new Promise((resolve) => {
    const start = performance.now();
    function frame(now) {
      const t = (now - start) / 350;
      drawBase();
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.globalAlpha = Math.max(0, 1 - t);
      ctx.beginPath();
      ctx.arc(x, y, 10 + t * 26, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      if (t < 1) requestAnimationFrame(frame);
      else resolve();
    }
    requestAnimationFrame(frame);
  });
}

async function runCrimeSequence() {
  if (state.energy < 5) {
    addFeed('Not enough energy for crime.', 'danger');
    return;
  }

  setButtons(false);
  addFeed('Crew moving to warehouse...', '');
  await animateMove({ x: 36, y: 166 }, { x: 220, y: 110 });
  await pulseAt(220, 110, '#5cd7ff');

  state.energy -= 5;
  state.cash += 220;
  state.influence += 2;
  renderHud();

  addFeed('+220 cash, +2 influence from warehouse hit.', 'reward');
  await animateMove({ x: 220, y: 110 }, { x: 36, y: 166 }, 600);
  setButtons(true);
}

async function runRaidSequence() {
  if (state.energy < 7) {
    addFeed('Not enough energy for raid.', 'danger');
    return;
  }

  setButtons(false);
  addFeed('Raid team deployed to rival block...');
  await animateMove({ x: 36, y: 166 }, { x: 300, y: 70 }, 800);

  const won = Math.random() > 0.35;
  await pulseAt(300, 70, won ? '#76ffcb' : '#ff6f91');

  state.energy -= 7;
  if (won) {
    state.cash += 320;
    state.influence += 3;
    addFeed('Raid won: +320 cash, +3 influence.', 'reward');
  } else {
    state.cash = Math.max(0, state.cash - 120);
    addFeed('Raid failed: lost 120 cash recovering crew.', 'danger');
  }
  renderHud();

  await animateMove({ x: 300, y: 70 }, { x: 36, y: 166 }, 650);
  setButtons(true);
}

function setButtons(enabled) {
  ui.crimeBtn.disabled = !enabled;
  ui.raidBtn.disabled = !enabled;
  ui.resetBtn.disabled = !enabled;
}

function resetState() {
  Object.assign(state, { cash: 2500, energy: 40, influence: 0 });
  actor.x = 36;
  actor.y = 166;
  feed.innerHTML = '';
  addFeed('Session reset. Ready for next run.');
  renderHud();
  drawBase();
}

ui.crimeBtn.addEventListener('click', runCrimeSequence);
ui.raidBtn.addEventListener('click', runRaidSequence);
ui.resetBtn.addEventListener('click', resetState);

resetState();
