/*
    Created by: Jackie Sanchez
    Date Created: 4/7/2026
    Updated by: Jackie Sanchez
    Updated: 4/21/2026 - Adding hatch interaction with "e" key
    Description: This is the map scene.  This is where the Mindpalace map will be displayed.  The
    player will be ablt to navigate their mind palace and interact with objects to learn more about the 
    story and progress through the game.

    Updated by: Raven Ruiz
    Updated: 4/22/2026
    Reworked to guarantee each objective maps to one room.
*/

import GameText from '../prefabs/GameText';
import Player from '../prefabs/Player';
import Clock from '../prefabs/Clock';
import Rooms from '../prefabs/Rooms';
import Button from '../prefabs/Button';
import DialogueBox from "../prefabs/DialogueBox";

export default class MapScene extends Phaser.Scene {
    constructor() {
        super('MapScene');
    }

    create(data) {
        this.objectivesControl = this.registry.get('objectivesControl');
        this.audio = this.game.audio;
        this.registry.set("okToFade", true);
        this.fadeIn();
        this.gameOverTriggered = false;
        this.audio.playMusic("mindPalace");
        this.audio.currentMusic.setVolume(0);

        // Fade in music
        this.time.delayedCall(300, () => {
            this.tweens.add({
                targets: this.audio.currentMusic,
                volume: this.audio.musicVolume,
                duration: 800
            });
        });
        
        //script for player instruction at start of scene
        this.dialogueStartBox = new DialogueBox(
            this,
            this.scale.width / 2, // centered X
            this.scale.height - 120, // near bottom of screen
            'paper1',
        );
        const introMessages = {
            messages: [
            "I have entered my Mind Palace.",
            "This is where I will piece together the case and prepare my argument for court.",
            "I can move with arrow keys or WASD.",
            "Let's start by exploring the rooms in my Mind Palace.",
            "I will record any important discoveries in my ledger.",
            ],
            speaker: 'YOU',
        };
        this.dialogueStartBox.showDialogue(introMessages);

        // World Setup
        this.tileWidth = 128;
        this.tileHeight = 128;
        this.worldWidth = this.cameras.main.width * 2;
        this.worldHeight = this.cameras.main.height * 2;

        const FLOOR_FRAMES = [0, 1, 2, 3];
        const TILER = new Rooms(this, 'floorTiles', this.tileWidth, this.tileHeight);
        TILER.tileRoom(0, 0, this.worldWidth, this.worldHeight, FLOOR_FRAMES);
        
        //Room Data
        const hatchImage = {key: 'rope_hatch', frame: 2, activeFrame: 3}
        TILER.hatchSprite = hatchImage;

        this.hatches = TILER.spawnHatches(
            this.objectivesControl.rooms
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
            this.registry.set("okToFade", true);
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
        const CLOCK_ITERATION_TIME = 2700; //45 minutes in seconds
        this.clockwarning = false;

        this.registry.set('clockStartTime', 0); //start time in seconds
        this.registry.set('maxSeconds', 43200); //12 hours in seconds
        this.registry.set('taskTime', CLOCK_ITERATION_TIME); // 45 minutes in seconds
        // this.registry.set('taskTime', 39600); //11 hours in seconds for testing

        this.clock = new Clock(this, CLOCK_POSITIONX, CLOCK_POSITIONY, 'clock');

        this.events.on('timeSpent', (seconds) =>{
            let current = this.registry.get('clockStartTime');
            current += seconds;
            this.registry.set('clockStartTime', current)
            this.clock.updateTime(current);
            this.checkEndGame();
        });

        //UI buttons
        const BUTTON_SPACING = 120;
        this.mainButton = new Button(
            this,
            this.cameras.main.centerX / 6 + 50,
            this.cameras.main.centerY / 6,
            300,
            100,
            'Back to Court',
            undefined,
            undefined,
            () => {
                this.game.audio.playSFX("gavel");
                this.scene.sleep();
                this.game.audio.stopMusic();
                this.registry.set('audioIsPlaying', false);
                this.scene.wake('MainScene');
                
            },
        );
        this.mainButton.setScrollFactor(0);

        //button to click to move clock up into view
        let clockTick;
        this.clockbutton = new Button(
            this,
            this.cameras.main.centerX * 1.8,
            this.cameras.main.centerY / 6,
            300,
            100,
            'Reveal Clock',
            undefined,
            undefined,
            () => {
                if (this.clock.y > this.cameras.main.centerY) {
                    this.clock.moveTo(this.cameras.main.centerX / 3, this.cameras.main.centerY * 0.80);
                } else {
                    this.clock.moveTo(CLOCK_POSITIONX, CLOCK_POSITIONY);
                }
                clockTick = this.game.audio.playSFX("clockCalm");
                this.time.delayedCall(2000, ()=>{ 
                   clockTick.stop();
                });
            },
        );
        this.clockbutton.setScrollFactor(0);

        this.dialogueBox = new DialogueBox(
            this,
            this.scale.width / 2, // centered X
            this.scale.height - 120, // near bottom of screen
            'paper1',
        );  


        // recording case discoveries
        this.ledger = this.registry.get('ledger');

        this.RECORD_BUTTON = new Button(
            this,
            this.cameras.main.centerX * 1.3,
            this.cameras.main.centerY + 100,
            300,
            100,
            'Record',
            undefined,
            undefined,
            () => {
                this.ledger.record();
                this.RECORD_BUTTON.hide();
                this.DISMISS_BUTTON.hide();
            },
        );
        this.RECORD_BUTTON.hide();

        this.DISMISS_BUTTON = new Button(
            this,
            this.cameras.main.centerX * 1.65,
            this.cameras.main.centerY + 100,
            300,
            100,
            'Dismiss',
            undefined,
            undefined,
            () => {
                this.ledger.dismiss();
                this.RECORD_BUTTON.hide();
                this.DISMISS_BUTTON.hide();
            },
        );
        this.DISMISS_BUTTON.hide();
    }

    update() {
        this.player.update();
        if(this.registry.get("okToFade")) {
            this.fadeIn();
        }

        if(this.registry.get('musicIsPlaying') == false) {
            this.audio.playMusic("mindPalace");
            this.registry.set('musicIsPlaying', true);
        }

        //check if player is almost out of time and play urgent clock sound
        const timeLeft = this.registry.get('maxSeconds') - this.registry.get('clockStartTime');

        if (timeLeft <= 3600 && !this.clockwarning && timeLeft > 0) {
            let quickClockTick;
            this.clockwarning = true;
            quickClockTick = this.game.audio.playSFX("clockUrgent");
            this.time.delayedCall(3000, () => {
                quickClockTick.stop();
            });
        }

        // check if player has moved away from hatch without entering
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

        // if player is in range of hatch and presses interact key, enter hatch
        if (this.currentHatch) {
            this.interactText.setVisible(true);
            
            if (Phaser.Input.Keyboard.JustDown(this.interactKey)) {
                const label = this.currentHatch.getData('label');
                const objective = this.currentHatch.getData('objective');
                const floorFrames = this.currentHatch.getData('floorFrames')
                const data = {label: label, objective: objective, floorFrames: floorFrames};
                this.scene.sleep('MapScene');
                this.scene.launch("HatchRoomScene", data);
                const hatchSound = this.game.audio.playSFX('hatch');
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

        if(this.ledger.newDiscovery){   // this means that a room objective has been completed!
            // ask player whether to record evidence in their ledger
            this.DISMISS_BUTTON.show();
            this.RECORD_BUTTON.show();

            this.dialogueBox.showDialogue({
                messages: this.ledger.acknowledge(),
                speaker: 'YOU',
            });
        }

    }

    checkEndGame (){
        if (this.registry.get('clockStartTime') >= this.registry.get('maxSeconds')) {
            this.gameOverTriggered = true;
            this.endGame();
        }
    }

    endGame() {
        //make player unable to move and hide UI
        if (this.player && this.player.body) {
            this.player.body.setVelocity(0, 0);
            this.player.body.enable = false;
            this.player.stop();
        }
        this.interactText.setDepth(-1);
        this.clockbutton.hide();
        this.mainButton.hide();

        // Dim the background
        const dimmer = this.add.rectangle(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000,
            0.6
        ).setScrollFactor(0).setDepth(900);

        // End‑game message
        const msgBG = this.add.sprite(
            this.cameras.main.centerX,
            this.cameras.main.centerY * 1.25,
            'text_bg'
        ).setScrollFactor(0).setScale(1.8);
        const msg = new GameText(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY - 100,
            "You have run out of time in your \nMind Palace.\nTime to give your argument to the court.",
            {
                fontSize: '75px',
                color: '#ffffff',
                align: 'center',
            }
        )
        .setScrollFactor(0)
        .setOrigin(0.5)
        .setDepth(1000);

        // Button to return to MainScene
        const btn = new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + 150,
            300,
            100,
            "Return to Court",
            undefined,
            undefined,
            () => {
                this.game.audio.stopSFX();
                this.scene.stop('MapScene');
                this.scene.wake('MainScene');
            }
        ).setDepth(1000);


        //set flag to trigger main.js end game sequence
        this.registry.set('outOfTime', true);
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

    fadeIn() {
        const overlay = this.add.rectangle(
            0,
            0,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000
        )
            .setOrigin(0)
            .setScrollFactor(0)
            .setDepth(9999)
            .setAlpha(1);
        this.tweens.add({
            targets: overlay,
            alpha: 0,
            duration: 750,
            ease: "Linear",
            onComplete: () => overlay.destroy()
        });
        this.registry.set("okToFade", false);
    }

    fadeOut() {
        const overlay = this.add.rectangle(
            0,
            0,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000,
            0
        ).setOrigin(0).setDepth(9999);

        this.tweens.add({
            targets: overlay,
            alpha: 1,
            duration: 1000,
            ease: "Linear",
        });
    }

}


