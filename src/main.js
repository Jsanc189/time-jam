import './styles/main.css';
import Phaser from 'phaser';
import BootScene from './scenes/Boot.js';
import MenuScene from './scenes/Menu.js';
import CreditsScene from './scenes/Credits.js';
import LoadScene from './scenes/Load.js';
import MainScene from './scenes/Main.js';
import MapScene from './scenes/Map.js';
import OptionsScene from './scenes/Options.js';
import HatchRoomScene from './scenes/HatchRoom.js';

const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  parent: 'game-container',  
  scale:{
    mode:Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, MenuScene, CreditsScene, LoadScene, MainScene, MapScene, HatchRoomScene, OptionsScene],
  physics: {
    default: 'arcade',
    arcade: { 
      debug: false,
      debugShowBody: true,
      debugShowStaticBody: true
    },
  },
};

const game = new Phaser.Game(config);
