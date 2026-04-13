/*
    Created by: Jackie Sanchez
    Date: 4/9/2026
    updated by: Jackie Sanchez
    Updated: 4/12/2026 - added player movement and animations to Player prefab
    Description: This is the player prefab for the Phaser game.  It will be used to create the player character and handle player 
    movement and interactions with the game world.
*/

import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'playerSheet', 0);
        
        
        //add the player to the scene and enable physics for world interactions
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setOrigin(0.5, 0.5);
        this.speed = 200;
        this.setScale(0.25);


        //input for the player to move for WASD and arrow keys
        this.cursors = scene.input.keyboard.createCursorKeys();
        this.keys = scene.input.keyboard.addKeys({
            W: Phaser.Input.Keyboard.KeyCodes.W,
            A: Phaser.Input.Keyboard.KeyCodes.A,
            S: Phaser.Input.Keyboard.KeyCodes.S,
            D: Phaser.Input.Keyboard.KeyCodes.D
        });
    }

    update() {
        let velocityX = 0;
        let velocityY = 0;

        //horizontal movement
        if (this.cursors.left.isDown || this.keys.A.isDown) {
            velocityX = -this.speed;
        } else if (this.cursors.right.isDown || this.keys.D.isDown) {
            velocityX = this.speed;
        }

        //vertical movement
        if (this.cursors.up.isDown || this.keys.W.isDown) {
            velocityY = -this.speed;
        } else if (this.cursors.down.isDown || this.keys.S.isDown) {
            velocityY = this.speed;
        }

        this.setVelocity(velocityX, velocityY);

        //diagonal movement normalization
        if (velocityX !== 0 && velocityY !== 0) {
            this.body.velocity.normalize().scale(this.speed);
        }

        //play animations based on movement direction
        if (velocityX === 0 && velocityY === 0) {
            this.anims.play('playerIdle', true);
        } else if (velocityX > 0) {
            this.anims.play('playerWalkRight', true);
        } else if (velocityX < 0) {
            this.anims.play('playerWalkLeft', true);
        } else if (velocityY < 0) {
            this.anims.play('playerWalkUp', true);
        } else if (velocityY > 0) {
            this.anims.play('playerWalkDown', true);
        }

    }


}