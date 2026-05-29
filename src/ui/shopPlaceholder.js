const NEZUKO_COST = 50;

export class ShopPlaceholder {
  constructor(element) {
    this.element = element;
  }

  show(coins) {
    const unlocked = coins >= NEZUKO_COST;
    this.element.classList.remove('hidden');
    this.element.innerHTML = `
      <p class="eyebrow">Character Shop Placeholder</p>
      <h2>Story Character Unlocks</h2>
      <div class="shop-card">
        <div>
          <h3>Nezuko</h3>
          <p>Important story character. Gameplay is intentionally not implemented yet.</p>
          <p><strong>Cost:</strong> ${NEZUKO_COST} coins</p>
        </div>
        <strong class="${unlocked ? 'unlocked' : 'locked'}">${unlocked ? 'Unlockable placeholder' : 'Locked placeholder'}</strong>
      </div>
    `;
  }

  hide() {
    this.element.classList.add('hidden');
  }
}
