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

    preload() {}

    create() {
        this.cameras.main.setBackgroundColor('#6e3318');
        new GameText(this, this.cameras.main.centerX, this.cameras.main.centerY, 'Mystery Game', {
            fontFamily: 'Special Elite',
            fontSize: '128px',
            color: '#fff',
        }).setOrigin(0.5);

        const BUTTON_SPACING = 200;
        const STARTBUTTON = new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + BUTTON_SPACING,
            300,
            100,
            'Start Game',
            undefined,
            undefined,
            () => {
                this.scene.start('MenuScene');
            },
        );
    }
}
