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

        // const MENU_BUTTON = this.add
        //     .text(this.cameras.main.centerX, this.cameras.main.centerY, 'Back to Menu', {
        //         fontSize: '64px',
        //         backgroundColor: '#fff',
        //         color: '#338de1',
        //         padding: { x: 20, y: 10 },
        //     })
        //     .setOrigin(0.5)
        //     .setInteractive();

        const MENU_BUTTON = new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            300,
            100,
            'Back to Menu',
            undefined,
            undefined,
            () => {
                this.scene.start('MenuScene');
            },
        );

        // MENU_BUTTON.on('pointerover', () => {
        //     MENU_BUTTON.setStyle({ backgroundColor: '#338de1', color: '#fff' });
        // });
        // MENU_BUTTON.on('pointerout', () => {
        //     MENU_BUTTON.setStyle({ backgroundColor: '#fff', color: '#338de1' });
        // });
        // MENU_BUTTON.on('pointerdown', () => {
        //     this.scene.start('MenuScene');
        // });

        const MAP_BUTTON = this.add
            .text(
                this.cameras.main.centerX,
                this.cameras.main.centerY + BUTTON_SPACING,
                'Go to Mind Palace',
                {
                    fontSize: '64px',
                    backgroundColor: '#fff',
                    color: '#338de1',
                    padding: { x: 20, y: 10 },
                },
            )
            .setOrigin(0.5)
            .setInteractive();

        MAP_BUTTON.on('pointerover', () => {
            MAP_BUTTON.setStyle({ backgroundColor: '#338de1', color: '#fff' });
        });
        MAP_BUTTON.on('pointerout', () => {
            MAP_BUTTON.setStyle({ backgroundColor: '#fff', color: '#338de1' });
        });
        MAP_BUTTON.on('pointerdown', () => {
            this.scene.start('MapScene');
        });
    }

    update() {}
}
