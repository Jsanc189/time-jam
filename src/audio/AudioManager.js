/*
    Created by: Jackie Sanchez
    Date: 4/16/2026
    Description: This is an audiomanager class that will handle all music and
    sfx that will play in the game across all scenes. It will play music or sfx
    based on a file key fed into it.  It also controls volumes.
*/

export default class AudioManager {
    constructor(scene) {
        this.scene = scene;

        //Load the saved settings
        let vol = parseFloat(localStorage.getItem("musicVolume")) || 1;
        this.musicVolume = vol;
        this.musicMute = localStorage.getItem("musicMute") ==="true";

        let sfxVol = parseFloat(localStorage.getItem("sfxVolume")) || 1;
        this.sfxVol = sfxVol;
        this.sfxMute = localStorage.getItem("sfxMute") === ("true");

        this.currentMusic = null;
    }

    playMusic(key) {
        //If we are playing the correct track, return
        if (this.currentMusic?.key === key) {
            return;
        }

        //stop previous track
        if (this.currentMusic) {
            this.currentMusic.stop();
        }

        //Create new track
        this.currentMusic = this.scene.sound.add(key, {
            loop: true,
            volume: this.musicVolume,
            mute: this.musicMute
        });

        this.currentMusic.play();
    }

    stopMusic(){
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }

    playSFX(key) {
        this.scene.sound.play(key, {
            volume: this.sfxVolume,
            mute: this.sfxMute
        });
    }

    setMusicVolume(value) {
        this.musicVolume = value;
        localStorage.setItem("musicVolume", value);

        if (this.currentMusic) {
            this.currentMusic.setVolume(value);
        }
    }

    setSFXVolume(value) {
        this.sfxVolume = value;
        localStorage.setItem("sfxVolume", value);
    }

    setMusicMute(state) {
        this.musicMute = state;
        localStorage.setItem("musicMute", state);

        if (this.currentMusic) {
            this.currentMusic.setMute(state);
        }
    }

    setSFXMute(state) {
        this.sfxMute = state;
        localStorage.setItem("sfxMute", state);
    }
}

