/* Created by: Jackie Sanchez
   Date: 4/7/2026
   Description: This is the BootScene class for a Phaser game. 
   It displays a loading progress bar and loads assets for the game

   Edited by: Raven Ruiz
   Date: 4/9/2026
   Description: Added JSON loading and lexicon creation, with global storage.
*/

import Phaser from 'phaser';
import Grammar from '../prefabs/Grammars';


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
    // grammar filler JSONs
    this.load.json('crimeData', 'src/assets/JSON/crime.json');
    this.load.json('characterData', 'src/assets/JSON/characters.json');
    this.load.json('motiveData', 'src/assets/JSON/motives.json');
    this.load.json('objectData', 'src/assets/JSON/objects.json');
    this.load.json('locationData', 'src/assets/JSON/locations.json');

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
  }

  create() {
    // merge all JSON data into a single lexicon dictionary
    const lexicon = {
      ...this.cache.json.get('crimeData'),
      ...this.cache.json.get('characterData'),
      ...this.cache.json.get('motiveData'),
      ...this.cache.json.get('objectData'),
      ...this.cache.json.get('locationData'),
    };

    // store merged data on registry for global access
    this.registry.set('grammar', new Grammar(lexicon));

    this.scene.start('LoadScene');
  }
}