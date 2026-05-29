function intersects(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function bodyBox(entity) {
  return { x: entity.x, y: entity.y, width: entity.width, height: entity.height };
}

export class CombatSystem {
  constructor() {
    this.playerHitIds = new Set();
    this.enemyHitIds = new Set();
    this.lastMessage = 'Break Giyuu\'s composure with axe pressure. Heavy attacks do the most composure damage.';
  }

  update(player, enemy, elapsed) {
    const playerAttack = player.getAttackBox();
    if (playerAttack) {
      const hitId = `player-${playerAttack.id}`;
      if (!this.playerHitIds.has(hitId) && intersects(playerAttack, bodyBox(enemy))) {
        this.playerHitIds.add(hitId);
        enemy.receiveHit(playerAttack);
        this.lastMessage = playerAttack.type === 'heavy'
          ? 'Heavy chop landed: big composure damage!'
          : 'Light axe swing landed: quick but modest composure damage.';
      }
    }

    const enemyAttack = enemy.getAttackBox();
    if (enemyAttack) {
      const hitId = `giyuu-${enemyAttack.id}`;
      if (!this.enemyHitIds.has(hitId) && intersects(enemyAttack, bodyBox(player))) {
        this.enemyHitIds.add(hitId);
        const direction = enemy.facing;
        const damage = player.receiveDamage(enemyAttack.damage, direction);
        this.lastMessage = player.blocking
          ? `Blocked Giyuu's strike, but still took ${damage} chip damage.`
          : `Giyuu punished the opening for ${damage} damage.`;
      }
    }
  }
}
