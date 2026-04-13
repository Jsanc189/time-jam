/*
    Created by: Jackie Sanchez
    Date Created: 4/9/2026
    Updated by: Jackie Sanchez
    Updated: 4/13/2026 - Adds sprite for clock face
    Description: This is a clock with hands and face.  The clock will be used in the game to represent the passage of time.  Time 
    iteration is made when the player moves into a room.  The clock will be used to show the player how much time has passed and how much time they 
    have left to solve the mystery.
*/

import Phaser from 'phaser';

export default class Clock extends Phaser.GameObjects.Container {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.scene.add.existing(this);
        
        //create the clock face and hands as separate sprites and add them to the container
        const SIZE = 132;
        const CLOCKFACE = scene.add.image(0, 0, 'clock');
        CLOCKFACE.setScale(0.15);
        CLOCKFACE.setOrigin(0.5, 0.5);

        //hourhand creation
        const gfx = scene.make.graphics({ x: 0, y: 0, add: false })
        gfx.fillStyle(0x000000, 1);
        gfx.fillRect(0, 0, 4, 20);
        gfx.generateTexture('hourHandTex', 4, 20);
        this.hourHand = scene.add.image(0, 0, 'hourHandTex');
        this.hourHand.setOrigin(0.5, 1);

        //minute hand creation
        gfx.clear();
        gfx.fillStyle(0x000000, 1);
        gfx.fillRect(0, 0, 2, 30);
        gfx.generateTexture('minuteHandTex', 2, 30);
        this.minuteHand = scene.add.image(0, 0, 'minuteHandTex');
        this.minuteHand.setOrigin(0.5, 1);
        gfx.destroy();

        //hand placement and scaling
        this.add(CLOCKFACE);
        this.add(this.hourHand);
        this.add(this.minuteHand);
        this.setSize(SIZE, SIZE);
        this.setPosition(x, y);
        this.setScale(4);

    }

    update() {
        
    }

    //move position of the clock to a new location through sliding motion
    moveTo(x, y) {
        this.scene.tweens.add({
            targets: this,
            x: x,
            y: y,
            duration: 1000,
            ease: 'Power2'
        });

    }

    updateTime(seconds) {
        //rotate the clock hands based on the time passed
        const hours = Math.floor(seconds / 3600) % 12;
        console.log('Hours:', hours);
        const minutes = Math.floor((seconds % 3600) / 60);

        const hourAngle = (hours + minutes / 60) * Phaser.Math.PI2 / 12;
        const minuteAngle = minutes * Phaser.Math.PI2 / 60;

        this.hourHand.setRotation(hourAngle);
        this.minuteHand.setRotation(minuteAngle);
    }
}