/*
    Created by: Jackie Sanchez
    Date: 4/7/2026
    Description: This is the Load Scene class for a Phaser game to allow the 
    audio to load before the game starts.  It displays a the Title and Start button.
*/

export default class LoadScene extends Phaser.Scene{
    constructor() {
        super('LoadScene');
    }
    
    create() {
        this.cameras.main.setBackgroundColor('#6e3318');
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Mystery Game', 
            { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        
        const START_BUTTON = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, 'Start Game', 
            { 
                fontSize: '32px',
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