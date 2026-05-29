import { ComposureSystem } from '../systems/composureSystem.js';

export class GiyuuController {
  constructor() {
    this.name = 'Giyuu';
    this.maxHp = 160;
    this.hp = this.maxHp;
    this.width = 50;
    this.height = 98;
    this.x = 705;
    this.y = 362;
    this.facing = -1;
    this.state = 'observe';
    this.stateTimer = 1.0;
    this.attack = null;
    this.attackId = 0;
    this.attackUsed = false;
    this.composure = new ComposureSystem(100);
  }

  update(player, arena, dt) {
    this.attack = null;
    this.stateTimer = Math.max(0, this.stateTimer - dt);
    this.facing = player.x + player.width / 2 < this.x + this.width / 2 ? -1 : 1;

    const distance = Math.abs(player.x - this.x);
    if (this.stateTimer === 0) {
      if (this.state === 'slash') {
        this.state = 'recover';
        this.stateTimer = 0.8;
        this.attackUsed = false;
      } else if (distance < 150) {
        this.state = 'slash';
        this.stateTimer = 0.72;
      } else {
        this.state = 'advance';
        this.stateTimer = 0.5;
      }
    }

    if (this.state === 'advance') {
      this.x += this.facing * 82 * dt;
    }

    if (this.state === 'slash' && !this.attackUsed && this.stateTimer <= 0.32) {
      this.attackUsed = true;
      this.attackId += 1;
      this.attack = { damage: 16, range: 118, width: 125, height: 58 };
    }

    this.x = Math.max(arena.left, Math.min(arena.right - this.width, this.x));
  }

  getAttackBox() {
    if (!this.attack) return null;
    return {
      x: this.facing > 0 ? this.x + this.width : this.x - this.attack.range,
      y: this.y + 20,
      width: this.attack.width,
      height: this.attack.height,
      damage: this.attack.damage,
      id: this.attackId,
    };
  }

  receiveHit(hit) {
    this.hp = Math.max(0, this.hp - hit.damage);
    this.composure.applyDamage(hit.composureDamage);
    this.state = 'recover';
    this.stateTimer = 0.35;
  }
}
