/*
    Created by: Jackie Sanchez
    Date: 4/7/2026
    Description: This is the Main play scene.  This is where the main game will be played. 
    
    Edited: Raven Ruiz
    Date: 4/19/2026
    Description: Added case generation, objectives generation, and role choice buttons (defense, prosecution).
    
*/

import GameText from '../prefabs/GameText';
import Case from '../prefabs/Case';
import Button from '../prefabs/Button';
import ObjectivesController from '../prefabs/Objectives';
// import { defaults } from 'gh-pages'; ///// NOTE: UNDO CHANGE

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    create() {
        this.NUM_SUSPECTS = 2;
        this.NUM_OBJECTIVES = 10;
        this.DEFENSE_ROLE = 'defense';
        this.PROSECUTE_ROLE = 'prosecution';

        if (!this.registry.get('case')) {
            this.grammar = this.registry.get('grammar');
            this.case = new Case(this.grammar, this.NUM_SUSPECTS);

            this.registry.set('case', this.case);
            // this.testObjectives();
        }

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
                this.registry.set('objectivesControl', null);
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
        if (!this.case.playerRole) {
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
                    this.case.playerRole = this.DEFENSE_ROLE;
                    this.objectivesControl = new ObjectivesController(this.case, this.grammar.getAllObjects(), this.NUM_OBJECTIVES);
                    this.registry.set('objectivesControl', this.objectivesControl);

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
                    this.case.playerRole = this.PROSECUTE_ROLE;
                    this.objectivesControl = new ObjectivesController(this.case, this.grammar.getAllObjects(), this.NUM_OBJECTIVES);
                    this.registry.set('objectivesControl', this.objectivesControl);

                    PICK_SIDE_DEFENSE.hide();
                    PICK_SIDE_PROSECUTION.hide();
                    MAP_BUTTON.show();
                },
            );
        }
    }

    // TEMP TESTING CODE
    testObjectives() {
        const PLAYER_ROLE_OG = this.case.playerRole; // preserve

        const OBJECTS = this.grammar.getAllObjects();

        const LOG_ID = '[Main] testObjectives()';
        const pass = (msg) => console.log(`${LOG_ID} PASS: ${msg}`);
        const fail = (msg) => console.error(`${LOG_ID} FAIL: ${msg}`);
        const assert = (condition, msg) => (condition ? pass(msg) : fail(msg));
        const header = (title) => console.log(`${'_'.repeat(40)}\n--- ${title}\n${'_'.repeat(40)}\n${LOG_ID} ... `);

        const testRole = (role) => {
            header(`Initial Build ... testing ${role}`);
            this.case.playerRole = role;
            const ctrl = new ObjectivesController(this.case, OBJECTS, this.NUM_OBJECTIVES);
            const all = ctrl.getAll();

            assert(
                all.length > 0,
                `${LOG_ID} ... Generated ${ctrl.getAll().length} ${this.case.role} objectives`,
            );
            assert(
                ctrl.getPending().length === all.length,
                `${LOG_ID} ... All ${all.length} start as pending`,
            );

            // should always generate crime scene objectives
            const crimeSceneObj = all.find((o) => o.id === 'crime_scene');
            assert(!!crimeSceneObj, `Crime scene objective spawns`);

            // suspect investigation objectives spawn, capped at NUM_OBJECTIVES
            const roleObjs = all.filter((o) => o.suspect);
            assert(
                roleObjs.length <= this.NUM_OBJECTIVES,
                `${LOG_ID} ... Suspect objectives (${roleObjs.length}) do not exceed NUM_OBJECTIVES (${this.NUM_OBJECTIVES})`,
            );

            const defendant = this.case.defendant;
            if (role == this.PROSECUTE_ROLE) {
                // prosecution should only ever target defendant
                const wrongSuspect = roleObjs.find(
                    (o) => o.suspect && o.suspect !== defendant.name,
                );
                assert(
                    !wrongSuspect,
                    `Prosecution objectives only target defendant (${defendant.name})`,
                );
            } else if (role == this.DEFENSE_ROLE) {
                // defense should never target defendant
                const wrongSuspect = roleObjs.find(
                    (o) => o.suspect && o.suspect === defendant.name,
                );
                assert(
                    !wrongSuspect,
                    `Defense objectives never target defendant (${defendant.name})`,
                );
            }

            console.log(`${LOG_ID} ... SUMMARY (${this.case.playerRole}):`, ctrl.getSummary());
        };

        testRole(this.PROSECUTE_ROLE);
        testRole(this.DEFENSE_ROLE);

        // simulate walking into a room and touching every required object
        // (returns completed objective returned by the last onItemFound call)
        const clearRoom = (ctrl, roomType) => {
            ctrl.onRoomVisited(roomType);
            const obj = ctrl.getAll().find((o) => o.roomType === roomType);
            if (!obj) return null;
            let result = null;
            for (const item of obj.requiredObjects) {
                result = ctrl.onItemFound(item);
            }
            return result; // returns the completed objective
        };

        // visiting rooms
        header('testing onRoomVisited');

        const ctrl = new ObjectivesController(this.case, 'prosecution', OBJECTS, this.NUM_OBJECTIVES);

        const roomResult = ctrl.onRoomVisited(this.case.crime.scene);
        assert(roomResult !== null, `onRoomVisited(crime scene) returned the active objective`);
        assert(
            roomResult?.roomType === this.case.crime.scene,
            `Returned objective matches visited room (${this.case.crime.scene})`,
        );

        // Re-visiting a completed room returns null
        clearRoom(ctrl, this.case.crime.scene); // complete it first
        const revisit = ctrl.onRoomVisited(this.case.crime.scene);
        // After completion there's no pending objective for this room
        assert(
            revisit === null || revisit?.completed,
            `Re-visiting a completed room does not return a pending objective`,
        );

        // onItemFound
        header('testing onItemFound');

        const ctrl2 = new ObjectivesController(this.case, 'prosecution', OBJECTS, this.NUM_OBJECTIVES);
        ctrl2.onRoomVisited(this.case.crime.scene);

        // item outside the room requiredObjects returns null
        const irrelevant = ctrl2.onItemFound('__nonexistent_item__');
        assert(irrelevant === null, `onItemFound with irrelevant item returns null`);

        // progress increments before completion
        const crimeObj2 = ctrl2.getAll().find((o) => o.id === 'crime_scene');
        if (crimeObj2.requiredObjects.length > 1) {
            ctrl2.onItemFound(crimeObj2.requiredObjects[0]);
            const progress = ctrl2.getRoomProgress(this.case.crime.scene);
            assert(
                progress.found === 1 && !progress.completed,
                `Partial interaction: found ${progress.found}/${progress.required}, not yet complete`,
            );
        }

        // finding all required objects completes the objective
        const completed = clearRoom(ctrl2, this.case.crime.scene);
        assert(completed !== null, `clearRoom returned the completed objective`);
        assert(
            ctrl2.isComplete('crime_scene'),
            `Crime scene objective is marked complete after all objects found`,
        );

        // re-finding object in completed room does nothing
        ctrl2.onRoomVisited(this.case.crime.scene);
        const refind = ctrl2.onItemFound(this.case.crime.object);
        assert(refind === null, `onItemFound in a completed room returns null`);

        // room progress
        header('testing getRoomProgress');

        const ctrl3 = new ObjectivesController(this.case, 'prosecution', OBJECTS, this.NUM_OBJECTIVES);
        const progBefore = ctrl3.getRoomProgress(this.case.crime.scene);
        assert(progBefore !== null, `getRoomProgress returns data for a valid room`);
        assert(
            progBefore.found === 0 && progBefore.required > 0 && !progBefore.completed,
            `Progress before interaction: found=${progBefore.found}, required=${progBefore.required}, completed=${progBefore.completed}`,
        );

        clearRoom(ctrl3, this.case.crime.scene);
        const progAfter = ctrl3.getRoomProgress(this.case.crime.scene);
        assert(
            progAfter.completed,
            `Progress after clearing room: completed=${progAfter.completed}`,
        );

        const noRoom = ctrl3.getRoomProgress('__fake_room__');
        assert(noRoom === null, `getRoomProgress returns null for unknown room`);

        // win condition
        header('testing isWinConditionMet');

        const ctrl4 = new ObjectivesController(this.case, 'prosecution', OBJECTS, this.NUM_OBJECTIVES);
        assert(!ctrl4.isWinConditionMet(), `Win condition not met at start`);

        for (const obj of ctrl4.getAll()) {
            clearRoom(ctrl4, obj.roomType);
        }
        assert(ctrl4.isWinConditionMet(), `Win condition met after clearing all rooms`);

        // final summary
        header('final state');
        console.log(`${LOG_ID} ... All objectives:`, ctrl4.getAll());
        console.log(`${LOG_ID} ... Final summary:`, ctrl4.getSummary());
        this.case.playerRole = PLAYER_ROLE_OG; // revert
    }

    update() {}
}
