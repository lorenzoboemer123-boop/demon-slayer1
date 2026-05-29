export class ComposureSystem {
  constructor(maxComposure) {
    this.max = maxComposure;
    this.current = maxComposure;
    this.wasBroken = false;
  }

  applyDamage(amount) {
    if (this.wasBroken) return;
    this.current = Math.max(0, this.current - amount);
    this.wasBroken = this.current <= 0;
  }

  get percent() {
    return (this.current / this.max) * 100;
  }
}
