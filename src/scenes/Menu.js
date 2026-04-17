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
        this.cameras.main.setBackgroundColor('#6e3318');

        const BUTTON_SPACING = 150;
        new GameText(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY - BUTTON_SPACING,
            'Mystery Game Menu',
            {
                fontSize: '128px',
                color: '#fff',
            },
        ).setOrigin(0.5);

        const PLAY_BUTTON = new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            300,
            100,
            'Start Game',
            undefined,
            undefined,
            () => {
                this.scene.start('MainScene');
            },
        );

        const OPTIONS_BUTTON = new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + BUTTON_SPACING,
            300,
            100,
            'Options',
            undefined,
            undefined,
            () => {
                this.scene.start('OptionsScene');
            },
        );

        const CREDITS_BUTTON = new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + BUTTON_SPACING * 2,
            300,
            100,
            'Credits',
            undefined,
            undefined,
            () => {
                this.scene.start('CreditsScene');
            },
        );
    }
}
