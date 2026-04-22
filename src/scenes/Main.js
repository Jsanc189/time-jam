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
import { Game } from "phaser";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    create() {
        const NUM_SUSPECTS = 2;
        const NUM_OBJECTIVES = 10;
        const DEFENSE_ROLE = "defense"
        const PROSECUTE_ROLE = "prosecution"

        if(!this.registry.get('case')){
            const grammar = this.registry.get('grammar');
            this.case = new Case(grammar, NUM_SUSPECTS);

            this.registry.set('case', this.case);
        }

        console.log("[Main]: ", this.case)

        this.cameras.main.setBackgroundColor('#6e3318');
        //button to get back to MenuScene
        const BUTTON_SPACING = 150;

        const MENU_BUTTON = new Button(
            this,
            this.cameras.main.centerX / 6 + 50,
            this.cameras.main.centerY / 6 ,
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
            this.cameras.main.centerX * 1.8,
            this.cameras.main.centerY / 6 + BUTTON_SPACING,
            300,
            100,
            'Go to Mind Palace',
            undefined,
            undefined,
            () => {
                this.scene.start('MapScene');
            },
        );

        const EVIDENCE_BUTTON = new Button(
            this,
            this.cameras.main.centerX * 1.8,
            this.cameras.main.centerY / 6,
            300,
            100,
            'Evidence Found',
            undefined,
            undefined, () =>{
                notesOpen = !notesOpen;

                this.tweens.add({
                    targets: this.evidenceNotes,
                    x: notesOpen
                        ? this.cameras.main.centerX
                        : this.cameras.main.centerX * 3,
                    duration: 600,
                    ease: 'Cubic.easeInOut'
                })
            }
        )

        let notesOpen = false;
        this.evidenceNotes = this.add.sprite(
            this.cameras.main.centerX * 3,
            this.cameras.main.centerY,
            'paper2'
        )
        .setDepth(10)
        .setScale(.90);

        // player chooses defense or prosecution 
        if(!this.case.playerRole){
            MAP_BUTTON.hide();
            EVIDENCE_BUTTON.hide();
            
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
                    this.objectives = new ObjectivesController(this.case, NUM_OBJECTIVES);
                    this.registry.set('objectives', this.objectives);

                    PICK_SIDE_DEFENSE.hide();
                    PICK_SIDE_PROSECUTION.hide();
                    MAP_BUTTON.show();
                    this.judgeStand.setVisible(true);
                    judge.setVisible(true);
                    g.setVisible(true);
                    juryText.setVisible(true);
                    EVIDENCE_BUTTON.show();

                    //this.testObjectives();
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
                    this.objectives = new ObjectivesController(this.case, NUM_OBJECTIVES);
                    this.registry.set('objectives', this.objectives);

                    PICK_SIDE_DEFENSE.hide();
                    PICK_SIDE_PROSECUTION.hide();
                    MAP_BUTTON.show();
                    this.judgeStand.setVisible(true);
                    judge.setVisible(true);
                    g.setVisible(true);
                    juryText.setVisible(true);
                    EVIDENCE_BUTTON.show();

                    //this.testObjectives();
                },
            );
        }

        //judge placeholder
        const judgeWidth = 800;
        const judgeHeight = 600;
        this.judgeStand = this.add.rectangle(
            this.cameras.main.centerX / 2,
            this.cameras.main.centerY * 1.30 ,
            judgeWidth,
            judgeHeight,
            0x3b2f2f
        ).setStrokeStyle(4, 0xfffff)
        .setVisible(false);
        const judge = new GameText(
            this,
            this.judgeStand.x,
            this.judgeStand.y,
            "JUDGE"
        ).setOrigin(0.5)
        .setVisible(false);

        //jury stand placeholer
        const g = this.add.graphics();
        g.fillStyle(0x2e2a24, 1);
        const x = this.cameras.main.centerX * 1.6;
        const y = this.cameras.main.centerY * 1.5;
        g.moveTo(x - 420, y - 220);   // top-left (pulled back)
        g.lineTo(x + 420, y - 50);   // top-right (pulled back)
        g.lineTo(x + 420, y + 300);  // bottom-right (closer)
        g.lineTo(x - 420, y + 100);  // bottom-left (closer)
        g.closePath();
        g.fillPath();
        g.setVisible(false);
        const juryText = new GameText(
            this,
            x,
            y,
            "JURY"
        ).setOrigin(0.5)
        .setVisible(false);

    }

    // TEMP TESTING CODE
    // testObjectives(){
    //     const PLAYER_ROLE_OG = this.case.playerRole;    // preserve

    //     const LOG_ID = "[Main] testObjectives()";
    //     const pass = (msg) => console.log(`${LOG_ID} PASS: ${msg}`);
    //     const fail = (msg) => console.error(`${LOG_ID} FAIL: ${msg}`);
    //     const assert = (condition, msg) => condition ? pass(msg) : fail(msg);
    //     const header = (title) => console.log(`${'_'.repeat(40)}\n--- ${title}\n${'_'.repeat(40)}`);

    //     const testRole = (role) => {
    //         header(`\n${LOG_ID} ... Initial Build ... testing ${role}`);
    //         this.case.playerRole = role;
    //         const ctrl = new ObjectivesController(this.case, NUM_OBJECTIVES);
    //         const all = ctrl.getAll();

    //         assert(all.length > 0, `${LOG_ID} ... Generated ${ctrl.getAll().length} ${this.case.role} objectives`);
    //         assert(ctrl.getPending().length === all.length, `${LOG_ID} ... All ${all.length} start as pending`);

    //         // should always generate crime scene objectives
    //         const crimeSceneObj = all.find((o) => o.id === "crime_scene");
    //         assert(!!crimeSceneObj, `Crime scene objective spawns`);

    //         // suspect investigation objectives spawn, capped at NUM_OBJECTIVES
    //         const susObjs = all.filter((o) => o.suspect);
    //         assert(susObjs.length <= NUM_OBJECTIVES, `${LOG_ID} ... Suspect objectives (${susObjs.length}) do not exceed NUM_OBJECTIVES (${NUM_OBJECTIVES})`);

    //         const defendant = this.case.defendant;         
    //         if(role == PROSECUTE_ROLE){
    //             // prosecution should only ever target defendant
    //             //const wrongSuspect = roleObjs.find((o) => )
    //         }

    //         console.log(`${LOG_ID} ... SUMMARY (${this.case.playerRole}):`, ctrl.getSummary());
    //     }

    //     // testing roles
    //     testRole(PROSECUTE_ROLE);
    //     testRole(DEFENSE_ROLE);

    //     // should always generate crime scene objectives
    //     const crimeSceneObj = allD.find((o) => o.id === "crime_scene");
    //     assert(!!crimeSceneObj, `Crime scene objective spawns`);

    //     // suspect investigation objectives spawn, capped at NUM_OBJECTIVES
    //     const susObjs = allD.filter((o) => o.suspect);
    //     assert(susObjs.length <= NUM_OBJECTIVES, `${LOG_ID} ... Suspect objectives (${susObjs.length}) do not exceed NUM_OBJECTIVES (${NUM_OBJECTIVES})`);

    //     console.log(`${LOG_ID} ... SUMMARY (${this.case.playerRole}):`, ctrlD.getSummary());






    //     header(`${LOG_ID} ... Triggers`);
    //     const roomHit = ctrl.onRoomVisited(this.case.crime.scene);
    //     assert(roomHit.length > 0, `${LOG_ID} ... onRoomVisited(crime scene) completed ${roomHit.length} objective(s)`);
    //     assert(ctrl.onRoomVisited(this.case.crime.scene).length === 0, `${LOG_ID} ... Re-visiting completes nothing`);

    //     const itemHit = ctrl.onItemFound(this.case.crime.object);
    //     assert(itemHit.length > 0, `${LOG_ID} ... onItemFound(crime object) completed ${itemHit.length} objective(s)`);
    //     assert(ctrl.onItemFound(this.case.crime.object).length === 0, `${LOG_ID} ... Re-finding completes nothing`);

    //     const motiveHit = ctrl.onMotiveUncovered(this.case.defendant.name);
    //     assert(motiveHit.length > 0, `${LOG_ID} ... onMotiveUncovered(defendant) completed ${motiveHit.length} objective(s)`);

    //     header(`${LOG_ID} ... role = prosecution`);
    //     ctrl.applyRole('prosecution');
    //     assert(ctrl.getByCategory('role').length > 0, `${LOG_ID} ... Role objectives added`);
    //     assert(ctrl.isComplete('prosecution_build_case') === false, `${LOG_ID} ... prosecution_build_case starts pending`);

    //     console.log(`\n${LOG_ID} ...  Final summary:`, ctrl.getSummary());
    //     console.log(`${LOG_ID} ... All objectives:`, ctrl.getAll());

    //     this.case.playerRole = PLAYER_ROLE_OG;    // revert
    // }

    update() {}

    evidenceFound() {
        this.evidenceNotes.x = this.cameras.main.centerX;
    }
}
