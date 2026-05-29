import { InputController } from './core/input.js';
import { TanjiroController } from './player/tanjiroController.js';
import { GiyuuController } from './enemy/giyuuController.js';
import { CombatSystem } from './systems/combatSystem.js';
import { DIFFICULTIES } from './systems/difficultySettings.js';
import { calculateRank } from './systems/rankingSystem.js';
import { ResultsScreen } from './ui/resultsScreen.js';
import { ShopPlaceholder } from './ui/shopPlaceholder.js';

const canvas = document.querySelector('#gameCanvas');
const ctx = canvas.getContext('2d');
const input = new InputController();
const arena = { left: 42, right: canvas.width - 42, floorY: 460, gravity: 1450 };

const ui = {
  playerHp: document.querySelector('#playerHp'),
  playerHpText: document.querySelector('#playerHpText'),
  enemyHp: document.querySelector('#enemyHp'),
  enemyHpText: document.querySelector('#enemyHpText'),
  enemyComposure: document.querySelector('#enemyComposure'),
  enemyComposureText: document.querySelector('#enemyComposureText'),
  timerText: document.querySelector('#timerText'),
  damageTakenText: document.querySelector('#damageTakenText'),
  difficultySelect: document.querySelector('#difficultySelect'),
  difficultyDescription: document.querySelector('#difficultyDescription'),
};

let player;
let enemy;
let combat;
let elapsed;
let finished;
let activeDifficulty = 'medium';
let lastTime = performance.now();

const shop = new ShopPlaceholder(document.querySelector('#shopScreen'));
const results = new ResultsScreen(document.querySelector('#resultsScreen'), restartFight, (coins) => shop.show(coins));

function setupDifficultySelect() {
  Object.entries(DIFFICULTIES).forEach(([key, difficulty]) => {
    const option = document.createElement('option');
    option.value = key;
    option.textContent = difficulty.label;
    ui.difficultySelect.append(option);
  });
  ui.difficultySelect.value = activeDifficulty;
  ui.difficultyDescription.textContent = DIFFICULTIES[activeDifficulty].description;
  ui.difficultySelect.addEventListener('change', () => {
    activeDifficulty = ui.difficultySelect.value;
    ui.difficultyDescription.textContent = DIFFICULTIES[activeDifficulty].description;
    restartFight();
  });
}

function restartFight() {
  player = new TanjiroController();
  enemy = new GiyuuController();
  combat = new CombatSystem();
  elapsed = 0;
  finished = false;
  results.hide();
  shop.hide();
}

function update(dt) {
  if (input.wasPressed('KeyR')) restartFight();
  if (finished) return;

  elapsed += dt;
  player.update(input, arena, dt);
  enemy.update(player, arena, dt);
  combat.update(player, enemy, elapsed);

  if (enemy.composure.wasBroken) finishFight(true);
  if (player.hp <= 0) finishFight(false);
}

function finishFight(won) {
  finished = true;
  const rankResult = calculateRank({ won, clearTime: elapsed, damageTaken: player.damageTaken });
  results.show({ won, clearTime: elapsed, damageTaken: player.damageTaken, ...rankResult });
}

function drawFighter(entity, palette) {
  ctx.fillStyle = palette.shadow;
  ctx.beginPath();
  ctx.ellipse(entity.x + entity.width / 2, arena.floorY + 6, entity.width * 0.7, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = palette.body;
  ctx.fillRect(entity.x, entity.y, entity.width, entity.height);
  ctx.fillStyle = palette.head;
  ctx.fillRect(entity.x + 8, entity.y - 18, entity.width - 16, 20);

  ctx.fillStyle = palette.weapon;
  const weaponX = entity.facing > 0 ? entity.x + entity.width - 4 : entity.x - 22;
  ctx.fillRect(weaponX, entity.y + 28, 26, 8);
}

function drawAttackBox(box, color) {
  if (!box) return;
  ctx.fillStyle = color;
  ctx.fillRect(box.x, box.y, box.width, box.height);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, '#202a3b');
  gradient.addColorStop(1, '#10141c');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#263245';
  ctx.fillRect(0, arena.floorY, canvas.width, canvas.height - arena.floorY);
  ctx.fillStyle = '#3e4b63';
  ctx.fillRect(arena.left, arena.floorY, arena.right - arena.left, 8);

  drawAttackBox(player.getAttackBox(), 'rgba(255, 209, 102, 0.28)');
  drawAttackBox(enemy.getAttackBox(), 'rgba(123, 215, 255, 0.22)');
  drawFighter(player, { body: '#324f3c', head: '#f2c6a5', weapon: '#d7dee8', shadow: 'rgba(0,0,0,.28)' });
  drawFighter(enemy, { body: '#203d66', head: '#ead3ba', weapon: '#9ee8ff', shadow: 'rgba(0,0,0,.3)' });

  ctx.fillStyle = '#f6efe5';
  ctx.font = '18px system-ui';
  ctx.fillText(`Tanjiro: ${player.state}`, 56, 72);
  ctx.fillText(`Giyuu: ${enemy.state}`, 740, 72);
  ctx.fillStyle = '#b9c1cf';
  ctx.fillText(combat.lastMessage, 56, 506);

  if (finished) {
    ctx.fillStyle = 'rgba(0,0,0,.42)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffd166';
    ctx.font = '30px system-ui';
    ctx.fillText(enemy.composure.wasBroken ? 'Composure Break!' : 'Tutorial Failed', 365, 250);
  }
}

function syncHud() {
  ui.playerHp.value = (player.hp / player.maxHp) * 100;
  ui.playerHpText.textContent = `${player.hp}/${player.maxHp}`;
  ui.enemyHp.value = (enemy.hp / enemy.maxHp) * 100;
  ui.enemyHpText.textContent = `${enemy.hp}/${enemy.maxHp}`;
  ui.enemyComposure.value = enemy.composure.percent;
  ui.enemyComposureText.textContent = `${Math.ceil(enemy.composure.current)}/${enemy.composure.max}`;
  ui.timerText.textContent = `${elapsed.toFixed(1)}s`;
  ui.damageTakenText.textContent = player.damageTaken;
}

function loop(now) {
  const dt = Math.min(0.033, (now - lastTime) / 1000);
  lastTime = now;
  update(dt);
  syncHud();
  draw();
  input.endFrame();
  requestAnimationFrame(loop);
}

setupDifficultySelect();
restartFight();
requestAnimationFrame(loop);
