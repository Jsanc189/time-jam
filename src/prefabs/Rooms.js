/*
    Created by: Jackie Sanchez
    Date: 4/13/2026
    Description:  This is the Rooms prefab.  It will be used to create the different rooms
    in the mind palace.  Each room will have its own unique layout and objects to interact with.
    It takes in a room type, size and texture.  It will also handle the logic for player interactions
    with objects in the room and transitioning between rooms.

    Updated by: Raven Ruiz
    Date: 4/22/2026
    Description: Moved hatch drawing logic to a function, "addHatchAt(x, y)", for reusability. 
    Added a separate function to take a list of required rooms and add single hatches for each.
    Added a helped function to get random tile coordinates. Also added an array to store hatch locations
    to prevent overwrites.
*/

import Phaser from 'phaser';

export default class Rooms extends Phaser.GameObjects.Sprite {
    constructor(scene, tileKey, tileWidth, tileHeight, roomTypes) {
        super(scene, tileKey, tileWidth, tileHeight, roomTypes);
        this.scene = scene;
        this.tileKey = tileKey;

        this.tileWidth = tileWidth;
        this.tileHeight = tileHeight;

        this.roomTypes = roomTypes;
        
        // use to save room locations so random room spawner does not overlap!
        this.occupiedTiles = [];    
        this.hatchSprite;
    }

    tileRoom(x, y, roomWidth, roomHeight, framesToUse) {
        this.roomWidth = roomWidth;
        this.roomHeight = roomHeight;
        this.x = {
            min: this.tileWidth / 2,
            max: this.roomWidth - this.tileWidth / 2,
            step: this.tileWidth,
        }
        this.y = {
            min: this.tileHeight / 2,
            max: this.roomHeight - this.tileHeight / 2,
            step: this.tileHeight,
        }
        
        const columns = Math.ceil(roomWidth / this.tileWidth);
        const rows = Math.ceil(roomHeight / this.tileHeight);

        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < columns; col++) {
                // Create and position tiles
                const frame = Phaser.Utils.Array.GetRandom(framesToUse);
                this.scene.add.image(
                    x + col * this.tileWidth,
                    y + row * this.tileHeight,
                    this.tileKey,
                    frame
                ).setOrigin(0, 0).setScale(0.5);
            }
        }
    }

    spawnHatches(rooms){
        const hatches = [];

        for(const room of rooms){
            // place a hatch at a random coord
            const tile = this.getRandomEmptyTile();
            hatches.push({sprite: this.addHatchAt(tile.x, tile.y, room)});
        }

        return hatches;
    }

    addHatchAt(x, y, roomData){
        // x, y are already centers
        const hatch = this.scene.physics.add.sprite(
            x,
            y,
            this.hatchSprite.key,
            this.hatchSprite.frame
        )
        .setScale(0.5)
        .setInteractive({ cursor: 'pointer' });

        //  Attach the label directly to the sprite
        hatch.setData('label'       , roomData.roomType);
        hatch.setData('floorFrames' , roomData.floorFrames);

        // check if roomData represents an objective, or a red herring room
        //      objective room will always have requiredObjects
        hatch.setData('objective'   , roomData.requiredObjects ? roomData : null);
        hatch.setData('idleFrame'   , this.hatchSprite.frame);
        hatch.setData('activeFrame' , this.hatchSprite.activeFrame);

        return hatch;
    }

    getRandomEmptyTile() {
        const xRange = (this.x.max - this.x.min) / this.x.step;
        const yRange = (this.y.max - this.y.min) / this.y.step;

        let x = Math.floor(Math.random() * (xRange + 1)) * this.x.step + this.x.min;
        let y = Math.floor(Math.random() * (yRange + 1)) * this.y.step + this.y.min

        while(this.isTileOccupied(x,y) || this.isTileNearOccupied(x, y, 3) || this.isNearEdge(x, y, 2)){
            x = Math.floor(Math.random() * (xRange + 1)) * this.x.step + this.x.min;
            y = Math.floor(Math.random() * (yRange + 1)) * this.y.step + this.y.min
        }

        return { x: x, y: y }
    }

    isTileOccupied(x, y){
        return this.occupiedTiles.some((t) => { t.x === x && t.y === y});
    }

    isTileNearOccupied(x, y, bufferTiles){
        return this.occupiedTiles.some((t) => {
            const xDiff = Math.abs(t.x - x);
            const yDiff = Math.abs(t.y - y);
            return xDiff <= bufferTiles * this.x.step && yDiff <= bufferTiles * this.y.step;
        });
    }

    isNearEdge(x, y, edgeBuffer){
        const nearLeft = x <= this.x.min + edgeBuffer * this.x.tileWidth;
        const nearRight = x >= this.x.max - edgeBuffer * this.x.tileWidth;
        const nearTop = y <= this.y.min + edgeBuffer * this.y.tileHeight;
        const nearBottom = y >= this.y.max - edgeBuffer * this.y.tileHeight;
        return nearLeft || nearRight || nearTop || nearBottom;
    }

}