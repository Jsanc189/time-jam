/*
    Created by: Jackie Sanchez
    Date: 4/7/2026
    Description: This is the MenuScene class for a Phaser game. 
    It displays the main menu of the game and allows the player to start the game, view credits,
    or go to options menu.
*/

import GameText from '../prefabs/GameText';
import Button from '../prefabs/Button';

export default class MenuScene extends Phaser.Scene {
    constructor() {
        super('MenuScene');
    }

    create() {
        const menu_bg = this.add.image(
            this.cameras.main.centerX, 
            this.cameras.main.centerY,
            'menu_bg'
        ).setOrigin(0.5).setScale(1.5);

        this.audio = this.game.audio;
        if (!this.currentMusic) {
            this.audio.playMusic('mainTheme');
        }

        const STARTY = this.cameras.main.centerY * 1.25;
        const BUTTON_SPACING = 150;

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
                fontSize: '128px',
                color: '#160402',
            },
        ).setOrigin(0.5);

        const PLAY_BUTTON = new Button(
            this,
            this.cameras.main.centerX,
            STARTY,
            300,
            100,
            'Start Game',
            undefined,
            undefined,
            () => {
                this.game.audio.playSFX("gavel");
                this.tweens.add({
                    targets: this.audio.currentMusic,
                    volume: 0,
                    duration: 800,
                    onComplete: () => {
                        this.audio.stopMusic();
                        
                    }
                });
                this.cameras.main.fadeOut(800, 0, 0, 0);   
                this.cameras.main.once('camerafadeoutcomplete', ()=>{
                    this.scene.start('MainScene');
                })             
            },
        );

        const OPTIONS_BUTTON = new Button(
            this,
            this.cameras.main.centerX,
            STARTY + BUTTON_SPACING,
            300,
            100,
            'Settings',
            undefined,
            undefined,
            () => {
                this.game.audio.playSFX("gavel");
                this.scene.start('OptionsScene');
            },
        );

        const CREDITS_BUTTON = new Button(
            this,
            this.cameras.main.centerX,
            STARTY + BUTTON_SPACING * 2,
            300,
            100,
            'Credits',
            undefined,
            undefined,
            () => {
                this.game.audio.playSFX("gavel");
                this.scene.start('CreditsScene');
            },
        );
    }

}
