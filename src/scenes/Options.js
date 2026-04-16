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
        const SLIDER_WIDTH = 450;
        new GameText(
            this,
            POSITION_X,
            POSITION_Y,
            'Settings',
            {
                fontSize: '128px',
                color: '#fff',
            },
        ).setOrigin(0.5);


        //Music Volume Slider
        this.createSlider(
            "Music Volume:",
            POSITION_X + BUTTON_SPACING,
            POSITION_Y + BUTTON_SPACING,
            SLIDER_WIDTH,
            this.game.audio.musicVolume,
            percent => this.game.audio.setMusicVolume(percent),
            null
        )

        //Music Mute
        this.createCheckbox(
            "Mute Music:",
            POSITION_X + BUTTON_SPACING,
            POSITION_Y + BUTTON_SPACING * 1.5,
            SLIDER_WIDTH,
            this.game.audio.musicMute,
            state => this.game.audio.setMusicMute(state),
            null
        )

        //SFX Volume Slider
        this.createSlider(
            "SFX Volume:",
            POSITION_X + BUTTON_SPACING,
            POSITION_Y + BUTTON_SPACING * 2,
            SLIDER_WIDTH, this.game.audio.sfxMute,
            percent => this.game.audio.setSFXVolume(percent),
            () => this.game.audio.playSFX("gavel")
        )

        //SFX Volume Mute
        this.createCheckbox(
            "Mute SFX:",
            POSITION_X + BUTTON_SPACING,
            POSITION_Y + BUTTON_SPACING * 2.5,
            SLIDER_WIDTH, this.game.audio.sfxMute,
            state => this.game.audio.setSFXMute(state),
            () => this.game.audio.playSFX("gavel")
        )

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

    createSlider(label, x, y, width, intialValue, onChange, onRelease) {
        new GameText(
            this, 
            x - 1.5 * width, 
            y, 
            label, 
            {
                fontSize: '64px',
                color: "#fff"
            }).setOrigin(0.5);
        const SLIDERCOLOR = 0xffffff;
        const KNOBCOLOR = 0x6588ff;

        const left = x -width / 2;
        const right = x + width / 2;

        this.add.rectangle(x, y, width, 10, SLIDERCOLOR).setOrigin(0.5);

        const knobX = left + intialValue * width;

        const knob = this.add.circle(knobX, y, 20, KNOBCOLOR)
        .setInteractive({ draggable: true })
        .setOrigin(0.5);

        knob.on("pointerover", () => {
            this.tweens.add({
                targets:knob,
                scale: 1.2,
                duration: 100,
                ease: "Quad.easeOut"
            });
        });

        knob.on("pointerout", () => {
            this.tweens.add({
                targets: knob,
                scale: 1,
                duration: 100,
                ease: "Quad.easeOut"
            })
        })

        knob.on("pointerdown", () => {
            this.tweens.add({
                targets:knob,
                scale: 0.9,
                duration: 80,
                ease:"Quad.easeIn"
            })
        })

        knob.on("pointerup", () => {
            this.tweens.add({
                targets: knob,
                scale: 1.2,
                duration: 80,
                ease: "Quad.easeOut"
            })
        })

        this.input.setDraggable(knob);

        this.input.on("drag", (pointer, gameObject, dragX) => {
            if (gameObject !== knob) return;

            dragX = Phaser.Math.Clamp(dragX, left, right);
            gameObject.x = dragX;

            const percent = (dragX - left) / width;
            onChange(percent);
        });

        this.input.on("dragend", (pointer, gameObject) => {
            if (gameObject === knob && onRelease) {
                onRelease();
            }
        });
        return knob;
    }


    createCheckbox (label, x, y, width, initialState, onToggle, onToggleSound) {
        new GameText(
            this,
            x - 1.5 * width,
            y,
            label,
            {
                fontSize: '64px',
                color: "#fff"
            }).setOrigin(0.5);
        
        const BOXWIDTH = 40;
        const BOXCOLOR = 0x000000
        const BOXSTROKE = 0xffffff

        const BOX = this.add.rectangle(x, y, BOXWIDTH, BOXWIDTH, BOXCOLOR)
        .setStrokeStyle(4, BOXSTROKE)
        .setInteractive();

        // Hover glow
        BOX.on("pointerover", () => {
            this.tweens.add({
                targets: BOX,
                scale: 1.15,
                duration: 120,
                ease: "Quad.easeOut"
            });
        });

        BOX.on("pointerout", () => {
            this.tweens.add({
                targets: BOX,
                scale: 1,
                duration: 120,
                ease: "Quad.easeOut"
            });
        });

        // Click bounce
        BOX.on("pointerdown", () => {
            this.tweens.add({
                targets: BOX,
                scale: 0.9,
                duration: 80,
                ease: "Quad.easeIn"
            });
        });

        BOX.on("pointerup", () => {
            this.tweens.add({
                targets: BOX,
                scale: 1.15,
                duration: 80,
                ease: "Quad.easeOut"
            });
        });

        const CHECKMARK = this.add.text(
            x, 
            y, 
            "✔",
            {
                fontSize: "48px",
                color: "#74c4fd"
        }).setOrigin(0.5);
        
        CHECKMARK.setVisible(initialState);

        BOX.on("pointerdown", ()=>{
            const newState = !CHECKMARK.visible;
            if (newState) {
                // Fade in checkmark
                CHECKMARK.setAlpha(0);
                CHECKMARK.setVisible(true);

                this.tweens.add({
                    targets: CHECKMARK,
                    alpha: 1,
                    duration: 150,
                    ease: "Quad.easeOut"
                });
            } else {
                // Fade out
                this.tweens.add({
                    targets: CHECKMARK,
                    alpha: 0,
                    duration: 150,
                    ease: "Quad.easeOut",
                    onComplete: () => CHECKMARK.setVisible(false)
                });
            }
            onToggle(newState);

            if (onToggleSound) {
                onToggleSound();
            }
        })

        return {BOX, CHECKMARK};
        
    }
}
