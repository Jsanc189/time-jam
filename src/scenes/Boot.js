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
    this.load.json('characterData', 'assets/JSON/characters.json');
    this.load.json('motiveData', 'assets/JSON/motives.json');
    this.load.json('objectData', 'assets/JSON/objects.json');
    this.load.json('locationData', 'assets/JSON/locations.json');

    //player
    this.load.spritesheet('playerSheet', 'assets/images/player.png', {
      frameWidth: 500,
      frameHeight: 832
    });

    //clock
    this.load.image('clock', 'assets/images/clock_face.png');

    //tile floors
    this.load.image('libraryFloor', 'assets/images/libraryFloor.png');
    this.load.image('tileFloor', 'assets/images/tileFloor.png');
    this.load.spritesheet('floorTiles', 'assets/images/floor_tiles.png', {
      frameWidth: 256,
      frameHeight: 256
    });

    //Backgrounds
    this.load.image('courtroom_bg', 'assets/images/courtroom_bg.png');
    this.load.image('option_credit_bg', 'assets/images/options-credits_bg.png');
    this.load.image('menu_bg', 'assets/images/main_menu_bg.png');
    this.load.image('text_bg', 'assets/images/text_bg.png');
    this.load.image('text_bg2', 'assets/images/text_bg2.png');

    //NPC assets
    this.load.image('fairy_out', 'assets/images/fairy_outline.png');
    this.load.image('goblin_out', 'assets/images/goblin_outline.png');
    this.load.image('human_out', 'assets/images/human_outline.png');
    this.load.image('orc_out', 'assets/images/orc_outline.png');
    this.load.image('elf_out', 'assets/images/elf_outline.png'); 
    this.load.image('judge', 'assets/images/judge.png');

    //object assets
    this.load.spritesheet('stools', 'assets/images/stools.png',{
      frameWidth: 256,
      frameHeight: 256
    });
    this.load.spritesheet('chair', 'assets/images/chair.png',{
        frameWidth: 256,
        frameHeight: 384
    });
    this.load.spritesheet('lamps', 'assets/images/lamps.png', {
      frameWidth: 256,
      frameHeight: 256
    });
    this.load.spritesheet('tables', 'assets/images/tables.png',{
      frameWidth: 512,
      frameHeight: 325
    });
    this.load.spritesheet('rope_hatch', 'assets/images/travel_objects.png', {
      frameWidth: 256,
      frameHeight: 454
    });
    this.load.spritesheet('bookshelves', 'assets/images/bookShelves.png',{
      frameWidth: 512,
      frameHeigh: 512
    })
    this.load.image('judge_stand', 'assets/images/judge_stand.png');
    this.load.image('jury_front', 'assets/images/jury_front.png');
    this.load.image('jury_back', 'assets/images/jury_back.png')


    //ui assets
    this.load.image('paper1', 'assets/images/paper_1.png');
    this.load.image('paper2', 'assets/images/paper_2.png');

    //music
    this.load.audio('mainTheme', 'assets/audio/music/mystery-game_main-theme.mp3');
    this.load.audio('mindPalace', 'assets/audio/music/mind-palace-theme.mp3');
    
    //SFX
    //this.load.audio('testVolume', 'assets/audio/sfx/select.wav');
    this.load.audio('clockCalm', 'assets/audio/sfx/sfx_clock-calm.mp3');
    this.load.audio('clockUrgent', 'assets/audio/sfx/sfx_clock-urgent.wav');
    this.load.audio('dialogue', 'assets/audio/sfx/sfx_dialogue.mp3');
    this.load.audio('gavel', 'assets/audio/sfx/sfx_gavel.mp3');
    this.load.audio('hatch', 'assets/audio/sfx/sfx_hatch.mp3');
    this.load.audio('interact', 'assets/audio/sfx/sfx_interact.mp3');
    this.load.audio('notebook', 'assets/audio/sfx/sfx_notebook.mp3');
    this.load.audio('rope', 'assets/audio/sfx/sfx_rope.mp3');
    this.load.audio('footsteps', 'assets/audio/sfx/footsteps.mp3');


  }

  create() {
    // merge all JSON data into a single lexicon dictionary
    const lexicon = {
      ...this.cache.json.get('characterData'),
      ...this.cache.json.get('motiveData'),
      ...this.cache.json.get('objectData'),
      ...this.cache.json.get('locationData'),
    };

    // store merged data on registry for global access
    this.registry.set('grammar', new Grammar(lexicon));
    
    //initialize audio
    this.game.audio = new AudioManager(this);
    this.game.audio.playMusic('mainTheme');  

    this.scene.start('LoadScene');
  }
  
}