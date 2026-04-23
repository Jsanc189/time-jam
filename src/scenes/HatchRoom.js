/*
    Created by: Jackie Sanchez and Raven Ruiz
    Date: 4/19/2026
    Updates by: Jackie Sanchez
    Date: 4/23/2026
    Update notes: Adds furniture to the scene based on hatch type.
    Description:  This scene will take in parameters to make a scene based on what
    type of hatch the player has visited.  It will have objective(s) to finish and it
    will progress time
*/
import { Game } from "phaser";
import GameText from "../prefabs/GameText";
import Button from '../prefabs/Button';
import Rooms from "../prefabs/Rooms";
import Player from "../prefabs/Player";

export default class HatchRoomScene extends Phaser.Scene {
    constructor() {
        super('HatchRoomScene');
    }

    init(data){
        this.label = data.label;
        this.objectives = data.objectives;
        this.tile = [Phaser.Utils.Array.GetRandom(data.floorFrames)];
    }

    create(){
;        //camera set up
        const cam = this.cameras.main;
        const viewWidth = cam.width;
        const viewHeight = cam.height;

        //tile the room
        this.tileWidth = 128;
        const TILER = new Rooms(this, 'floorTiles', this.tileWidth, this.tileWidth);

        TILER.tileRoom(
            0,
            0,
            viewWidth,
            viewHeight,
            this.tile
        );

        //rope to map.js
        const startY = -200;
        this.ropeTop = this.add.image(
            this.cameras.main.centerX / 8,
            startY,
            'rope_hatch',
            0
        )
        this.ropeBottom = this.add.image(
            this.cameras.main.centerX / 8,
            startY + this.ropeTop.height,
            'rope_hatch',
            1
        )
        this.tweens.add({
            targets:[this.ropeTop, this.ropeBottom],
            y: '+=200',
            duration: 1200,
            ease: 'Bounce.easeOut'
        })
        this.ropeTop.setInteractive({cursor: 'pointer'});
        this.ropeBottom.setInteractive({cursor: 'pointer'});
        this.ropeTop.on('pointerdown', ()=> this.returnToMap());
        this.ropeBottom.on('pointerdown', ()=> this.returnToMap());

        //Player sprite
        this.player = new Player(
            this,
            100,
            this.cameras.main.height - 100
        ).setDepth(2);

        this.player.play('playerIdle');
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D'
        });



        //Room assets  buffer is the # of empty pixels to the left of a sprite for placement
        this.roomAssets = {
            Library: {
                props: [
                    {id:"bigShelf", key: "bookshelves", frames: [0, 1, 2, 3, 4, 5, 6], buffer: 39},
                    {id: "smallShelf", key: "bookshelves", frames: [7, 8, 9, 10, 11, 12, 13, 14, 15], buffer: 145},
                    {id: "tables", key: "table_long", frames: [0], buffer: 0},
                    {id: "stool", key: "stools", frames:[0], buffer: 0},
                    {id: "lamp", key: "lamps", frames:[0, 1, 2], buffer:0}
                ]
            }
        }
        
        //physics for items in room
        this.furnitureGroup = this.physics.add.group({
            immovable: true,
            allowGravity: false
        });
        this.physics.add.collider(
            this.player, 
            this.furnitureGroup,
            this.shelfCollision,
            null, 
            this
        );

        this.spawnRoomProps();
    }

    update() {
        this.player.update();
    }

    returnToMap() {
        this.cameras.main.fadeOut(300, 0, 0);
        this.scene.get('MapScene').events.emit('timeSpent', 1800);//30 minutes
        this.scene.stop();
        this.scene.wake('MapScene');
    }

    spawnRoomProps() {
        const config = this.roomAssets[this.label];
        if (!config) {
            console.log("There is no config");
            return;
        }

        if (this.label === 'Library'){
            const bookshelves = config.props.filter(p=> p.key === 'bookshelves');
            if (bookshelves.length > 0) {
                this.placeBookshelfRows(bookshelves);
            }

            this.placeTables(config);

            const boundary = this.add.rectangle(
                this.cameras.main.centerX,
                325, 
                this.cameras.main.width,
                10,
                0x00000,
                0
            )
            this.physics.add.existing(boundary);
            boundary.body.setImmovable(true);
            boundary.body.allowGravity = false;
            this.physics.add.collider(this.player, boundary);
        }
        console.log("this is the config:", config);
    }

    // Two rows of bookshelves
    placeBookshelfRows(bookshelves) {
        const roomWidth = this.cameras.main.width;
        const roomHeight = this.cameras.main.height;

        const rowY1 = roomHeight * 0.15;
        const rowY2 = roomHeight * 0.30;

        this.placeBookshelfRow(bookshelves, rowY1);
        this.placeBookshelfRow(bookshelves, rowY2);
    }

    // One row of shelves
    placeBookshelfRow(bookshelves, y) {
        let x = 150;
        const maxX = this.cameras.main.width - 200;

        while (x < maxX) {

            // Pick a bookshelf type
            const shelfDef = Phaser.Utils.Array.GetRandom(bookshelves);
            const frame = Phaser.Utils.Array.GetRandom(shelfDef.frames);

            // Create the sprite
            const shelf = this.add.sprite(x, y, shelfDef.key, frame)
                .setOrigin(0, 0.5)
                .setScale(0.5);

            const bounds = shelf.getBounds();
            const visibleWidth = bounds.width;

            // Advance X by the visible width
            x += visibleWidth;
        }
    }

    //places random amount of tables with a max of 8
    placeTables(config) {
        const tableType = config.props.find(p => p.id === "tables");
        const stoolType = config.props.find(p => p.id === "stool");
        const lampType = config.props.find(p => p.id === "lamp");

        const rowY1 = this.cameras.main.height * 0.60;
        const rowY2 = this.cameras.main.height * 0.85;

        this.placeTableRow(tableType, rowY1);
        this.placeTableRow(tableType, rowY2);
    }

    placeTableRow(tableType, y) {
        const tableCount = Phaser.Math.Between(2, 4);

        const leftX = 350;
        const rightX = this.cameras.main.width - 250;

        const spacing = (rightX - leftX) / (tableCount - 1);

        for (let i = 0; i < tableCount; i++) {
            const x = leftX + spacing * i;
            const table = this.add.sprite(x, y, tableType.id, tableType.frames[0])
                .setOrigin(0.5)
                .setScale(0.5);

            this.physics.add.existing(table);
            table.body.setImmovable(true);

            const bounds = table.getBounds();
            table.body.setSize(bounds.width * 1.7, bounds.height);
            console.log("width: " + table.width + " scale: " + table.scaleX + " bounds width: " + bounds.width);
            table.body.setOffset(35, bounds.height * 0.04)
            this.furnitureGroup.add(table);
        }
    }

    PlaceStoolsAroundTable(table, stoolStyle) {

    }


}