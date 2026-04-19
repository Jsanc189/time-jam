/*
    created by Raven Ruiz
    Dates: 4/9/2026
    Description: [WIP] Stores NPC stats.
*/
export default class NPC {
    constructor(characterData, role) {
        this.name = characterData.name
        this.archetype = characterData.archetype
        this.role = role
        this.locations = characterData.locations
        this.activities = [characterData.occupation, ...characterData.hobbies]

        this.relationships = characterData.relationships
    }
}