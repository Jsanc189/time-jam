/*
    Created by: Jackie Sanchez
    Date: 4/7/2026
        Description: This is the MenuScene class for a Phaser game. 
        It displays the main menu of the game and allows the player to start the game, view credits,
        or go to options menu.
*/

export default class CreditsScene extends Phaser.Scene{
    constructor() {
        super('CreditsScene');
    }
    

    create() {
        this.cameras.main.setBackgroundColor('#6e3318');

        //credits to display in the credits scene
        this.credits = [
            'Producer:\n\nJackie Sanchez',
            'Game Designers:\n\nRaven Cruz\n\nJackie Sanchez',
            'Programmers:\n\nRaven Cruz\n\nJackie Sanchez',
            'Lead Artist:\n\nSunny Lee',
            'Character Artist:\n\nMars',
            'Music Designer:\n\nSimon Blidener',
            'SFX Designer:\n\nSimon Blidener',
            'Special Thanks: '
        ]

        this.currentCreditIndex = 0;
        
        this.creditScrollText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, this.credits[this.currentCreditIndex],
            { 
                fontSize: '48px', 
                fill: '#fff', 
                align: 'center' 
            }).setOrigin(0.5).setAlpha(0);
        
        this.showNextCredit();
        
        
        
        //button to get back to MenuScene
        const BUTTON_SPACING = 100;
        const MENU_BUTTON = this.add.text(this.cameras.main.centerX * 1.5, this.cameras.main.centerY * 1.5 + BUTTON_SPACING, 'Back to Menu', 
            { 
                fontSize: '32px',
                backgroundColor: '#fff', 
                color: '#338de1',
                padding: {x:20 , y: 10} 
            }).setOrigin(0.5).setInteractive();
        
        MENU_BUTTON.on('pointerover', () =>{
            MENU_BUTTON.setStyle({ backgroundColor: '#338de1', color: '#fff' });
        });
        MENU_BUTTON.on('pointerout', () =>{
            MENU_BUTTON.setStyle({ backgroundColor: '#fff', color: '#338de1' });
        });
        MENU_BUTTON.on('pointerdown', () =>{
            this.scene.start('MenuScene');
        });
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
                        }
                    });
                });
            }
        });
    }
}