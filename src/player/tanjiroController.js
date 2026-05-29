export class TanjiroController {
  constructor() {
    this.name = 'Tanjiro';
    this.maxHp = 90;
    this.hp = this.maxHp;
    this.width = 46;
    this.height = 92;
    this.x = 180;
    this.y = 368;
    this.vx = 0;
    this.vy = 0;
    this.facing = 1;
    this.grounded = true;
    this.state = 'idle';
    this.stateTimer = 0;
    this.attack = null;
    this.attackId = 0;
    this.blocking = false;
    this.damageTaken = 0;
  }

  update(input, arena, dt) {
    this.stateTimer = Math.max(0, this.stateTimer - dt);
    this.attack = null;
    this.blocking = false;

    if (this.stateTimer === 0 && ['light', 'heavy', 'dodge', 'hitstun'].includes(this.state)) this.state = 'idle';

    const canAct = !['light', 'heavy', 'dodge', 'hitstun'].includes(this.state);
    const left = input.isDown('KeyA', 'ArrowLeft');
    const right = input.isDown('KeyD', 'ArrowRight');

    if (canAct) {
      this.vx = 0;
      if (left) this.vx = -185;
      if (right) this.vx = 185;
      if (this.vx !== 0) this.facing = Math.sign(this.vx);

      if (input.wasPressed('KeyW', 'ArrowUp', 'Space') && this.grounded) {
        this.vy = -520;
        this.grounded = false;
      }

      if (input.wasPressed('ShiftLeft', 'ShiftRight')) {
        this.state = 'dodge';
        this.stateTimer = 0.28;
        this.vx = this.facing * 330;
      } else if (input.isDown('KeyL')) {
        this.state = 'block';
        this.blocking = true;
        this.vx *= 0.35;
      } else if (input.wasPressed('KeyJ')) {
        this.startAttack('light');
      } else if (input.wasPressed('KeyK')) {
        this.startAttack('heavy');
      } else if (this.vx !== 0) {
        this.state = 'move';
      } else {
        this.state = 'idle';
      }
    }

    if (this.state === 'light' && this.stateTimer <= 0.18 && this.stateTimer > 0.06) {
      this.attack = { type: 'light', damage: 4, composureDamage: 13, range: 72, width: 78, height: 52 };
    }
    if (this.state === 'heavy' && this.stateTimer <= 0.24 && this.stateTimer > 0.08) {
      this.attack = { type: 'heavy', damage: 7, composureDamage: 26, range: 82, width: 88, height: 68 };
    }

    this.vy += arena.gravity * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if (this.y >= arena.floorY - this.height) {
      this.y = arena.floorY - this.height;
      this.vy = 0;
      this.grounded = true;
    }

    this.x = Math.max(arena.left, Math.min(arena.right - this.width, this.x));
  }

  startAttack(type) {
    this.attackId += 1;
    this.state = type;
    this.stateTimer = type === 'light' ? 0.34 : 0.56;
    this.vx = type === 'light' ? this.facing * 30 : this.facing * 10;
  }

  getAttackBox() {
    if (!this.attack) return null;
    return {
      x: this.facing > 0 ? this.x + this.width : this.x - this.attack.range,
      y: this.y + 18,
      width: this.attack.width,
      height: this.attack.height,
      damage: this.attack.damage,
      composureDamage: this.attack.composureDamage,
      type: this.attack.type,
      id: this.attackId,
    };
  }

  receiveDamage(amount, knockbackDirection) {
    const finalDamage = this.blocking ? Math.ceil(amount * 0.35) : amount;
    this.hp = Math.max(0, this.hp - finalDamage);
    this.damageTaken += finalDamage;
    this.state = 'hitstun';
    this.stateTimer = this.blocking ? 0.12 : 0.32;
    this.vx = knockbackDirection * (this.blocking ? 80 : 210);
    return finalDamage;
  }
}
