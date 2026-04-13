/*
    created by Raven Ruiz
    Dates: 4/13/2026
    Description: [WIP] Uses provided Grammar object to craft a character-driven case. Currently, it picks a crime, a victim, and two suspects.
    Added character- and relationship-centric crime scenes, crime objects, and motive assignment. Gathers character key locations, which in turn 
    contain relevant objects, to be used in map generation.
*/

import NPC from './NPC';

export default class Case {
    constructor(grammar, numSuspects) {
        this.crime = grammar.getCrime();

        // parties
        this.victim = new NPC(grammar.getCastCharacter(), 'victim');
        this.suspects = Array.from(
            { length: numSuspects },
            (c) => new NPC(grammar.getCastCharacter(), 'suspect'),
        );

        this.crime.scene = this.getCrimeScene(grammar);
        this.crime.object = this.getObject(grammar);
        this.assignMotives(grammar);

        this.investigationLocations = this.getLocations(grammar);
    }

    getCrimeScene(grammar) {
        // collect locations from case characters
        const locations = [
            ...new Set([this.victim, ...this.suspects].flatMap((npc) => npc.locations)),
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
        }

        // TODO: second pass
        // gather secondhand relationship data
        //  i.e. victim is my lover's enemy, victim is my friend's neighbor, etc...
    }

    getLocations(grammar) {
        const rooms = {};
        const locations = grammar.getLocations();

        for (const suspect of this.suspects) {
            const suspectName = suspect.name.toLowerCase()
            rooms[suspectName] = locations[suspectName];
            console.log(rooms[suspectName])

            if (rooms[suspectName][this.crime.scene] !== undefined){
                rooms[suspectName][this.crime.scene].crimeScene = true;
            }
        }

        return rooms;
    }
}
