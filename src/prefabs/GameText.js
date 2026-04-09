/*
    created by Jackie Sanchez
    Dates:4/8/2026
    Description: This is the GameText prefab.  This is a reusable text object that can be used throughout the game to display text to the player.  
    It has a typewriter effect and can be used for dialogue, narration, and other text-based interactions.
*/

import Phaser from 'phaser';

export default class GameText extends Phaser.GameObjects.Text {
    constructor(scene, x, y, text, style = {}) {
        const defaultStyle = {
            fontFamily: 'Special Elite',
            fontSize: '32px',
            color: '#ffffff',
            align:'center'
        };

    super(scene, x, y, text, {...defaultStyle, ...style});
    scene.add.existing(this);
    this.setOrigin(0.5);
    console.log('GameText created with text:', text);
    }
}