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
import AudioManager from '../audio/AudioManager';


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
    

    //music
    this.load.audio('testMusic', 'assets/audio/music/boss_time_15.mp3');
    
    //SFX
    this.load.audio('testVolume', 'assets/audio/sfx/select.wav');
    this.load.audio('clockCalm', 'assets/audio/sfx/sfx_clock-calm.mp3');
    this.load.audio('clockUrgent', 'assets/audio/sfx/sfx_clock-urgent.wav');
    this.load.audio('dialogue', 'assets/audio/sfx/sfx_dialogue.mp3');
    this.load.audio('gavel', 'assets/audio/sfx/sfx_gavel.mp3');
    this.load.audio('hatch', 'assets/audio/sfx/sfx_hatch.mp3');
    this.load.audio('interact', 'assets/audio/sfx/sfx_interact.mp3');
    this.load.audio('notebook', 'assets/audio/sfx/sfx_notebook.mp3');
    this.load.audio('rope', 'assets/audio/sfx/sfx_rope.mp3');


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
    
    //initialize audio
    this.game.audio = new AudioManager(this);
    this.game.audio.playMusic('testMusic');  

    this.scene.start('LoadScene');
  }
}