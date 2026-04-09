/*
    created by Raven Ruiz
    Dates: 4/9/2026
    Description: [WIP] Currently, Grammars class supports random content selector 
    backed by a lexicon (a dictionary of concatenated JSON data). 
*/

export default class Grammar {
    constructor(lexicon) {
        this.lexicon = lexicon;
        console.log(this.lexicon)

    }

    listPick(list){
        return list[Math.floor(Math.random() * list.length)];
    }

    lexiconPick(symbol) {
        const list = this.lexicon[symbol];
        if (!list?.length) throw new Error(`Grammar: unknown symbol "${symbol}"`);
        return this.listPick(list);
    }

    getArchetype() {
        return this.lexiconPick('archetype');
    }

    getCrime(){
        const crimeType = this.lexiconPick('crime');
        return {
            type: crimeType.name,
            object: this.listPick(crimeType.object)
        }
    }
}
