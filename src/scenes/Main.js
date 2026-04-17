/*
    Created by: Jackie Sanchez
    Date: 4/7/2026
    Description: This is the Main play scene.  This is where the main game will be played.  
    
*/

import GameText from "../prefabs/GameText";
import Grammar from '../prefabs/Grammars';
import Case from '../prefabs/Case';


export default class MainScene extends Phaser.Scene{
    constructor() {
        super('MainScene');
    }

    
    create() {
        /////////// TESTNIG CODE: TBD DELETED!!! //////////////////
        const NUM_SUSPECTS = 2;

        if(!this.registry.get('case')){
            const grammar = this.registry.get('grammar');
            this.case = new Case(grammar, NUM_SUSPECTS);

            this.registry.set('case', this.case);
        }

        console.log(this.case)
        //////////////////////////////////////////////////////////


        this.cameras.main.setBackgroundColor('#6e3318');
        //button to get back to MenuScene
        const BUTTON_SPACING = 150;
        const TITLE_TEXT = new GameText(this, this.cameras.main.centerX, this.cameras.main.centerY - BUTTON_SPACING, 'Main Game Scene', {
            fontSize: '128px',
            color: '#fff'
        }).setOrigin(0.5);
            
        const MENU_BUTTON = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'Back to Menu', 
            { 
                fontSize: '64px',
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
            this.registry.set('case', null);    // clear case data

            this.scene.start('MenuScene');
        });

        const MAP_BUTTON = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + BUTTON_SPACING, 'Go to Mind Palace',
            {
                fontSize: '64px',
                backgroundColor: '#fff',
                color: '#338de1',
                padding: { x: 20, y: 10 }
            }).setOrigin(0.5).setInteractive();

        MAP_BUTTON.on('pointerover', () => {
            MAP_BUTTON.setStyle({ backgroundColor: '#338de1', color: '#fff' });
        });
        MAP_BUTTON.on('pointerout', () => {
            MAP_BUTTON.setStyle({ backgroundColor: '#fff', color: '#338de1' });
        });
        MAP_BUTTON.on('pointerdown', () => {
            this.scene.start('MapScene');
        });

        

        if(!this.case.playerRole){
            MAP_BUTTON.setVisible(false);
            
            const PICK_SIDE_DEFENSE = this.add.text(this.cameras.main.centerX - BUTTON_SPACING * 2, this.cameras.main.centerY + BUTTON_SPACING, 'DEFEND',
                {
                    fontSize: '64px',
                    backgroundColor: '#fff',
                    color: '#338de1',
                    padding: { x: 20, y: 10 }
                }).setOrigin(0.5).setInteractive();

            PICK_SIDE_DEFENSE.on('pointerover', () => {
                PICK_SIDE_DEFENSE.setStyle({ backgroundColor: '#338de1', color: '#fff' });
            });
            PICK_SIDE_DEFENSE.on('pointerout', () => {
                PICK_SIDE_DEFENSE.setStyle({ backgroundColor: '#fff', color: '#338de1' });
            });
            PICK_SIDE_DEFENSE.on('pointerdown', () => {
                this.case.playerRole = "defense";

                PICK_SIDE_DEFENSE.setVisible(false);
                PICK_SIDE_PROSECUTION.setVisible(false);
                MAP_BUTTON.setVisible(true);
            });

            const PICK_SIDE_PROSECUTION = this.add.text(this.cameras.main.centerX + BUTTON_SPACING * 2, this.cameras.main.centerY + BUTTON_SPACING, 'PROSECUTE',
                {
                    fontSize: '64px',
                    backgroundColor: '#fff',
                    color: '#338de1',
                    padding: { x: 20, y: 10 }
                }).setOrigin(0.5).setInteractive();

            PICK_SIDE_PROSECUTION.on('pointerover', () => {
                PICK_SIDE_PROSECUTION.setStyle({ backgroundColor: '#338de1', color: '#fff' });
            });
            PICK_SIDE_PROSECUTION.on('pointerout', () => {
                PICK_SIDE_PROSECUTION.setStyle({ backgroundColor: '#fff', color: '#338de1' });
            });
            PICK_SIDE_PROSECUTION.on('pointerdown', () => {
                this.case.playerRole = "prosecutor";

                PICK_SIDE_DEFENSE.setVisible(false);
                PICK_SIDE_PROSECUTION.setVisible(false);
                MAP_BUTTON.setVisible(true);
            });
        }
    }

    update(){
    }
    
}