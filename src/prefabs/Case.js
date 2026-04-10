/*
    created by Raven Ruiz
    Dates: 4/9/2026
    Description: [WIP] Uses provided Grammar object to craft a case. Currently, it picks a crime, a victim, and two suspects.
    Added character- and relationship-centric crime scenes, crime objects, and motive assignment.
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
    }

    getCrimeScene(grammar) {
        // collect locations from case characters
        const locations = [
            ...new Set([this.victim, ...this.suspects].flatMap((npc) => npc.locations)),
        ];

        return grammar.listPick(locations);
    }

    getObject(grammar){
        const activities = []
        const objects = []
        for (const suspect of this.suspects) {
            activities.push(...suspect.activities)
        }

        return grammar.getObjectFromActivities(activities);
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
}
