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
        //button to get back to MenuScene
        const BUTTON_SPACING = 100;
        const TITLE_TEXT = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Credits',
            { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        const MENU_BUTTON = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + BUTTON_SPACING, 'Back to Menu', 
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
}