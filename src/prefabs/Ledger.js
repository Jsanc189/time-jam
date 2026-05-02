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
        for(let i = 0; i < this.awaitingPlayerChoice.length; i++){
            const discovery = this.awaitingPlayerChoice[i];
            if(!discovery.key){ continue; } // ignores flavor text
           
            this.discoveries.push(this.awaitingPlayerChoice[i]);
        }
        
        this.awaitingPlayerChoice = null;
        this.newDiscovery = false;
    }

    dismiss(){
        this.awaitingPlayerChoice = null;
        this.newDiscovery = false;
    }

    acknowledge(){
        this.newDiscovery = false;
        return this.getTexts();
    }

    getTexts(){
        const texts = [];
        for(const discoveryText of this.awaitingPlayerChoice){
            if(discoveryText.text){
                texts.push(discoveryText.text);
            } else {
                texts.push(discoveryText);
            }
        }
        return texts;
    }
}