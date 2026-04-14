/*
    Created by: Jackie Sanchez
    Date: 4/7/2026
    Description: This is the options menu scene.  This is where the player can adjust the game settings 
    such as audio and controls.
*/

import GameText from '../prefabs/GameText';
import Button from '../prefabs/Button';

export default class OptionsScene extends Phaser.Scene {
    constructor() {
        super('OptionsScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#6e3318');
        const BUTTON_SPACING = 200;
        new GameText(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Mystery Game Options',
            {
                fontSize: '128px',
                color: '#fff',
            },
        ).setOrigin(0.5);
        const MENU_BUTTON = new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + BUTTON_SPACING,
            300,
            100,
            'Back to Menu',
            undefined,
            undefined,
            () => {
                this.scene.start('MenuScene');
            },
        );
    }
}
