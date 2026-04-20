/*
    created by Raven Ruiz
    Dates: 4/15/2026
    Description: Grammars class supports random content selection backed by a lexicon 
    (a dictionary of concatenated JSON data). Acts as an intermediary between game code
    and lexicon (interfaces with lexicon data directly).
*/

export default class Grammar {
    constructor(lexicon) {
        this.lexicon = lexicon;
    }

    getList(symbol) {
        return this.lexicon[symbol];
    }

    listPick(list, deleteChoice = true) {
        const pickIndex = Math.floor(Math.random() * list.length);
        const pick = list[pickIndex];

        // remove choice from list to prevent double-picking
        if (deleteChoice) list.splice(pickIndex, 1);
        return pick;
    }

    lexiconPick(symbol) {
        const list = this.getList(symbol);
        if (!list?.length) throw new Error(`[Grammar] Unknown symbol "${symbol}"`);

        return this.listPick(list, false);  // do not delete picks from lexicon; since it is on the registry, choices must be persistent
    }

    getArchetype() {
        return this.lexiconPick('archetype');
    }

    getCrime() {
        const crimeType = this.lexiconPick('crime');
        return {
            type: crimeType.name,
            object: '', // filled in after characters are selected
        };
    }

    getCastCharacter() {
        return this.lexiconPick('cast');
    }

    getMotives(relationships) {
        const motiveList = this.getList('motives');
        let motives = [];

        // if relationships arg is empty, assume stranger relationship bit
        if(!relationships){
            relationships = [{tag: "strangers"}];
        }

        for (const relationship of relationships) {
            motives.push(...motiveList[relationship.tag]);
        }

        return motives;
    }

    getCrimeObjectFromActivities(activities) {
        const allObjects = this.getList('crime_objects');
        const crimeObjects = [];

        // collects all possible objects for this set of activities
        for (const activity of activities) {
            if (allObjects[activity]) {
                crimeObjects.push(...allObjects[activity]);
            }
        }

        return this.listPick(crimeObjects);
    }

    getLocations(){
        return this.getList("locations");
    }

    getAllObjects() {
        return {
            crime_objects:    this.getList('crime_objects'),
            activity_objects: this.getList('activity_objects'),
            character_objects: this.getList('character_objects'),
            location_objects: this.getList('location_objects'),
        };
    }
}
