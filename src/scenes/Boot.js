import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
    this.colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
    this.currentColor = 0;
  }

  create() {
    this.cameras.main.setBackgroundColor(this.colors[this.currentColor]);

    // Change background color every second
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.currentColor = (this.currentColor + 1) % this.colors.length;
        this.cameras.main.setBackgroundColor(this.colors[this.currentColor]);
      },
      loop: true,
    });
  }
}