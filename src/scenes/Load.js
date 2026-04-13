/*
    Created by: Jackie Sanchez
    Date: 4/7/2026
    Description: This is the Load Scene class for a Phaser game to allow the 
    audio to load before the game starts.  It displays a the Title and Start button.
*/
import GameText from "../prefabs/GameText";

export default class LoadScene extends Phaser.Scene{
    constructor() {
        super('LoadScene');
    }

    preload() {
        
    }
    
    create() {
        this.cameras.main.setBackgroundColor('#6e3318');
        new GameText(this, this.cameras.main.centerX, this.cameras.main.centerY, 'Mystery Game', {
            fontFamily: 'Special Elite',
            fontSize: '128px',
            color: '#fff'
        }).setOrigin(0.5);
        
        
        const BUTTON_SPACING = 200;
        const START_BUTTON = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + BUTTON_SPACING, 'Start Game', 
            { 
                fontFamily: 'Special Elite',
                fontSize: '64px',
                backgroundColor: '#fff', 
                color: '#338de1',
                padding: {x:20 , y: 10} 
            }).setOrigin(0.5).setInteractive();

        START_BUTTON.on('pointerover', () =>{
            START_BUTTON.setStyle({ backgroundColor: '#338de1', color: '#fff' });
        });
        START_BUTTON.on('pointerout', () =>{
            START_BUTTON.setStyle({ backgroundColor: '#fff', color: '#338de1' });
        });
        START_BUTTON.on('pointerdown', () =>{
            this.scene.start('MenuScene');
        });
    }
}