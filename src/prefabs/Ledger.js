/*
    created by Raven Ruiz
    Dates: 5/1/2026
    Description: Stores case info.
*/
export default class Ledger {
    constructor(characterData, role) {
        this.newDiscovery = false;
        this.awaitingPlayerChoice = null;
        this.discoveries = [];
    }

    discover(evidenceObject){
        this.newDiscovery = true;
        this.awaitingPlayerChoice = evidenceObject;
    }

    record(){
        for(let i = 0; i < this.awaitingPlayerChoice.length - 1; i++){ // ignores flavor text, which should always be the last string in the array
            this.discoveries.push(this.awaitingPlayerChoice[i]);    
        }
        
        this.awaitingPlayerChoice = null;
        this.newDiscovery = false;

        return this.discoveries[this.discoveries.length - 1];
    }

    dismiss(){
        this.awaitingPlayerChoice = null;
        this.newDiscovery = false;
    }

    acknowledge(){
        this.newDiscovery = false;
        return this.awaitingPlayerChoice;
    }
}