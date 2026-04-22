/*
    Created by: Jackie Sanchez and Raven Ruiz
    Date: 4/19/2026
    Description:  This scene will take in parameters to make a scene based on what
    type of hatch the player has visited.  It will have objective(s) to finish and it
    will progress time
*/
import { Game } from "phaser";
import GameText from "../prefabs/GameText";
import Button from '../prefabs/Button';

export default class HatchRoomScene extends Phaser.Scene {
    constructor() {
        super('HatchRoomScene');
    }

    init(data){
        this.label = data.label;
        this.objectives = data.objectives;
    }

    create(){
        console.log("[HatchRoomScene]", this.label, this.objectives);
        const TITLE_TEXT = new GameText(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.label + '\nObjective: ' + this.objectives.label + '\nObjects: ' + this.objectives.requiredObjects
        )
        // chose a sprite floor for tiler based on room type

        const MIND_PALACE = new Button(
            this,
            this.cameras.main.centerX / 5,
            this.cameras.main.centerY + 120,
            300,
            100,
            'Back to Mind Palace',
            undefined,
            undefined,
            () =>{
                this.scene.get('MapScene').events.emit('timeSpent', 1800);//30 minutes
                this.scene.stop();
                this.scene.wake('MapScene');
            }
        );
    }

    returnToMap() {

    }
}