/* Created by: Jackie Sanchez
   Date: 4/7/2026
   Description: This is the BootScene class for a Phaser game. 
   It displays a loading progress bar and loads assets for the game
*/
import payerSheet from('../assets/images/player.png');
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
    


  }

  create() {
    this.scene.start('LoadScene');
  }
}