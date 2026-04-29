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
        this.metaDialogue = grammar.getObjectMetaDialogue();
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

    pickRaw(pool) {
        return pool[Math.floor(Math.random() * pool.length)];
    }

    resolve(raw, tokens = {}) {
        return Object.entries(tokens).reduce(
            (str, [key, val]) => str.replace(new RegExp(`\\$${key}`, 'g'), val),
            raw
        );
    }

    getReflection(suspect, type) {
        const isDefendant = this.defendant.name.toLowerCase() === suspect.toLowerCase();
        const isGuilty = this.playerRole === 'defense' ? !isDefendant : isDefendant;
        const pool = this.metaDialogue[`${type}_reflection`][isGuilty ? 'guilty' : 'not_guilty'];
        return this.pickRaw(pool);
    }

    foundWeaponDialouge(suspect, location) {
        suspect = suspect.charAt(0).toUpperCase() + suspect.slice(1);

        const isAtCrimeScene = location === this.crime.scene;
        const pool = this.metaDialogue.found_weapon[isAtCrimeScene ? 'crime_scene' : 'elsewhere'];

        if (location.includes('home')) location = 'home';
        location = location.replace(/_/g, ' ');

        const dialogue = this.resolve(this.pickRaw(pool), {
            suspect,
            victim: this.victim.name,
            object: this.crime.object.name.replace(/_/g, ' '),
            location,
        });

        return [`${dialogue}`,`${this.getReflection(suspect, "role")}`];
    }

    foundObjectDialogue(object, suspect, hasRelationToCrime) {
        suspect = suspect.charAt(0).toUpperCase() + suspect.slice(1);
        const lines = [];

        if (object.description) {
            lines.push(this.resolve(object.description, {
                suspect,
                victim: this.victim.name,
            }));
        }

        if (object.dialogue) {
            for(const dialogue of object.dialogue){
                lines.push(this.resolve(dialogue, {
                    suspect,
                    victim: this.victim.name,
                }));
            }
        }

        if (hasRelationToCrime) {
            const raw = this.pickRaw(this.metaDialogue.relation_to_crime);
            lines.push(this.resolve(raw, {
                suspect,
                activity: hasRelationToCrime.replace(/_/g, ' '),
            }));
        }

        if(object.suspicious){
            const isDefendant = this.defendant.name.toLowerCase() === suspect.toLowerCase();
            const isGuilty = this.playerRole === 'defense' ? !isDefendant : isDefendant;
            const pickFrom = isGuilty ? 'guilty' : 'not_guilty';    
            const raw = this.pickRaw(this.metaDialogue.suspicious[pickFrom]);
            lines.push(this.resolve(raw, {
                suspect,
                object: object.name.replace(/_/g, ' '),
            }));
        }

        return lines;
    }

    foundRelationshipEventDialogue(suspect, motive) {
        suspect = suspect.charAt(0).toUpperCase() + suspect.slice(1);
        const tokens = { suspect, victim: this.victim.name };

        const rel = this.resolve(motive.description, tokens);
        const relEvent = this.resolve(this.pickRaw(motive.discovery_dialogue), tokens);
        const reflection = this.getReflection(suspect, "motive");

        return [rel, relEvent, reflection];
    }
}
