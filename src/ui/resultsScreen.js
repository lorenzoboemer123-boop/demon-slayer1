export class ResultsScreen {
  constructor(element, onRestart, onShop) {
    this.element = element;
    this.onRestart = onRestart;
    this.onShop = onShop;
  }

  show(result) {
    this.element.classList.remove('hidden');
    this.element.innerHTML = `
      <p class="eyebrow">Tutorial Fight Result</p>
      <h2 class="result-rank">${result.rank}</h2>
      <p>${result.won ? 'Giyuu acknowledged your pressure after one composure break.' : 'Tanjiro failed to break Giyuu\'s composure.'}</p>
      <ul>
        <li><strong>Clear time:</strong> ${result.clearTime.toFixed(1)}s</li>
        <li><strong>Damage taken:</strong> ${result.damageTaken}</li>
        <li><strong>Coins earned:</strong> ${result.coins}</li>
      </ul>
      <button id="retryButton">Retry Tutorial</button>
      <button id="shopButton" class="secondary">Open Character Shop Placeholder</button>
    `;
    this.element.querySelector('#retryButton').addEventListener('click', this.onRestart);
    this.element.querySelector('#shopButton').addEventListener('click', () => this.onShop(result.coins));
  }

  hide() {
    this.element.classList.add('hidden');
  }
}
