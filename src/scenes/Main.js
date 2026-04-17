/*
    Created by: Jackie Sanchez
    Date: 4/7/2026
    Description: This is the Main play scene.  This is where the main game will be played.  
    
*/

import GameText from "../prefabs/GameText";
import Case from '../prefabs/Case';
import Button from '../prefabs/Button';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    create() {
        /////////// TESTNIG CODE: TBD DELETED!!! //////////////////
        const NUM_SUSPECTS = 2;
        const DEFENSE_ROLE = "defense"
        const PROSECUTE_ROLE = "prosecution"

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
        const TITLE_TEXT = new GameText(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY - BUTTON_SPACING,
            'Main Game Scene',
            {
                fontSize: '128px',
                color: '#fff',
            },
        ).setOrigin(0.5);

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
                this.registry.set('case', null);
                this.scene.start('MenuScene');
            },
        );
        const MAP_BUTTON = new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + BUTTON_SPACING * 2,
            300,
            100,
            'Go to Mind Palace',
            undefined,
            undefined,
            () => {
                this.scene.start('MapScene');
            },
        );

        // player chooses defense or prosecution 
        if(!this.case.playerRole){
            MAP_BUTTON.hide();
            
            const PICK_SIDE_DEFENSE = new Button(
                this,
                this.cameras.main.centerX - BUTTON_SPACING * 2,
                this.cameras.main.centerY + BUTTON_SPACING * 2,
                300,
                100,
                'DEFEND',
                undefined,
                undefined,
                () => {
                    this.case.playerRole = DEFENSE_ROLE

                    PICK_SIDE_DEFENSE.hide();
                    PICK_SIDE_PROSECUTION.hide();
                    MAP_BUTTON.show();
                },
            );

            const PICK_SIDE_PROSECUTION = new Button(
                this,
                this.cameras.main.centerX + BUTTON_SPACING * 2,
                this.cameras.main.centerY + BUTTON_SPACING * 2,
                300,
                100,
                'PROSECUTE',
                undefined,
                undefined,
                () => {
                    this.case.playerRole = PROSECUTE_ROLE

                    PICK_SIDE_DEFENSE.hide();
                    PICK_SIDE_PROSECUTION.hide();
                    MAP_BUTTON.show();
                },
            );
        }
    }

    update() {}
}
