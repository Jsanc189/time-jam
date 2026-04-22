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

        const FLOOR_FRAMES = [0, 1, 2, 3];
        const TILER = new Rooms(this, 'floorTiles', this.tileWidth, this.tileHeight);
        TILER.tileRoom(0, 0, this.worldWidth, this.worldHeight, FLOOR_FRAMES);
        
        //Room Data
        const hatchImage = {key: 'rope_hatch', frame: 2, activeFrame: 3}
        let rooms = [
            {
                type:'Library',
                objectives: ['blade'],
               hatchSprite: hatchImage,
               floorFrames: [10]
            }, 
            {
                type: 'Interview',
                objectives: ['arrow'],
                hatchSprite: hatchImage,
                floorFrames: [8, 9]
            }, 
            {
                type:'Crime_Scene',
                objectives:['harpoon'],
                hatchSprite: hatchImage,
                floorFrames:[4, 5, 6, 7]
            }];

         const HATCHINFO = {
            rooms
        }
         this.hatches = TILER.spawnRandomHatches(
            rooms,
            0.05
        );
        this.hatchGroup = this.physics.add.group();
        this.hatches.forEach(h => {
            this.hatchGroup.add(h.sprite)
        });

        //Player Data
        const safeSpawn = this.findSafePlayerSpawn();
        this.player = new Player(
            this,
            safeSpawn.x,
            safeSpawn.y,
        );

        //input for rooms
        this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);

        //hatch interaction state
        this.currentHatch = null;

        //Hatch overlap detection
        this.hatches.forEach(hatch => {
            this.physics.add.overlap(
                this.player, 
                this.hatches.map(h => h.sprite), 
                this.onHatchOverlap, 
                null, 
                this);
        });
        this.physics.world.setBounds(0, 0, this.worldWidth, this.worldHeight);

        //Press E text for hatches
        this.interactText =  new GameText(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY / 6,
            "Press E to Enter",
            {
                fontSize: '48px',
                backgroundColor:'#43282b' 
            }
        )
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(9999)
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
        const CLOCK_ITERATION_TIME = 1800; //30 minutes in seconds

        this.registry.set('clockStartTime', 0); //start time in seconds
        this.registry.set('maxSeconds', 43200); //12 hours in seconds
        this.registry.set('taskTime', 1800); // 30 minutes in seconds

        this.clock = new Clock(this, CLOCK_POSITIONX, CLOCK_POSITIONY, 'clock');

        this.events.on('timeSpent', (seconds) =>{
            let current = this.registry.get('clockStartTime');
            current += seconds;
            this.registry.set('clockStartTime', current)
            this.clock.updateTime(current);
        });

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
                this.game.audio.playSFX("gavel");
                this.scene.sleep();
                this.scene.wake('MainScene');
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
                const clockTick = this.game.audio.playSFX("clockCalm");
                this.time.delayedCall(2000, ()=>{ 
                    clockTick.stop()
                });
            },
        );
        CLOCK_BUTTON.setScrollFactor(0);

    }

    update() {
        this.player.update();

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
                const floorFrames = this.currentHatch.getData('floorFrames')
                const data = {label: label, objectives: objectives, floorFrames: floorFrames};
                this.scene.sleep('MapScene');
                this.scene.launch("HatchRoomScene", data);
                this.physics.world.pause();
            }
        }

        this.hatches.forEach(h => {
            const sprite = h.sprite;

            if (!sprite.getData('isActive')) {
                sprite.setFrame(sprite.getData('idleFrame'));
            }

            // Reset for next frame
            sprite.setData('isActive', false);
        });

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
        let x = spawnX;
        let y = spawnY;

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
            let newX = spawnX;
            let newY = spawnY;

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

    onHatchOverlap(player, hatch) {
        hatch.setFrame(hatch.getData('activeFrame'));
        hatch.setData('isActive', true);
        this.currentHatch = hatch;
        this.interactText.setVisible(true);
    }

}


