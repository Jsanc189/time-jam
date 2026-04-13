/*
    Created by: Jackie Sanchez
    Date: 4/13/2026
    Description:  This is the Rooms prefab.  It will be used to create the different rooms
    in the mind palace.  Each room will have its own unique layout and objects to interact with.
    It takes in a room type, size and texture.  It will also handle the logic for player interactions
    with objects in the room and transitioning between rooms.
*/

import Phaser from 'phaser';

export default class Rooms extends Phaser.GameObjects.Sprite {
    constructor(scene, tileKey, tileWidth, tileHeight, roomType) {
        super(scene, tileKey, tileWidth, tileHeight, roomType);
        this.scene = scene;
        this.tileKey = tileKey;
        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;
        this.roomType = roomType;
        //this.tiles = [];
        //this.objects = [];

    }

    tileRoom(x, y, roomWidth, roomHeight) {
        const columns = Math.ceil(roomWidth / this.tileWidth);
        const rows = Math.ceil(roomHeight / this.tileHeight);

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                // Create and position tiles
                this.scene.add.image(
                    x + col * this.tileWidth,
                    y + row * this.tileHeight,
                    this.tileKey
                ).setOrigin(0, 0).setScale(0.25);
            }
        }
    }


}