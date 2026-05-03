/*
    Created by: Jackie Sanchez
    Date: 4/7/2026
        Description: This is the MenuScene class for a Phaser game. 
        It displays the main menu of the game and allows the player to start the game, view credits,
        or go to options menu.
*/

import Button from '../prefabs/Button';
import GameText from '../prefabs/GameText';

export default class CreditsScene extends Phaser.Scene {
    constructor() {
        super('CreditsScene');
    }

    create() {
        this.credits_bg = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'option_credit_bg'
        ).setOrigin(0.5).setScale(1.5);


        //credits to display in the credits scene
        this.credits = [
            'Producer:\n\nWatchOutJackie\n\n',
            'Game Designers:\n\nRaven Ruiz\n\nWatchOutJackie\n\n',
            'Level Designers:\n\nRaven Ruiz\n\nWatchOutJackie\n\n',
            'Lead Artist:\n\nSunnysquid\n\n',
            'Background Artist:\n\nSunnysquid\n\n',
            'Assets Artist:\n\nSunnysquid\n\n',
            'Character Artist:\n\nMarstheluminary\n\n',
            'Music Designer:\n\nSimonBL\n\n',
            'SFX Designer:\n\nSimonBL\n\n\n',
            'UI Designers:\n\nSunnysquid\n\nRaven Ruiz\n\nWatchOutJackie\n\n',
            'Fonts:\n\nCinzel\nDesigned by Astigmatic\n\nUsed under the SIL Open Font License',
            'Special Thanks:\n\nEveryone who supported\n\nthe development of this game!',
        ];

        this.currentCreditIndex = 0;

        this.creditScrollText = new GameText(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.credits[this.currentCreditIndex],
            {
                fontSize: '96px',
                color: '#fff',
                align: 'center',
            },
        )
            .setOrigin(0.5)
            .setAlpha(0);

        this.creditObjects = [];
        this.scrollSpeed = 3;

        this.createCreditBlocks();
        //this.showNextCredit();

        //button to get back to MenuScene
        const BUTTON_SPACING = 450;
        const MENU_BUTTON = new Button(
            this,
            this.cameras.main.centerX * 1.75,
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

    createCreditBlocks() {
        let y = 1000;

        this.credits.forEach((line) => {
            const t = new GameText (
                this,
                this.cameras.main.centerX,
                y,
                line,
                {
                    fontSize: '96px',
                    color: '#fff',
                    align: 'center',
                },
            )
            .setOrigin(0.5)
            this.creditObjects.push(t);
            y += t.height + 100;
        });
        this.lastCredit = this.creditObjects[this.creditObjects.length - 1];

    }

    update() {
        this.creditObjects.forEach(t => {
            t.y -= this.scrollSpeed;
        });

        // When the last credit scrolls off the top, end scene
        if (this.lastCredit.y + this.lastCredit.height < 0) {
            this.scene.start('MenuScene');
        }
    
    }
}
