/* Created by: Jackie Sanchez
   Date: 4/7/2026
   Description: This is the BootScene class for a Phaser game. 
   It displays a loading progress bar and loads assets for the game
*/

import Phaser from 'phaser';


export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    let progressBar = this.add.graphics();
    this.load.on('progress', (value) =>{
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * value, 50);
    })

    this.load.on('Complete', ()=>{
      progressBar.destroy();
    })

    //space to load assets and animations
    //player
    this.load.spritesheet('playerSheet', 'assets/images/player.png', {
      frameWidth: 512,
      frameHeight: 832
    });

    //clock
    this.load.image('clock', 'assets/images/clockFace.png');

    //tile floors
    this.load.image('libraryFloor', 'assets/images/libraryFloor.png');
    this.load.image('tileFloor', 'assets/images/tileFloor.png');
    
    //SFX
    this.load.audio('testVolume', 'assets/audio/select.wav');
    this.load.audio('clockCalm', 'assets/audio/sfx_clock-calm.mp3');
    this.load.audio('clockUrgent', 'assets/audio/sfx_clock-urgent.wav');
    this.load.audio('dialogue', 'assets/audio/sfx_dialogue.mp3');
    this.load.audio('gavel', 'assets/audio/sfx_gavel.mp3');
    this.load.audio('hatch', 'assets/audio/sfx_hatch.mp3');
    this.load.audio('interact', 'assets/audio/sfx_interact.mp3');
    this.load.audio('notebook', 'assets/audio/sfx_notebook.mp3');
    this.load.audio('rope', 'assets/audio/sfx_rope.mp3');


  }

  create() {
    this.scene.start('LoadScene');
  }
}