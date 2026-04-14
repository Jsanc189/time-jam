/*
    Created by: Sunny Han & Jackie Sanchez
    Date Created: 4/13/2026
    Updated by: Sunny Han
    Description: This is a Button prefab to use for the game.  It takes in a scene, x and y coordinates,
    a key for the texture, and a callback function to execute when the button is clicked.  
*/

import Phaser from 'phaser';
import GameText from './GameText';

export default class Button extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, width, height, text, textStyles, backgroundStyles, callback) {
        const finalTextStyles = { color: '#160402', ...textStyles };
        const finalBackgroundStyles = {
            backgroundColor: 0xe9cda2,
            borderColor: 0x43282b,
            ...backgroundStyles,
        };
        super(scene, x, y);
        this.scene.add.existing(this);
        // needs padding because generateTexture cuts the line stroke off
        const PADDING = 20;
        width = width + PADDING;
        height = height + PADDING;

        // create the button background
        const buttonBG = scene.make.graphics({ x: 0, y: 0, add: false });
        // Base button texture
        buttonBG.lineStyle(16, finalBackgroundStyles.borderColor);
        buttonBG.strokeRoundedRect(PADDING / 2, PADDING / 2, width - PADDING, height - PADDING, {
            tl: 16,
            tr: 16,
            bl: 16,
            br: 16,
        });
        buttonBG.fillStyle(finalBackgroundStyles.backgroundColor, 1);
        buttonBG.fillRoundedRect(PADDING / 2, PADDING / 2, width - PADDING, height - PADDING, 16);
        buttonBG.generateTexture('Button', width, height);

        // Hover texture — clear and redraw everything
        buttonBG.clear();
        const hoverColor = Phaser.Display.Color.ValueToColor(
            finalBackgroundStyles.backgroundColor,
        ).brighten(8).color;
        buttonBG.lineStyle(16, finalBackgroundStyles.borderColor);
        buttonBG.strokeRoundedRect(PADDING / 2, PADDING / 2, width - PADDING, height - PADDING, {
            tl: 16,
            tr: 16,
            bl: 16,
            br: 16,
        });
        buttonBG.fillStyle(hoverColor, 1);
        buttonBG.fillRoundedRect(PADDING / 2, PADDING / 2, width - PADDING, height - PADDING, 16);
        buttonBG.generateTexture('ButtonHover', width, height);

        // Click texture — clear and redraw everything
        buttonBG.clear();
        const clickColor = Phaser.Display.Color.ValueToColor(
            finalBackgroundStyles.backgroundColor,
        ).darken(32).color;
        buttonBG.lineStyle(16, finalBackgroundStyles.borderColor);
        buttonBG.strokeRoundedRect(PADDING / 2, PADDING / 2, width - PADDING, height - PADDING, {
            tl: 16,
            tr: 16,
            bl: 16,
            br: 16,
        });
        buttonBG.fillStyle(clickColor, 1);
        buttonBG.fillRoundedRect(PADDING / 2, PADDING / 2, width - PADDING, height - PADDING, 16);
        buttonBG.generateTexture('ButtonClick', width, height);

        this.newButton = scene.add.image(x, y, 'Button').setOrigin(0.5, 0.5);

        this.buttonText = new GameText(scene, x, y, text, {
            ...finalTextStyles,
        }).setOrigin(0.5, 0.5);

        // button hover effect
        let isDown = false;
        this.newButton
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                isDown = true;
                this.newButton.setTexture('ButtonClick');
            })
            .on('pointerup', () => {
                if (isDown) {
                    callback(); // only fires if it was actually pressed
                }
                isDown = false;
                this.newButton.setTexture('ButtonHover');
            })
            .on('pointerout', () => {
                isDown = false;
                this.newButton.setTexture('Button');
            })
            .on('pointerover', () => {
                if (!isDown) this.newButton.setTexture('ButtonHover');
            });
    }
}
