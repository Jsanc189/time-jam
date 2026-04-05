import './styles/main.css';
import Phaser from 'phaser';
import BootScene from './scenes/Boot.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  scene: [BootScene],
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
};

const game = new Phaser.Game(config);