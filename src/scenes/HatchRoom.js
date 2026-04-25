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
        this.objective = data.objective;
        this.tile = [Phaser.Utils.Array.GetRandom(data.floorFrames)];

        this.objectivesControl = this.registry.get('objectivesControl');
        console.log(this.objective);
    }

    create(){
        //camera set up
        //camera set up
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

        const isCrimeScene = (this.objective.roomID === "crime_scene") ? 
            " [CRIME SCENE]" :
            "";
        const TITLE_TEXT = new GameText(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            this.label + isCrimeScene + '\nObjective: ' + this.objective.label + (this.objective.redHerring ? "\n[RED HERRING]" : ""),
            {
               backgroundColor:'#43282b'
            }
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
            this.cameras.main.height - 200
        ).setDepth(3);

        this.player.play('playerIdle');
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keys = this.input.keyboard.addKeys({
            up: 'W',
            down: 'S',
            left: 'A',
            right: 'D'
        });


        // OBJECTIVE HANDLING
        // mark room as current in objectivesControl
        //      so controller knows which objective/room to poll for object handler
        this.objectivesControl.onRoomVisited(this.objective.roomID);

        // put objects in scene!
        this.placeObjects();
        //Room assets  buffer is the # of empty pixels to the left of a sprite for placement
        this.roomAssets = {
            library: {
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

    // TEMP: objects as buttons
    // made this function for testing, but it also demonstrates how to get and handle objects in this.objective!
    placeObjects(){
        const x = this.game.config.width - 300;
        let y = 0;
        const yStep = 150;
        
        // player has to find all requiredObjects to complete room
        for(const object of this.objective.requiredObjects){    
            y += yStep;
            const objectButton = new Button(
                this,
                x,
                y,
                300,
                100,
                `${object.name}`,
                undefined,
                undefined,
                () => {
                    // mark object as found
                    const handled = this.objectivesControl.onItemFound(object); 
                    console.log("[HatchRoom]", object, handled)

                    // dialogue associated with object
                    console.log(object.description)
                    console.log(object.barks)

                    // is it the murder weapon?
                    const crime = this.objectivesControl.case.crime;
                    if(object.name === crime.object.name){
                        console.log(`The murder weapon is in ${this.objective.suspect}'s ${this.objective.roomType}`)
                    } else {
                        // is it associated with the same activity that the murder weapon is associated with?
                        const relation = this.objectivesControl.areObjectsRelated(
                            object,
                            crime.object,
                        );
                        if (relation) {
                            console.log(
                                `${object.name} is associated with ${relation}, just like the murder weapon...`,
                            );
                        } else {
                            // if its a crime object but not related to case, how can it be framed to make suspect look guilty anyways?
                            // (character eval type beat)
                            if (object.potential_weapon) {
                                console.log(
                                    `Not the murder weapon but still sus to have a ${object.name} laying around you ${this.objective.roomType}...`,
                                );
                            }
                        }

                        // if its a motive room, what does this motive imply about the relationship between the suspect and the victim?
                        if (object.relationship) {
                            console.log(
                                `${this.objectivesControl.case.victim.name} and ${this.objective.suspect} had a ${object.relationship} relationship`,
                            );
                            console.log(`motive event: ${object.name}`);
                        }
                    }
                },
            );
            objectButton.setDepth(4)
        }
    }

    spawnRoomProps() {
         const config = this.roomAssets['library'];
        // console.log(this.objective.roomType);
        // console.log(config);
        // if (!config) {
        //     console.log("There is no config");
        //     return;
        // }

        //if (this.objective.roomType === 'library'){
        if (this.objective.roomType){
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
        const rowY2 = this.cameras.main.height * 0.90;

        this.placeTableRow(tableType, rowY1, stoolType, lampType);
        this.placeTableRow(tableType, rowY2, stoolType, lampType);
    }

    placeTableRow(tableType, y, stoolStyle, lampStyle) {
        const tableCount = Phaser.Math.Between(2, 4);

        const leftX = 350;
        const rightX = this.cameras.main.width - 250;

        const spacing = (rightX - leftX) / (tableCount - 1);

        for (let i = 0; i < tableCount; i++) {
            const x = leftX + spacing * i;
            const table = this.add.sprite(x, y, tableType.id, tableType.frames[0])
                .setOrigin(0.5)
                .setScale(0.5)
                .setDepth(1);

            this.physics.add.existing(table);
            table.body.setImmovable(true);

            const bounds = table.getBounds();
            table.body.setSize(bounds.width * 1.7, bounds.height * 0.5);
            console.log("width: " + table.width + " scale: " + table.scaleX + " bounds width: " + bounds.width);
            table.body.setOffset(40, bounds.height * .003)
            this.furnitureGroup.add(table);

            this.placeStoolsAroundTable(table, stoolStyle, i);
            this.placeLampOnTable(table, lampStyle);
        }
    }

    placeStoolsAroundTable(table, stoolStyle, tableNum) {
        const stoolCount = Phaser.Math.Between(1, 2);
        const bounds = table.getBounds();
        const halfWidth = bounds.width /2;
        const halfHeight = table.displayHeight /2;

        const positions = [
            { x: table.x - halfWidth - 10, y: table.y , pos: "left"},          // left
            { x: table.x + halfWidth + 10, y: table.y, pos: "right" },          // right
            { x: table.x, y: table.y - halfHeight - 5, pos: "top" },          // top
            { x: table.x, y: table.y + halfHeight + 5, pos: "bottom" }           // bottom
        ];



        Phaser.Utils.Array.Shuffle(positions);

        for (let i = 0; i < stoolCount; i++) {
            const stoolPosition = positions[i];
            
            const stool = this.add.sprite(stoolPosition.x, stoolPosition.y, stoolStyle.key, stoolStyle.frames[0])
                .setOrigin(0.5)
                .setScale(0.4);
        }
    }

    placeLampOnTable(table, lampType) {
        const frame = Phaser.Utils.Array.GetRandom(lampType.frames);

        const xPositions = [table.x - 40, table.x - 30, table.x - 20, table.x + 20, table.x + 30, table.x + 40]
        const lampX = Phaser.Utils.Array.GetRandom(xPositions)

        const lamp = this.add.sprite(lampX, table.y - 30, lampType.key, frame)
            .setOrigin(0.5)
            .setScale(0.35)
            .setDepth(2);
            
    }


}