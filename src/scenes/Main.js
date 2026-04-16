/*
    Created by: Jackie Sanchez
    Date: 4/7/2026
    Description: This is the Main play scene.  This is where the main game will be played.  
    
*/

import GameText from '../prefabs/GameText';
import Button from '../prefabs/Button';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#6e3318');
        //button to get back to MenuScene
        const BUTTON_SPACING = 150;
        const TITLE_TEXT = new GameText(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY - BUTTON_SPACING,
            'Main Game Scene',
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
        const MAP_BUTTON = new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + BUTTON_SPACING * 2,
            300,
            100,
            'Go to Mind Palace',
            undefined,
            undefined,
            () => {
                this.scene.start('MapScene');
            },
        );

    }

    update() {}
}
