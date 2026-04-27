/*
    created by Raven Ruiz
    Dates: 4/15/2026
    Description: Uses provided Grammar object to craft a character-driven case. Currently, it picks a crime, a victim, two suspects, 
    and a defendant chosen from suspects. Added character- and relationship-centric crime scenes, crime objects, and motive assignment. 
    Gathers character key locations, which in turn contain relevant objects, to be used in map/room generation.
*/

import NPC from './NPC';

export default class Case {
    constructor(grammar, numSuspects) {
        this.crime = grammar.getCrime();

        // assign parties from cast characters
        // creat a copy of pool to prevent duplicate picks (i.e. pick victim as suspect, double suspects)
        const castPool = [...grammar.getList('cast')];

        this.victim = new NPC(grammar.listPick(castPool), 'victim');
        this.suspects = Array.from(
            { length: numSuspects },
            () => new NPC(grammar.listPick(castPool), 'suspect')
        );

        const defendantIndex = Math.floor(Math.random() * this.suspects.length)
        this.defendant = this.suspects[defendantIndex];
        this.suspects[defendantIndex].defendant = true;

        this.crime.scene = this.getCrimeScene(grammar);
        this.crime.object = this.getObject(grammar);

        this.assignMotives(grammar);

        this.investigationLocations = this.getLocations(grammar);

        this.playerRole = null; // selected by player on game start
    }

    getCrimeScene(grammar) {
        // collect locations from case characters
        const locations = [
            ...new Set([...this.suspects].flatMap((npc) => npc.locations)),
        ];

        return grammar.listPick(locations);
    }

    getObject(grammar) {
        const activities = [];
        const objects = [];
        for (const suspect of this.suspects) {
            activities.push(...suspect.activities);
        }

        return grammar.getCrimeObjectFromActivities(activities);
    }

    assignMotives(grammar) {
        // collect relationships between case characters

        // first pass:
        // collect relationship data between suspects and victim
        //  i.e. victim is my friend, victim is my neighbor, etc...
        for (let suspect of this.suspects) {
            const relationshipToVictim = suspect.relationships[this.victim.name];
            suspect.motives = grammar.getMotives(relationshipToVictim);

            if(!suspect.witnesses){
                suspect.witnesses = {};
            }

            if(!suspect.witnesses.motives){
                suspect.witnesses.motives = [];
            }

            suspect.witnesses.motives.push(grammar.getMotiveConvos(suspect.motives))
        }

        // TODO: second pass
        // gather secondhand relationship data
        //  i.e. victim is my lover's enemy, victim is my friend's neighbor, etc...
    }

    getLocations(grammar) {
        const rooms = {};
        const locations = grammar.getLocations();

        rooms.misc = locations.misc;    // stores room that arent tied to specific characters (like interrogation room)

        rooms[this.victim.name]

        for (const suspect of this.suspects) {
            const suspectName = suspect.name.toLowerCase()
            rooms[suspectName] = locations[suspectName];

            if (rooms[suspectName][this.crime.scene] !== undefined){
                rooms[suspectName][this.crime.scene].crimeScene = true;
            }
        }

        return rooms;
    }

    foundWeaponDialouge(suspect, location){
        suspect = suspect.charAt(0).toUpperCase() + suspect.slice(1);   // capitalize
        
        const roleOpinionBank = { 
            not_guilty: "But that alone doesn't prove their guilt.",
            guilty: "And I'm going to prove they did it."
        };

        // TODO: more sophisticated reflections
        let reflection = "";
        if(this.playerRole === "defense"){  
            // player is defense --> suggest defendant innocence, anyone else guilty
            if(this.defendant.name.toLowerCase() === suspect.toLowerCase()){
                reflection += roleOpinionBank.not_guilty
            } else {
                reflection += roleOpinionBank.guilty
            }
        } else {    
            // player is prosecution --> suggest defendant guilt, anyone else innocent
            if(this.defendant.name.toLowerCase() === suspect.toLowerCase()){
                reflection += roleOpinionBank.guilty
            } else { 
                reflection += roleOpinionBank.not_guilty
            }
        }
        
        let dialogue = "";

        // initial discovery dialogue, 
        //  when player goes to crime scene and discovers murder weapon
        if(location == this.crime.scene){
            dialogue = `${this.victim.name} was murdered with a ${this.crime.object.name.replace("_"," ")}. Locale points to ${suspect}.`
        }

        // when player finds the crime object at its location in mind palace
        if(location.includes("home")) location = "home";
        location = location.replace("_"," ");

        dialogue = `The murder weapon is in ${suspect}'s ${location}.`

        return `${dialogue} ${reflection}`
    }

    foundObjectDialogue(object, suspect, hasRelationToCrime){
        if (hasRelationToCrime) {
            return `Looks like ${suspect} may be involved with ${hasRelationToCrime}`;
            
        } else {
            // if its a crime object but not related to case, how can it be framed to make suspect look guilty anyways?
            if (object.potential_weapon) {
                return `What would ${suspect} need with a ${object.name}? Seems dangerous.`;
            }
        }

        return `${object}? Interesting`;
    }

    foundRelationshipEvenDialogue(suspect, relationship, event){
        const rel = `${this.victim.name} and ${suspect} had a ${relationship} relationship.`;
        const relEvent = `Looks like there was a ${event} between them, though.`;

        return `${rel} ${event}`
    }
}
