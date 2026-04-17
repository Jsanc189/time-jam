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
        this.cameras.main.setBackgroundColor('#6e3318');

        //credits to display in the credits scene
        this.credits = [
            'Producer:\n\nWatchOutJackie',
            'Game Designers:\n\nRaven Ruiz\n\nWatchOutJackie',
            'Level Designers:\n\nRaven Ruiz\n\nWatchOutJackie',
            'Lead Artist:\n\nSunnysquid',
            'Background Artist:\n\nSunnysquid',
            'Assets Artist:\n\nSunnysquid',
            'Character Artist:\n\nMarstheluminary',
            'Music Designer:\n\nSimon Blidener',
            'SFX Designer:\n\nSimon Blidener',
            'UI Designer:\n\nSunnysquid',
            'Fonts:\n\nCinzel\nDesigned by Astigmatic\n\nUsed under the SIL Open Font License',
            'Special Thanks:\n\nEveryone who supported the development of this game!',
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

        this.showNextCredit();

        //button to get back to MenuScene
        const BUTTON_SPACING = 450;
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

    showNextCredit() {
        //go back to menu scene after all credits have been shown
        if (this.currentCreditIndex >= this.credits.length) {
            this.scene.start('MenuScene');
            return;
        }

        const text = this.credits[this.currentCreditIndex];
        this.creditScrollText.setText(text);

        this.tweens.add({
            targets: this.creditScrollText,
            alpha: 1,
            duration: 2000,
            onComplete: () => {
                this.time.delayedCall(2000, () => {
                    this.tweens.add({
                        targets: this.creditScrollText,
                        alpha: 0,
                        duration: 2000,
                        onComplete: () => {
                            this.currentCreditIndex++;
                            this.showNextCredit();
                        },
                    });
                });
            },
        });
    }
}
