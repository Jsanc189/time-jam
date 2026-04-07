import './styles/main.css';
import Phaser from 'phaser';
import BootScene from './scenes/Boot.js';

const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  parent: 'game-container',  
  scale:{
    mode:Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene],
  physics: {
    default: 'arcade',
    arcade: { debug: false },
  },
};

const game = new Phaser.Game(config);