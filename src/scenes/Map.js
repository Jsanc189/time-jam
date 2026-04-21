/*
    Created by: Jackie Sanchez
    Date Created: 4/7/2026
    Updated by: Jackie Sanchez
    Updated: 4/21/2026 - Adding hatch interaction with "e" key
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
        // World Setup
        this.cameras.main.setBackgroundColor('#6e3318');
        this.tileWidth = 128;
        this.tileHeight = 128;
        this.worldWidth = this.cameras.main.width * 3;
        this.worldHeight = this.cameras.main.height * 3;

        const TILER = new Rooms(this, 'tileFloor', this.tileWidth, this.tileHeight);
        TILER.tileRoom(0, 0, this.worldWidth, this.worldHeight);
        
        //Room Data
        let rooms = [
            {
                type:'Library',
                objectives: ['blade']
            }, 
            {
                type: 'Interrigation',
                objectives: ['arrow']
            }, 
            {
                type:'Crime_Scene',
                objectives:['harpoon']
            }];
        let sprite = ['libraryFloor'];
         const HATCHINFO = {
            sprite,
            rooms
        }
         this.hatches = TILER.spawnRandomHatches(
            HATCHINFO.sprite,
            HATCHINFO.rooms,

            0.05
        );

        //Player Data
        const safeSpawn = this.findSafePlayerSpawn();
        this.player = new Player(
            this,
            safeSpawn.x,
            safeSpawn.y,
        );
        //Player animation
        this.anims.create({
            key: 'playerIdle',
            frames: this.anims.generateFrameNumbers('playerSheet', { start: 0, end: 0 }),
            frameRate: 1,
            repeat: -1,
        });
        this.anims.create({
            key: 'playerWalkDown',
            frames: this.anims.generateFrameNames('playerSheet', { start: 0, end: 3 }),
            frameRate: 4,
            repeat: -1,
        });
        this.anims.create({
            key: 'playerWalkUp',
            frames: this.anims.generateFrameNames('playerSheet', { start: 4, end:  7 }),
            frameRate: 4,
            repeat: -1,
        });
        this.anims.create({
            key: 'playerWalkRight',
            frames: this.anims.generateFrameNames('playerSheet', { start: 8, end: 11 }),
            frameRate: 4,
            repeat: -1,
        });
        this.anims.create({
            key: 'playerWalkLeft',
            frames: this.anims.generateFrameNames('playerSheet', { start: 12, end: 15 }),
            frameRate: 4,
            repeat: -1,
        });

        //input for rooms
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        //hatch interaction state
        this.currentHatch = null;

        //Hatch overlap detection
        this.hatches.forEach(hatch => {
            this.physics.add.overlap(this.player, hatch.sprite, () =>{
                this.currentHatch = hatch.sprite;
            });
        });
        this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);

        //Press E text for hatches
        this.interactText =  new GameText(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            "Press E to Enter",
            {
                fontSize: '48px',
                backgroundColor:'#43282b' 
            }
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setVisible(false);

        //resume physics world when returning to scene
        this.events.on('wake', ()=> {
            this.physics.world.resume();
        })

        //Camera follows player and bounded to world
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setDeadzone(
            this.cameras.main.width * 0.6,
            this.cameras.main.height * 0.6
        )
        this.cameras.main.setBounds(0, 0, this.worldWidth, this.worldHeight);

        //clock logic
        const CLOCK_POSITIONX = this.cameras.main.centerX / 3;
        const CLOCK_POSITIONY = this.cameras.main.centerY * 3;

        this.registry.set('clockStartTime', 0); //start time in seconds
        this.registry.set('maxSeconds', 43200); //12 hours in seconds
        this.registry.set('taskTime', 1800); // 30 minutes in seconds

        this.clock = new Clock(this, CLOCK_POSITIONX, CLOCK_POSITIONY, 'clock');

        //UI buttons
        const BUTTON_SPACING = 120;
        const MAIN_BUTTON = new Button(
            this,
            this.cameras.main.centerX / 5,
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
        MAIN_BUTTON.setScrollFactor(0);

        //button to click to move clock up into view
        const CLOCK_BUTTON = new Button(
            this,
            this.cameras.main.centerX / 5,
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
        CLOCK_BUTTON.setScrollFactor(0);

        //button to increment time on the clock by 5 minutes
        const TIME_BUTTON = new Button(
            this,
            this.cameras.main.centerX / 5,
            this.cameras.main.centerY + BUTTON_SPACING * 3,
            300,
            100,
            'Advance Time',
            undefined,
            undefined,
            () => {
                this.clockStartTime += CLOCK_ITERATION_TIME;
                this.clock.updateTime(this.clockStartTime);
                if(this.clockStartTime >= this.maxSeconds) {
                    this.endGame();
                }
            },
        );
        TIME_BUTTON.setScrollFactor(0);
               
    }

    update() {
        this.player.update();
        this.clock.update();

        // --- CHECK IF PLAYER MOVED AWAY FROM HATCH ---
        if (this.currentHatch) {
            const touching = Phaser.Geom.Intersects.RectangleToRectangle(
                this.player.getBounds(),
                this.currentHatch.getBounds()
            );

            if (!touching) {
                this.currentHatch = null;
                this.interactText.setVisible(false);
            }
        }

        if (this.currentHatch) {
            this.interactText.setVisible(true);
            
            if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
                const label = this.currentHatch.getData('label');
                const objectives = this.currentHatch.getData('objectives');
                const data = {label: label, objectives: objectives};
                this.scene.sleep('MapScene');
                this.scene.launch("HatchRoomScene", data);
                this.physics.world.pause();
            }
        }

    }

    endGame() {
        console.log("Game Over - time ran out!");
        this.time.delayedCall(50, () =>{
            alert("GameOver!");
            this.clockStartTime = 0;
        });
    }

    findSafePlayerSpawn() {
        const TILE = this.tileWidth;
        let spawnX = this.worldWidth / 2;
        let spawnY = this.worldHeight / 2;

        //if no hatches exist, just return center
        if (!this.hatches || this.hatches.length === 0) {
            return { x: spawnX, y:spawnY };
        };
        
        //check if center overlaps any hatch
        const tempRect = new Phaser.Geom.Rectangle(spawnX - 16, spawnY - 16, 32, 32,);
        const isOverlapping = this.hatches.some(hatch => {
            return Phaser.Geom.Intersects.RectangleToRectangle(
                tempRect,
                hatch.sprite.getBounds()
            );
        });

        for (let i = 0; i < 30; i++) {
            if (!isOverlapping) {
                return { x: spawnX, y:spawnY };
            }

            // Random nudge direction
            const dir = Phaser.Math.Between(0, 3);
            let newX = x;
            let newY = y;

            if (dir === 0) newX += TILE; // rights
            if (dir === 1) newX -= TILE; // left
            if (dir === 2) newY += TILE; // down
            if (dir === 3) newY -= TILE; // up

            // Bounds check
            const insideBounds =
                newX > 0 && newX < this.WORLDWIDTH &&
                newY > 0 && newY < this.WORLDHEIGHT;

            if (insideBounds) {
                x = newX;
                y = newY;
            }
        }

        return { x: spawnX, y:spawnY }

    }


}


