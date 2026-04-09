/*
    created by Raven Ruiz
    Dates: 4/9/2026
    Description: [WIP] Uses provided Grammar object to craft a case. Currently, it picks a crime, a victim, and two suspects.
*/

import NPC from "./NPC";

export default class Case {
    constructor(grammar) {
        this.grammar = grammar;

        this.crime = this.grammar.getCrime();
        this.parties = {
            victim: new NPC(this.grammar.getArchetype()),
            suspectA: new NPC(this.grammar.getArchetype()),
            suspectB: new NPC(this.grammar.getArchetype()),
        };
    }
}
