/*
    Created by: Jackie Sanchez
    Date: 4/7/2026
    Description: This is the options menu scene.  This is where the player can adjust the game settings 
    such as audio and controls.
*/

export default class OptionsScene extends Phaser.Scene{
    constructor() {
        super('OptionsScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#6e3318');
        const BUTTON_SPACING = 100;
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Mystery Game', 
            { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        //button to get back to MenuScene
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