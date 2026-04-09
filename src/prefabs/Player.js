/*
    Created by: Jackie Sanchez
    Date: 4/9/2026
    Description: This is the player prefab for the Phaser game.  It will be used to create the player character and handle player 
    movement and interactions with the game world.
*/

import Phaser from 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture = null, frame = null) {
        super(scene, x, y, texture, frame);
        //testing player with circle for now, will replace with sprite later
        const gfx = scene.make.graphics({x:0, y:0, add: false});
        gfx.fillStyle(0x00ff00, 1);
        gfx.fillCircle(16, 16, 16);
        const textureKey = 'player';
        gfx.generateTexture(textureKey, 32, 32);
        this.setTexture(textureKey);
        gfx.destroy();
        //add the player to the scene and enable physics for world interactions
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.setCollideWorldBounds(true);
        this.speed = 200;

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
    }


}