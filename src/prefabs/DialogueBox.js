/*
    Created by: Raven Ruiz
    Date Created: 4/27/2026
    Description: Extends GameText to display a dialouge box with text and a background image. Has typing effect.
*/

import Phaser from 'phaser';
import GameText from './GameText';

export default class DialogueBox extends GameText {
    constructor(scene, x, y, bgKey, options = {}) {
        const {
            speaker = '',
            typewriterSpeed = 40,
            textStyle = {},
            paddingX = 120,
            paddingY = 80,
        } = options;

        const defaultStyles = {
            fontSize: '64px',
            wordWrap: { width: 0 }, // updated after bg is measured
            color: '#000',
            ...textStyle,
        };

        super(scene, x, y, '', defaultStyles);

        this.typewriterSpeed = typewriterSpeed;
        this.typewriterEvent = null;

        this.bg = scene.add.image(x, y, bgKey).setOrigin(0.5);

        // size word wrap to fit inside bg
        this.setWordWrapWidth(this.bg.displayWidth - paddingX * 4);

        this.speakerLabel = scene.add
            .text(
                x - this.bg.displayWidth / 2 + paddingX * 2,
                y - this.bg.displayHeight / 2 + paddingY * 2,
                speaker,
                {
                    fontFamily: 'Special Elite',
                    fontSize: '72px',
                    color: '#43282b',
                },
            )
            .setOrigin(0, 0);

        // bg --> speakerLabel --> text
        this.bg.setDepth(10);
        if (this.speakerLabel) this.speakerLabel.setDepth(11);
        this.setDepth(12);

        this.setVisible(false);
        this.bg.setVisible(false);
        if (this.speakerLabel) this.speakerLabel.setVisible(false);

        this.queue = [];

        // click throughs
        this.inputListener = scene.input.on('pointerdown', () => {
            if (this.typewriterEvent) {
                this.completeDialogue();
            } else if (this.queue.length > 0) {
                this.showNext();
            } else {
                this.hideDialogue();
            }
        });
    }

    showDialogue(messages, speaker = null) {
        this.stopTypewriter();

        if (speaker) {
            this.setSpeaker(speaker);
        }

        this.queue = Array.isArray(messages) ? [...messages] : [messages];
        this.showNext();
    }

    showNext() {
        if (this.queue.length === 0) return;

        const message = this.queue.shift();

        this.setText('');
        this.setVisible(true);
        this.bg.setVisible(true);
        this.speakerLabel.setVisible(true);

        this.playTypewriter(message);
    }

    completeDialogue() {
        if (this.typewriterEvent) {
            const full = this.typewriterEvent.args[0]; // stored full text
            this.stopTypewriter();
            if(full) this.setText(full);
        }
    }

    hideDialogue() {
        this.stopTypewriter();
        this.setVisible(false);
        this.bg.setVisible(false);
        this.speakerLabel.setVisible(false);
    }

    setSpeaker(name) {
        if (this.speakerLabel) this.speakerLabel.setText(name);
    }

    playTypewriter(fullText) {
        let charIndex = 0;

        // store fullText in event so completeDialogue can read it
        this.typewriterEvent = this.scene.time.addEvent({
            args: [fullText],
            delay: this.typewriterSpeed,
            repeat: fullText.length - 1,
            callback: () => {
                charIndex++;
                this.setText(fullText.slice(0, charIndex));
            },
        });
    }

    stopTypewriter() {
        if (this.typewriterEvent) {
            this.typewriterEvent.remove(false);
            this.typewriterEvent = null;
        }
    }

    // clean up when scene shuts down
    destroy(fromScene) {
        this.stopTypewriter();
        this.bg?.destroy();
        this.speakerLabel?.destroy();
        super.destroy(fromScene);
    }
}
