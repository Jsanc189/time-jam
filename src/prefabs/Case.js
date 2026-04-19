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

            if (rooms[suspectName][this.crime.scene] !== undefined){
                rooms[suspectName][this.crime.scene].crimeScene = true;
            }
        }

        return rooms;
    }
}
