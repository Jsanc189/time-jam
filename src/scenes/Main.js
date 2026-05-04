/*
    Created by: Jackie Sanchez
    Date: 4/7/2026
    Description: This is the Main play scene.  This is where the main game will be played. 
    
    Edited: Raven Ruiz
    Date: 4/19/2026
    Description: Added case generation, objectives generation, and role choice buttons (defense, prosecution).
    
*/

import GameText from '../prefabs/GameText';
import Case from '../prefabs/Case';
import Button from '../prefabs/Button';
import ObjectivesController from "../prefabs/Objectives";
import { Game } from "phaser";
import AudioManager from '../audio/AudioManager';
import Ledger from '../prefabs/Ledger';
import DialogueBox from "../prefabs/DialogueBox";

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
    }

    create() {
        this.NUM_SUSPECTS = 2;
        this.NUM_OBJECTIVES = 10;
        this.DEFENSE_ROLE = 'defense';
        this.PROSECUTE_ROLE = 'prosecution';
        this.outOfTime = this.registry.set('outOfTime', false);
        this.audio = this.game.audio;
        this.time.delayedCall(500, () => {
            this.audio.playMusic("courtroom");
        });


        if (!this.registry.get('case')) {
            this.grammar = this.registry.get('grammar');
            this.case = new Case(this.grammar, this.NUM_SUSPECTS);

            this.registry.set('case', this.case);
            // this.testObjectives();

            this.ledger = new Ledger();
            this.registry.set('ledger', this.ledger)
        }

       const main_bg = this.add.image(
        this.cameras.main.centerX,
        this.cameras.main.centerY,
        'courtroom_bg'
       ).setOrigin(0.5).setScale(2);

        //button to get back to MenuScene
        const BUTTON_SPACING = 150;
        const MENU_BUTTON = new Button(
            this,
            this.cameras.main.centerX / 6 + 50,
            this.cameras.main.centerY / 6 ,
            300,
            100,
            'Back to Menu',
            undefined,
            undefined,
            () => {
                this.registry.set('case', null);
                this.registry.set('objectivesControl', null);
                this.game.audio.playSFX("gavel");
                this.audio.stopMusic();
                this.cameras.main.fadeOut(800, 0, 0, 0);   
                this.cameras.main.once('camerafadeoutcomplete', ()=>{
                    this.scene.start('MenuScene');
                })             
            },
        );
        this.mapLaunched = false;
        this.mapButton = new Button(
            this,
            this.cameras.main.centerX * 1.8,
            this.cameras.main.centerY / 6 + BUTTON_SPACING,
            300,
            100,
            'Go to Mind Palace',
            undefined,
            undefined,
            () => {
                this.game.audio.playSFX("gavel");
                // Create a fullscreen black overlay
                const overlay = this.add.rectangle(
                    0, 
                    0,
                    this.cameras.main.width,
                    this.cameras.main.height,
                    0x000000,
                    0
                ).setOrigin(0).setDepth(9999);

                if (!this.mapLaunched){
                    this.tweens.add({
                        targets: overlay,
                        alpha: 1,
                        duration: 500,
                        onComplete: () => {
                            // Launch MapScene behind the black screen
                            this.audio.stopMusic();
                            this.scene.launch('MapScene', { fadeIn: true });
                            this.scene.sleep(); // pause MainScene
                        }
                    });
                } else {
                    this.tweens.add({
                        targets: overlay,
                        alpha: 1,
                        duration: 400,
                        onComplete: () => {
                            this.audio.stopMusic();
                            // Launch MapScene behind the black screen
                            this.scene.wake('MapScene', { fadeIn: true });
                            this.scene.sleep(); // pause MainScene
                        }
                    });
                }

            },
        );

        this.evidenceButtons = [];  // holds evidence player finds in mind palace
        //button to open evidence notes
        this.EVIDENCE_BUTTON = new Button(
            this,
            this.cameras.main.centerX * 1.8,
            this.cameras.main.centerY / 6,
            300,
            100,
            'Evidence Found',
            undefined,
            undefined, () =>{
                this.notesOpen = !this.notesOpen;

                if (this.evidenceButtons) {
                    this.evidenceButtons.forEach((btn) => {
                        // btn.hide();
                        btn.destroy();
                    });
                }
                this.evidenceButtons = [];

                this.tweens.add({
                    targets: this.evidenceNotes,
                    x: this.notesOpen
                        ? this.cameras.main.centerX
                        : this.cameras.main.centerX * 3,
                    duration: 1000,
                    ease: 'Cubic.easeInOut',
                    onComplete: () => {
                        // only draw buttons once paper has slid in
                        if (this.notesOpen) {
                            this.presentEvidence();
                        }
                    }
                })
                this.game.audio.playSFX("notebook");
            }
        )
        this.notesOpen = false;
        this.evidenceNotes = this.add.sprite(
            this.cameras.main.centerX * 3,
            this.cameras.main.centerY,
            'paper2'
        )
        .setDepth(10)
        .setScale(.90);


        // player chooses defense or prosecution 
        this.choiceTextBG = this.add.image(
            this.cameras.main.centerX,
            this.cameras.main.centerY * 1.49,
            'text_bg2'
        ).setOrigin(0.5).setScale(1.49).setVisible(true);
        this.choiceText = new GameText(
            this,
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Choose your side:',
            {
                fontSize: '124px',
                fill: '#160402'
            }).setOrigin(0.5).setVisible(true);


        if(!this.case.playerRole){
            this.mapButton.hide();
            this.EVIDENCE_BUTTON.hide();
            
            const PICK_SIDE_DEFENSE = new Button(
                this,
                this.cameras.main.centerX - BUTTON_SPACING * 2,
                this.cameras.main.centerY + BUTTON_SPACING * 2,
                300,
                100,
                'DEFEND',
                undefined,
                undefined,
                () => {
                    this.case.playerRole = this.DEFENSE_ROLE;
                    this.objectivesControl = new ObjectivesController(
                        this.case,
                        this.grammar.getAllObjects(),
                        this.NUM_OBJECTIVES,
                    );
                    this.registry.set('objectivesControl', this.objectivesControl);

                    PICK_SIDE_DEFENSE.hide();
                    PICK_SIDE_PROSECUTION.hide();
                    this.mapButton.show();
                    this.judgeStand.setVisible(true);
                    this.judge.setVisible(true);
                    this.jury_back.setVisible(true);
                    this.jury_front.setVisible(true);
                    this.choiceText.setVisible(false);
                    this.choiceTextBG.setVisible(false);
                    this.EVIDENCE_BUTTON.show();
                    this.game.audio.playSFX("gavel");
                    for (let i = 0; i < this.jurorSprites.length; i++) {
                        this.jurorSprites[i].setVisible(true);
                        this.jurorStatus[i].setVisible(true);
                    }

                    //this.testObjectives();
                },
            );

            const PICK_SIDE_PROSECUTION = new Button(
                this,
                this.cameras.main.centerX + BUTTON_SPACING * 2,
                this.cameras.main.centerY + BUTTON_SPACING * 2,
                300,
                100,
                'PROSECUTE',
                undefined,
                undefined,
                () => {
                    this.case.playerRole = this.PROSECUTE_ROLE;
                    this.objectivesControl = new ObjectivesController(
                        this.case,
                        this.grammar.getAllObjects(),
                        this.NUM_OBJECTIVES,
                    );
                    this.registry.set('objectivesControl', this.objectivesControl);

                    PICK_SIDE_DEFENSE.hide();
                    PICK_SIDE_PROSECUTION.hide();
                    this.mapButton.show();
                    this.judgeStand.setVisible(true);
                    this.judge.setVisible(true);
                    this.jury_back.setVisible(true);
                    this.jury_front.setVisible(true);
                    this.choiceText.setVisible(false);
                    this.choiceTextBG.setVisible(false);
                    this.EVIDENCE_BUTTON.show();
                    this.game.audio.playSFX("gavel");
                    for (let i = 0; i < this.jurorSprites.length; i++) {
                        this.jurorSprites[i].setVisible(true);
                        this.jurorStatus[i].setVisible(true);
                    }

                    //this.testObjectives();
                },
            );
        }

        //judge and stand
        this.judge = this.add.image(
            this.cameras.main.centerX * 0.49,
            this.cameras.main.centerY * 0.85,
            'judge'
        ).setOrigin(0.5).setScale(0.5).setVisible(false);
        this.judgeStand = this.add.image(
            this.cameras.main.centerX * 0.95,
            this.cameras.main.centerY * 1.20 ,
            'judge_stand'
        ).setOrigin(0.5).setScale(1.75).setVisible(false);
      

        //jury stand and jury
        const juryX = 1.13;
        const juryY = 1.2;
        this.jury_back = this.add
            .image(
                this.cameras.main.centerX * juryX,
                this.cameras.main.centerY * juryY,
                'jury_back',
            )
            .setOrigin(0.5)
            .setScale(1.75)
            .setVisible(false);
        const jurors = ['fairy_out', 'goblin_out', 'human_out', 'orc_out', 'elf_out'];
        let jurorX = this.cameras.main.centerX * 1.28;
        let jurorY = this.cameras.main.centerY * 1.1;
        this.jurorSprites = [];

        this.jurorsSwayed = 0;
        this.jurorStatus = [];
        for (let i = 0; i < jurors.length; i++) {
            const newJuror = this.add
                .sprite(jurorX, jurorY, jurors[i])
                .setOrigin(0.5)
                .setScale(0.5)
                .setVisible(false);

            // add labels
            const newJurorLabel = new GameText(
                this,
                jurorX,
                this.cameras.main.centerY / 1.4,
                this.grammar.getJurorText('unsure', this.DEFENSE_ROLE),
                {
                    wordWrap: { width: 150 },
                },
            );

            newJurorLabel.setVisible(false);

            this.jurorStatus.push(newJurorLabel);

            if (jurors[i + 1] === 'goblin_out') {
                jurorY -= 40;
            } else if (jurors[i] === 'goblin_out' && jurors[i + 1] != 'goblin_out') {
                jurorY += 115;
            } else {
                jurorY + 80;
            }
            jurorX += 152;
            this.jurorSprites.push(newJuror);
        }

        this.jury_front = this.add
            .image(
                this.cameras.main.centerX * juryX,
                this.cameras.main.centerY * juryY,
                'jury_front',
            )
            .setOrigin(0.5)
            .setScale(1.75)
            .setVisible(false);

        this.dialogueBox = new DialogueBox(
            this,
            this.scale.width / 2, // centered X
            this.scale.height - 120, // near bottom of screen
            'paper1',
        );  
    }

    update() {
        if (this.registry.get('outOfTime')) {
            this.mapButton.hide();
        }

    }

    evidenceFound() {
        this.evidenceNotes.x = this.cameras.main.centerX;
    }

    presentEvidence() {
        let x = this.evidenceNotes.x - this.evidenceNotes.width / 4;
        let y = this.evidenceNotes.y - this.evidenceNotes.height / 3;
        for (let i = 0; i < this.ledger.discoveries.length; i++) {
            const discovery = this.ledger.discoveries[i];
            
            let btn;
            btn = new Button(this, x, y, 300, 100, `${discovery.key}`, undefined, undefined, () => {
                console.log(
                    '[Main]: presenting discovery',
                    discovery.text,
                    discovery.redHerring,
                );
                this.updateJury(discovery.redHerring);

                // destroy and remove from array
                btn.destroy();
                this.ledger.discoveries.splice(i, 1);

                // hide notes
                if (this.evidenceButtons) {
                    this.evidenceButtons.forEach((btn) => {
                        // btn.hide();
                        btn.destroy();
                    });
                }
                this.evidenceButtons = [];

                this.notesOpen = false;
                this.tweens.add({
                    targets: this.evidenceNotes,
                    x: this.cameras.main.centerX * 3,
                    duration: 1000,
                    ease: 'Cubic.easeInOut',
                });
                this.game.audio.playSFX("notebook");

                // evidence dialogue
                let messages = [
                    { messages: discovery.text, speaker: 'YOU' },
                    { messages: this.grammar.getJudgeBark(discovery.redHerring), speaker: 'JUDGE' }
                ]
                this.dialogueBox.showDialogue(messages);
            });
            this.evidenceButtons.push(btn);
            y += 150;
        }
    }

    updateJury(redHerring) {
        if (!redHerring) {
            // add a point
            this.jurorsSwayed++;
            this.jurorStatus[this.jurorsSwayed-1].text = this.grammar.getJurorText('convinced', this.case.playerRole);

            if (this.jurorsSwayed === this.jurorStatus.length) {
                this.gameWin();
            }
        } else {
            // subtract a point
            if (this.jurorsSwayed > 0) {
                const notPlayerRole = this.case.playerRole === this.DEFENSE_ROLE ? this.PROSECUTE_ROLE : this.DEFENSE_ROLE;
                this.jurorStatus[this.jurorsSwayed-1].text = this.grammar.getJurorText('convinced', notPlayerRole);
                this.jurorsSwayed--;
            }
        }

        /// TODO: left off here; needs testing
    }

    gameWin() {
        new GameText(this, this.cameras.main.centerX, this.cameras.main.centerY, 'SUCCESS!', {
            fontSize: '120px',
        });
    }
}
