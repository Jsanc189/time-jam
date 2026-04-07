/*
    Created by: Jackie Sanchez
    Date: 4/7/2026
    Description: This is the MenuScene class for a Phaser game. 
    It displays the main menu of the game and allows the player to start the game, view credits,
    or go to options menu.
*/

export default class MenuScene extends Phaser.Scene{
    constructor() {
        super('MenuScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#6e3318');

        const BUTTON_SPACING = 100;
        this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Mystery Game', 
            { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);

             const PLAY_BUTTON = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + BUTTON_SPACING, 'Start Game', 
            { 
                fontSize: '32px',
                backgroundColor: '#fff', 
                color: '#338de1',
                padding: {x:20 , y: 10} 
            }).setOrigin(0.5).setInteractive();

        PLAY_BUTTON.on('pointerover', () =>{
            PLAY_BUTTON.setStyle({ backgroundColor: '#338de1', color: '#fff' });
        });
        PLAY_BUTTON.on('pointerout', () =>{
            PLAY_BUTTON.setStyle({ backgroundColor: '#fff', color: '#338de1' });
        });
        PLAY_BUTTON.on('pointerdown', () =>{
            this.scene.start('MainScene');
        });

        const OPTIONS_BUTTON = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + BUTTON_SPACING * 2, 'Options', 
            { 
                fontSize: '32px',
                backgroundColor: '#fff', 
                color: '#338de1',
                padding: {x:20 , y: 10} 
            }).setOrigin(0.5).setInteractive();

        OPTIONS_BUTTON.on('pointerover', () =>{
            OPTIONS_BUTTON.setStyle({ backgroundColor: '#338de1', color: '#fff' });
        });
        OPTIONS_BUTTON.on('pointerout', () =>{
            OPTIONS_BUTTON.setStyle({ backgroundColor: '#fff', color: '#338de1' });
        });
        OPTIONS_BUTTON.on('pointerdown', () =>{
            this.scene.start('OptionsScene');
        });

        const CREDITS_BUTTON = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + BUTTON_SPACING * 3, 'Credits',
            { 
                fontSize: '32px',
                backgroundColor: '#fff', 
                color: '#338de1',
                padding: {x:20 , y: 10} 
            }).setOrigin(0.5).setInteractive();

        CREDITS_BUTTON.on('pointerover', () =>{
            CREDITS_BUTTON.setStyle({ backgroundColor: '#338de1', color: '#fff' });
        });
        CREDITS_BUTTON.on('pointerout', () =>{
            CREDITS_BUTTON.setStyle({ backgroundColor: '#fff', color: '#338de1' });
        });
        CREDITS_BUTTON.on('pointerdown', () =>{
            this.scene.start('CreditsScene');
        });

    }

}