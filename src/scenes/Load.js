/*
    Created by: Jackie Sanchez
    Date: 4/7/2026
    Description: This is the Load Scene class for a Phaser game to allow the 
    audio to load before the game starts.  It displays a the Title and Start button.
*/
import GameText from '../prefabs/GameText';
import Button from '../prefabs/Button';

export default class LoadScene extends Phaser.Scene {
    constructor() {
        super('LoadScene');
    }

    preload() {
        
    }

    create() {
        const load_bg = this.add.image(
            this.cameras.main.centerX, 
            this.cameras.main.centerY,
            'menu_bg'
        ).setOrigin(0.5).setScale(1.5);

        //title
        this.text_bg = this.add.image(
            this.cameras.main.centerX, 
            this.cameras.main.centerY * 1.15,
            'text_bg'
        ).setOrigin(0.5).setScale(1.54);

        new GameText(
            this, 
            this.cameras.main.centerX, 
            this.cameras.main.centerY * 0.75, 
            'Mind Palace:\nRunning Out of Time', 
            {
            fontFamily: 'Special Elite',
            fontSize: '128px',
            color: '#160402',
            }).setOrigin(0.5);

        const BUTTON_SPACING = 200;
        const STARTBUTTON = new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY * 1.25,
            300,
            100,
            'Start',
            undefined,
            undefined,
            () => {
                this.scene.start('MenuScene');
                this.game.audio.playSFX("gavel");
            },
        ).setOrigin(0.5);

                //Player animation
        this.anims.create({
            key: 'playerIdle',
            frames: this.anims.generateFrameNumbers('playerSheet', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: -1,
        });
        this.anims.create({
            key: 'playerWalkDown',
            frames: this.anims.generateFrameNames('playerSheet', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1,
        });
        this.anims.create({
            key: 'playerWalkUp',
            frames: this.anims.generateFrameNames('playerSheet', { start: 4, end:  7 }),
            frameRate: 4,
            repeat: -1,
        });
        this.anims.create({
            key: 'playerWalkRight',
            frames: this.anims.generateFrameNames('playerSheet', { start: 8, end: 11 }),
            frameRate: 4,
            repeat: -1,
        });
        this.anims.create({
            key: 'playerWalkLeft',
            frames: this.anims.generateFrameNames('playerSheet', { start: 12, end: 15 }),
            frameRate: 4,
            repeat: -1,
        });
        

    }
}
