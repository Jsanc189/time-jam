/*
    Created by: Jackie Sanchez
    Date: 4/7/2026
    Description: This is the map scene.  This is where the Mindpalace map will be displayed.  The
    player will be ablt to navigate their mind palace and interact with objects to learn more about the 
    story and progress through the game.
*/

export default class MapScene extends Phaser.Scene{
    constructor() {
        super('MapScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#6e3318');
        //button to get back to MainScene
        const BUTTON_SPACING = 100;
        const TITLE_TEXT = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - BUTTON_SPACING, 'Mind Palace Map',
            {
                fontSize: '32px',
                fill: '#fff'
            }).setOrigin(0.5);
        const MAIN_BUTTON = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + BUTTON_SPACING, 'Back to Main', 
            { 
                fontSize: '32px',
                backgroundColor: '#fff', 
                color: '#338de1',
                padding: {x:20 , y: 10} 
            }).setOrigin(0.5).setInteractive();

        MAIN_BUTTON.on('pointerover', () =>{
            MAIN_BUTTON.setStyle({ backgroundColor: '#338de1', color: '#fff' });
        });
        MAIN_BUTTON.on('pointerout', () =>{
            MAIN_BUTTON.setStyle({ backgroundColor: '#fff', color: '#338de1' });
        });
        MAIN_BUTTON.on('pointerdown', () =>{
            this.scene.start('MainScene');
        });
    }
    
}