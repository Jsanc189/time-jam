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
        
    }

    tileRoom(x, y, roomWidth, roomHeight) {
        this.roomWidth = roomWidth;
        this.roomHeight = roomHeight;
        
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

    spawnRandomHatches(spriteKeys, roomTypes, spawnChance = 0.01) {
        const hatches = [];

        for (let x = this.tileWidth / 2; x < this.roomWidth - this.tileWidth / 2; x += this.tileWidth) {
            for (let y = this.tileHeight / 2; y < this.roomHeight - this.tileHeight / 2; y += this.tileHeight) {

                if (Math.random() < spawnChance) {
                    const spriteKey = Phaser.Utils.Array.GetRandom(spriteKeys);
                    const label = Phaser.Utils.Array.GetRandom(roomTypes);
                    const type = label.type;
                    const objectives = label.objectives;

                    // x, y are already centers
                    const hatch = this.scene.physics.add.sprite(
                        x,
                        y,
                        spriteKey
                    )
                    .setScale(0.25)
                    .setInteractive({ cursor: 'pointer' });

                    // 🔹 Attach the label directly to the sprite
                    hatch.setData('label', type);
                    hatch.setData('objectives', objectives);

                    // Label text above the hatch
                    const LABELTEXT = this.scene.add.text(
                        x,
                        y - 40,
                        label
                    )
                    .setOrigin(0.5)
                    .setDepth(999)
                    .setVisible(false);

                    // Hover behavior
                    hatch.on('pointerover', () => {
                        LABELTEXT.setVisible(true);
                        hatch.setTint(0xffff99);
                        hatch.setScale(0.3);
                    });

                    hatch.on('pointerout', () => {
                        LABELTEXT.setVisible(false);
                        hatch.clearTint();
                        hatch.setScale(0.25);
                    });

                    // Optional: keep wrapper object if you like
                    hatches.push({
                        sprite: hatch,

                    });
                }
            }
        }

        return hatches;
    }

}