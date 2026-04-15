/*
    Created by: Jackie Sanchez
    Date: 4/7/2026
    Description: This is the options menu scene.  This is where the player can adjust the game settings 
    such as audio and controls.
*/

import GameText from '../prefabs/GameText';
import Button from '../prefabs/Button';

export default class OptionsScene extends Phaser.Scene {
    constructor() {
        super('OptionsScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#6e3318');
        const BUTTON_SPACING = 200;
        const POSITION_X= this.cameras.main.centerX;
        const POSITION_Y = this.cameras.main.centerY / 2.5;
        new GameText(
            this,
            POSITION_X,
            POSITION_Y,
            'Mystery Game Settings',
            {
                fontSize: '128px',
                color: '#fff',
            },
        ).setOrigin(0.5);

        //volume Label
        new GameText(
            this,
            POSITION_X / 2,
            POSITION_Y + BUTTON_SPACING,
            "Volume:",
            {
                fontSize: '64px',
                color: '#fff'
            }
        ).setOrigin(0.5);

        //Volume Slider
        const SLIDER_X = POSITION_X + BUTTON_SPACING;
        const SLIDER_Y = POSITION_Y + BUTTON_SPACING;

        const SLIDER_WIDTH = 450;
        const SLIDER_LEFT = SLIDER_X - SLIDER_WIDTH / 2;
        const SLIDER_RIGHT = SLIDER_X + SLIDER_WIDTH / 2;

        const VOLUME_BAR = this.add.rectangle(
            SLIDER_X,
            SLIDER_Y,
            SLIDER_WIDTH,
            10,
            0xffffff
        ).setOrigin(0.5);

        const INITIAL_X = SLIDER_LEFT + (this.sound.volume * SLIDER_WIDTH);
        const VOLUME_KNOB = this. add.circle(
            INITIAL_X,
            SLIDER_Y,
            15,
            0xffffff
        ).setInteractive({draggable: true}).setOrigin(0.5);

        this.input.setDraggable(VOLUME_KNOB);
        this.input.on("drag", (pointer, gameObject, dragX) =>{
            dragX = Phaser.Math.Clamp(dragX, SLIDER_LEFT, SLIDER_RIGHT);
            gameObject.x = dragX;

            const PERCENT = (dragX - SLIDER_LEFT) / SLIDER_WIDTH;
            this.sound.volume = PERCENT;
            localStorage.setItem("volume", PERCENT);
        });
        this.input.on("dragend", (pointer, gameObject) =>{
            if (gameObject === VOLUME_KNOB) {
                this.sound.play("testVolume", {volume: this.sound.volume});
            }
        });

        
        const MENU_BUTTON = new Button(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY + BUTTON_SPACING * 2,
            300,
            100,
            'Back to Menu',
            undefined,
            undefined,
            () => {
                this.scene.start('MenuScene');
            },
        );
    }
}
