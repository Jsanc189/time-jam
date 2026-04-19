/*
    Created by: Jackie Sanchez
    Date: 4/7/2026
    Description: This is the Main play scene.  This is where the main game will be played. 
    
    Edited: Raven Ruiz
    Date: 4/19/2026
    Description: Added case generation, objectives generation, and role choice buttons (defense, prosecution).
    
*/

import GameText from "../prefabs/GameText";
import Case from '../prefabs/Case';
import Button from '../prefabs/Button';
import ObjectivesController from "../prefabs/Objectives";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    create() {
        const NUM_SUSPECTS = 2;
        const DEFENSE_ROLE = "defense"
        const PROSECUTE_ROLE = "prosecution"

        if(!this.registry.get('case')){
            const grammar = this.registry.get('grammar');
            this.case = new Case(grammar, NUM_SUSPECTS);

            this.registry.set('case', this.case);

            this.objectives = new ObjectivesController(this.case);
            this.registry.set('objectives', this.objectives);
        }

        console.log("[Main]: ", this.case)

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
                this.registry.set('objectives', null);
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
                    this.objectives.applyRole(this.case.playerRole);

                    PICK_SIDE_DEFENSE.hide();
                    PICK_SIDE_PROSECUTION.hide();
                    MAP_BUTTON.show();

                    this.testObjectives();
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
                    this.objectives.applyRole(this.case.playerRole);

                    PICK_SIDE_DEFENSE.hide();
                    PICK_SIDE_PROSECUTION.hide();
                    MAP_BUTTON.show();

                    this.testObjectives();
                },
            );
        }
    }

    /*
    // TEMP TESTING CODE
    testObjectives(){
        const LOG_ID = "[Main] testObjectives()";

        const ctrl = new ObjectivesController(this.case);
        const pass = (msg) => console.log(`${LOG_ID} PASS: ${msg}`);
        const fail = (msg) => console.error(`${LOG_ID} FAIL: ${msg}`);
        const assert = (condition, msg) => condition ? pass(msg) : fail(msg);
        const header = (title) => console.log(`${'_'.repeat(40)}\n--- ${title}\n${'_'.repeat(40)}`);

        header(`\n${LOG_ID} ... Initial Build`);
        assert(ctrl.getAll().length > 0, `${LOG_ID} ... Generated ${ctrl.getAll().length} objectives`);
        assert(ctrl.getPending().length === ctrl.getAll().length, `${LOG_ID} ... All start as pending`);
        assert(ctrl.getByType('visit_room').length > 0, `${LOG_ID} ... ${ctrl.getByType('visit_room').length} room objectives`);
        assert(ctrl.getByType('find_item').length > 0, `${LOG_ID} ... ${ctrl.getByType('find_item').length} item objectives`);
        assert(ctrl.getByType('uncover_motive').length > 0, `${LOG_ID} ... ${ctrl.getByType('uncover_motive').length} motive objectives`);
        console.log(`${LOG_ID} ... SUMMARY:`, ctrl.getSummary());

        header(`${LOG_ID} ... Triggers`);
        const roomHit = ctrl.onRoomVisited(this.case.crime.scene);
        assert(roomHit.length > 0, `${LOG_ID} ... onRoomVisited(crime scene) completed ${roomHit.length} objective(s)`);
        assert(ctrl.onRoomVisited(this.case.crime.scene).length === 0, `${LOG_ID} ... Re-visiting completes nothing`);

        const itemHit = ctrl.onItemFound(this.case.crime.object);
        assert(itemHit.length > 0, `${LOG_ID} ... onItemFound(crime object) completed ${itemHit.length} objective(s)`);
        assert(ctrl.onItemFound(this.case.crime.object).length === 0, `${LOG_ID} ... Re-finding completes nothing`);

        const motiveHit = ctrl.onMotiveUncovered(this.case.defendant.name);
        assert(motiveHit.length > 0, `${LOG_ID} ... onMotiveUncovered(defendant) completed ${motiveHit.length} objective(s)`);

        header(`${LOG_ID} ... role = prosecution`);
        ctrl.applyRole('prosecution');
        assert(ctrl.getByCategory('role').length > 0, `${LOG_ID} ... Role objectives added`);
        assert(ctrl.isComplete('prosecution_build_case') === false, `${LOG_ID} ... prosecution_build_case starts pending`);

        console.log(`\n${LOG_ID} ...  Final summary:`, ctrl.getSummary());
        console.log(`${LOG_ID} ... All objectives:`, ctrl.getAll());
    }
    */

    update() {}
}
