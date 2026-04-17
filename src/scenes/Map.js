/*
    Created by: Jackie Sanchez
    Date Created: 4/7/2026
    Updated by: Jackie Sanchez
    Updated: 4/9/2026 - player movement added and clock logic added to MapScene
    Description: This is the map scene.  This is where the Mindpalace map will be displayed.  The
    player will be ablt to navigate their mind palace and interact with objects to learn more about the 
    story and progress through the game.
*/

import GameText from '../prefabs/GameText';
import Player from '../prefabs/Player';
import Clock from '../prefabs/Clock';
import Rooms from '../prefabs/Rooms';
import Button from '../prefabs/Button';

export default class MapScene extends Phaser.Scene {
    constructor() {
        super('MapScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#6e3318');
        const TILEWIDTH = 128;
        const TILEHEIGHT = 128;
        const TILER = new Rooms(this, 'tileFloor', TILEWIDTH, TILEHEIGHT);
        TILER.tileRoom(0, 0, this.cameras.main.width, this.cameras.main.height);
        this.player = new Player(
            this,
            this.cameras.main.centerX / 2,
            this.cameras.main.centerY / 2,
        );
        this.anims.create({
            key: 'playerIdle',
            frames: this.anims.generateFrameNumbers('playerSheet', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: -1,
        });
        this.anims.create({
            key: 'playerWalkDown',
            frames: this.anims.generateFrameNames('playerSheet', { start: 0, end: 2 }),
            frameRate: 4,
            repeat: -1,
        });
        this.anims.create({
            key: 'playerWalkUp',
            frames: this.anims.generateFrameNames('playerSheet', { start: 3, end: 5 }),
            frameRate: 4,
            repeat: -1,
        });
        this.anims.create({
            key: 'playerWalkRight',
            frames: this.anims.generateFrameNames('playerSheet', { start: 6, end: 8 }),
            frameRate: 4,
            repeat: -1,
        });
        this.anims.create({
            key: 'playerWalkLeft',
            frames: this.anims.generateFrameNames('playerSheet', { start: 9, end: 11 }),
            frameRate: 4,
            repeat: -1,
        });

        const CLOCK_POSITIONX = this.cameras.main.centerX / 3;
        const CLOCK_POSITIONY = this.cameras.main.centerY * 3;
        this.clockStartTime = 0; //start time in seconds
        const CLOCK_ITERATION_TIME = 300; // 5 minutes in seconds
        this.clock = new Clock(this, CLOCK_POSITIONX, CLOCK_POSITIONY, 'clock');

        //button to get back to MainScene
        const BUTTON_SPACING = 120;
        const TITLE_TEXT = new GameText(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY - BUTTON_SPACING,
            'Mind Palace Map',
            {
                fontSize: '128px',
                color: '#fff',
            },
        ).setOrigin(0.5);

        const MAIN_BUTTON = new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + BUTTON_SPACING,
            300,
            100,
            'Back to Main',
            undefined,
            undefined,
            () => {
                this.scene.start('MainScene');
            },
        );

        //button to click to move clock up into view
        const CLOCK_BUTTON = new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + BUTTON_SPACING * 2,
            300,
            100,
            'Reveal Clock',
            undefined,
            undefined,
            () => {
                if (this.clock.y > this.cameras.main.centerY) {
                    this.clock.moveTo(this.cameras.main.centerX / 3, this.cameras.main.centerY / 2);
                } else {
                    this.clock.moveTo(CLOCK_POSITIONX, CLOCK_POSITIONY);
                }
            },
        );

        //button to increment time on the clock by 5 minutes
        const TIME_BUTTON = new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + BUTTON_SPACING * 3,
            300,
            100,
            'Advance Time',
            undefined,
            undefined,
            () => {
                this.clockStartTime += CLOCK_ITERATION_TIME;
                this.clock.updateTime(this.clockStartTime);
            },
        );
    }

    update() {
        this.player.update();
        this.clock.update();
    }
}
