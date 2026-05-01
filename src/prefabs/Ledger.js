/*
    created by Raven Ruiz
    Dates: 5/1/2026
    Description: Stores case info.
*/
export default class Ledger {
    constructor(characterData, role) {
        this.newDiscovery = null;
        this.discoveries = [];
    }

    discover(evidenceObject){
        this.newDiscovery = evidenceObject;
    }

    record(){
        this.discoveries.push(this.newDiscovery);
        this.newDiscovery = null;
    }
}