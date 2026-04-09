/*
    Created by: Jackie Sanchez
    Date Created: 4/7/2026
    Updated by: Jackie Sanchez
    Updated: 4/8/2026
    Description: This is the map scene.  This is where the Mindpalace map will be displayed.  The
    player will be ablt to navigate their mind palace and interact with objects to learn more about the 
    story and progress through the game.
*/

import GameText from "../prefabs/GameText";
import Player from "../prefabs/Player";

export default class MapScene extends Phaser.Scene{
    constructor() {
        super('MapScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#6e3318');
        this.player = new Player(this, this.cameras.main.centerX / 2, this.cameras.main.centerY/2, 'player');
        //button to get back to MainScene
        const BUTTON_SPACING = 100;
        const TITLE_TEXT = new GameText(this, this.cameras.main.centerX, this.cameras.main.centerY - BUTTON_SPACING, 'Mind Palace Map', {
            fontSize: '128px',
            color: '#fff'
        }).setOrigin(0.5);

        const MAIN_BUTTON = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + BUTTON_SPACING, 'Back to Main', 
            { 
                fontSize: '64px',
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

    update(){
        this.player.update();
    };
    
}