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
import Rooms from "../prefabs/Rooms";
import Player from "../prefabs/Player";

export default class HatchRoomScene extends Phaser.Scene {
    constructor() {
        super('HatchRoomScene');
    }

    init(data){
        this.label = data.label;
        this.objectives = data.objectives;
        this.tile = [Phaser.Utils.Array.GetRandom(data.floorFrames)];
    }

    create(){
;        //camera set up
        const cam = this.cameras.main;
        const viewWidth = cam.width;
        const viewHeight = cam.height;

        //tile the room
        this.tileWidth = 128;
        const TILER = new Rooms(this, 'floorTiles', this.tileWidth, this.tileWidth);

        TILER.tileRoom(
            0,
            0,
            viewWidth,
            viewHeight,
            this.tile
        );

        const TITLE_TEXT = new GameText(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.label + '\nObjectives are: ' + this.objectives,
            {
               backgroundColor:'#43282b'
            }
        );

        //rope to map.js
        const startY = -200;
        this.ropeTop = this.add.image(
            this.cameras.main.centerX / 8,
            startY,
            'rope_hatch',
            0
        )
        this.ropeBottom = this.add.image(
            this.cameras.main.centerX / 8,
            startY + this.ropeTop.height,
            'rope_hatch',
            1
        )
        this.tweens.add({
            targets:[this.ropeTop, this.ropeBottom],
            y: '+=400',
            duration: 1200,
            ease: 'Bounce.easeOut'
        })
        this.ropeTop.setInteractive({cursor: 'pointer'});
        this.ropeBottom.setInteractive({cursor: 'pointer'});
        this.ropeTop.on('pointerdown', ()=> this.returnToMap());
        this.ropeBottom.on('pointerdown', ()=> this.returnToMap());

        //Player sprite
        this.player = new Player(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY
        )
        this.player.play('playerIdle');
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D'
        });



    }

    update() {
        this.player.update();
    }

    returnToMap() {
        this.cameras.main.fadeOut(300, 0, 0);
        this.scene.get('MapScene').events.emit('timeSpent', 1800);//30 minutes
        this.scene.stop();
        this.scene.wake('MapScene');
    }
}