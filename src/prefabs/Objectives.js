/*
    Created by: Raven Ruiz
    Date: 4/17/2026
    Description: Objectives builds and tracks a series of investigation
    objectives derived from an active Case. Objectives are categorized by type
    (visit_room, find_item, uncover_motive) and can be triggered by game events
    via onRoomVisited() and onItemFound(). Role-specific objectives are appended
    once the player chooses defense or prosecution via applyRole().
*/

export default class ObjectivesController {
    constructor(caseData, numObjectives) {
        this.case = caseData;
        this.objectives = [];
        this.role = caseData.playerRole;
        this.numObjectives = numObjectives;

        this.addCrimeSceneObjectives();
        this.addSuspectRoomObjectives();
        // this.addMotiveObjectives();
    }

    addCrimeSceneObjectives() {
        const { crime } = this.case;

        this.add({
            id: 'crime_scene',
            label: `Examine the ${this.fmt(crime.scene)}`,
            description: `Visit the scene of the ${crime.type} to find the ${this.fmt(crime.object)}.`,
            category: 'investigation',
            roomType: crime.scene,              // picks background art
            requiredObjects: [crime.object],    // all must be interacted with; picks object sprites
            foundObjects : [],
            alwaysSpawn: true
        });
    }

    addSuspectRoomObjectives() {
        const { suspects, investigationLocations, defendant } = this.case;
        const pool = [];

        for (const suspect of suspects) {
            const isDefendant = (suspect.name === defendant.name);
            if(isDefendant && this.role === "defense"){
                continue;   // defense is NOT looking for evidence against defendant
            }

            if(isDefendant && this.role === "prosecution"){
                continue;   // prosecution is ONLY looking for evidence against defendant
            }

            const key = suspect.name.toLowerCase();
            const rooms = investigationLocations[key];
            if (!rooms) continue;

            for (const [roomName, roomData] of Object.entries(rooms)) {
                // notable items inside each room
                const allItems = [
                    ...(roomData.crime_objects ?? []),
                    ...(roomData.character_objects ?? []),
                    ...(roomData.activity_objects ?? []),
                ];

                pool.push({
                    id: `room_${key}_${roomName}`,
                    label: `Search ${suspect.name}'s ${this.fmt(roomName)}`,
                    description: `Investigate the ${this.fmt(roomName)} for evidence connected to ${suspect.name}.`,
                    category: 'suspect_investigation',
                    roomType: roomName,
                    suspect: suspect.name,
                    requiredObjects: allItems,
                    foundObjects: [],
                    alwaysSpawn: false,
                    meta: { isCrimeScene: !!roomData.crimeScene },
                });
            }

            // randomly pick {numObjectives} from the pool
            let selections = this.shuffle(pool);
            selections = selections.slice(0, this.numObjectives);

            for(const obj of selections){
                this.add(obj);
            }
        }
    }
/*
    addMotiveObjectives() {
        const { suspects, crime } = this.case;

        for (const suspect of suspects) {
            if (!suspect.motives?.length) continue;

            if((suspect.name === defendant.name) && this.role === "defense"){
                continue;   // defense is NOT looking for evidence against defendant
            }

            if((suspect.name !== defendant.name) && this.role === "prosecution"){
                continue;   // prosecution is ONLY looking for evidence against defendant
            }

            this.add({
                id: `uncover_motive_${suspect.name.toLowerCase()}`,
                label: `Uncover ${suspect.name}'s motive`,
                description: `Find evidence of why ${suspect.name} might have committed the ${crime.type}.`,
                type: 'uncover_motive',
                category: 'motive',
                target: { suspect: suspect.name, motives: [...suspect.motives] },
            });
        }
    }

    // called after player picks a side
    applyRole(role) {
        const { defendant, victim, crime } = this.case;

        if (role === 'prosecution') {
            this.add({
                id: 'prosecution_build_case',
                label: `Build the case against ${defendant.name}`,
                description: `Gather at least one piece of evidence from each location tied to ${defendant.name}.`,
                type: 'meta',
                category: 'role',
                target: { suspect: defendant.name },
            });
        }

        if (role === 'defense') {
            this.add({
                id: 'defense_alternate_suspect',
                label: 'Identify an alternate suspect',
                description: `Find evidence that implicates someone other than ${defendant.name} in the ${crime.type}.`,
                type: 'meta',
                category: 'role',
                target: {},
            });
        }
    }
*/

    // call when player enters a room. returns newly completed objectives.
    onRoomVisited(roomName) {
        this.currentRoom = roomName;
        return this.objectives.find((o) => !o.completed && o.roomType === roomName) ?? null;
    }

    // call when player examines an item. returns newly completed objectives.
    onItemFound(itemName) {
        if(!this.currentRoom) return null;

        const objective = this.objectives.find(
            (o) => !o.completed && o.roomType === this.currentRoom
        );
        if(!objective || !objective.requiredObjects.includes(itemName)) return null;

        if(!objective.foundObjects.includes(itemName)) {
            objective.foundObjects.push(itemName);
        }

        // complete this objective once every required object has been found
        const allFound = objective.requiredObjects.every((item) => objective.foundObjects.includes(item));
        
        return allFound ? this.completeById(objective.id) : null;
    }
/*
    // call when motive evidence is confirmed (you decide the trigger).
    onMotiveUncovered(suspectName) {
        return this.resolve(
            (o) =>
                o.type === 'uncover_motive' &&
                o.target.suspect.toLowerCase() === suspectName.toLowerCase(),
        );
    }
*/
    isWinConditionMet() {
        const crimeSceneDone = this.isComplete('crime_scene');
        const suspectObjectiveDone = this.objectives.every(o => o.completed);

        return crimeSceneDone && suspectObjectiveDone;
    }

    add(objective) {
        this.objectives.push({ completed: false, ...objective });
    }

    completeById(id) {
        const obj = this.objectives.find((o) => o.id === id && !o.completed);
        if (!obj) return null;
        obj.completed = true;
        return obj;
    }

    resolve(predicate) {
        return this.objectives
            .filter((o) => !o.completed && predicate(o))
            .map((o) => this.completeById(o.id))
            .filter(Boolean);
    }

    fmt(str = '') {
        return str.replace(/_/g, ' ');
    }

    // fisher-yates shuffle
    // https://coreui.io/answers/how-to-shuffle-an-array-in-javascript/
    shuffle(arr){
        const a = [...arr];
        for(let i = a.length -1; i > 0; i--){
            const j = Math.floor(Math.random() * (i+1));
            [a[i], a[j]] = [a[j], a[i]];
        }

        return a;
    }

    // helpers
    getAll() {
        return [...this.objectives];
    }
    getPending() {
        return this.objectives.filter((o) => !o.completed);
    }
    getCompleted() {
        return this.objectives.filter((o) => o.completed);
    }
    getByCategory(category) {
        return this.objectives.filter((o) => o.category === category);
    }
    getByType(type) {
        return this.objectives.filter((o) => o.type === type);
    }
    isComplete(id) {
        return !!this.objectives.find((o) => o.id === id)?.completed;
    }
    isAllComplete() {
        return this.objectives.every((o) => o.completed);
    }

    // helper to manually complete any objective by id
    complete(id) {
        return this.completeById(id);
    }

    getSummary() {
        const completed = this.getCompleted().length;
        const total = this.objectives.length;
        return { total, completed, pending: total - completed };
    }
}
