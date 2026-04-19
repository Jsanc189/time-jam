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
    constructor(caseData) {
        this.case = caseData;
        this.objectives = [];

        this.addCrimeSceneObjectives();
        this.addSuspectRoomObjectives();
        this.addMotiveObjectives();
    }

    addCrimeSceneObjectives() {
        const { crime } = this.case;

        // initial investigation stuff is the same for both player roles 

        this.add({
            id: 'examine_crime_scene',
            label: `Examine the ${this.fmt(crime.scene)}`,
            description: `Visit the scene of the ${crime.type} to gather initial clues.`,
            type: 'visit_room',
            category: 'investigation',
            target: { room: crime.scene },
        });

        this.add({
            id: 'find_crime_object',
            label: `Find the ${this.fmt(crime.object)}`,
            description: `Locate the ${this.fmt(crime.object)} connected to the ${crime.type}.`,
            type: 'find_item',
            category: 'evidence',
            target: { item: crime.object },
        });
    }

    addSuspectRoomObjectives() {
        const { suspects, investigationLocations } = this.case;

        for (const suspect of suspects) {
            const key = suspect.name.toLowerCase();
            const rooms = investigationLocations[key];
            if (!rooms) continue;

            for (const [roomName, roomData] of Object.entries(rooms)) {
                this.add({
                    id: `visit_${key}_${roomName}`,
                    label: `Search ${suspect.name}'s ${this.fmt(roomName)}`,
                    description: `Investigate the ${this.fmt(roomName)} for evidence connected to ${suspect.name}.`,
                    type: 'visit_room',
                    category: 'suspect_investigation',
                    target: { room: roomName, suspect: suspect.name },
                    meta: { isCrimeScene: !!roomData.crimeScene },
                });

                // objectives for notable items inside each room
                const allItems = [
                    ...(roomData.crime_objects ?? []),
                    ...(roomData.character_objects ?? []),
                    ...(roomData.activity_objects ?? []),
                ];
                for (const item of allItems) {
                    const itemId = `find_${key}_${roomName}_${item}`;
                    // avoid duplicates across rooms (e.g shared item keys)
                    if (this.objectives.find((o) => o.id === itemId)) continue;
                    this.add({
                        id: itemId,
                        label: `Examine the ${this.fmt(item)}`,
                        description: `Look for the ${this.fmt(item)} in the ${this.fmt(roomName)}.`,
                        type: 'find_item',
                        category: 'evidence',
                        target: { item, room: roomName, suspect: suspect.name },
                    });
                }
            }
        }
    }

    addMotiveObjectives() {
        const { suspects, crime } = this.case;

        for (const suspect of suspects) {
            if (!suspect.motives?.length) continue;
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

    // call when player enters a room. returns newly completed objectives.
    onRoomVisited(roomName) {
        return this.resolve((o) => o.type === 'visit_room' && o.target.room === roomName);
    }

    // call when player examines an item. returns newly completed objectives.
    onItemFound(itemName) {
        return this.resolve((o) => o.type === 'find_item' && o.target.item === itemName);
    }

    // call when motive evidence is confirmed (you decide the trigger).
    onMotiveUncovered(suspectName) {
        return this.resolve(
            (o) =>
                o.type === 'uncover_motive' &&
                o.target.suspect.toLowerCase() === suspectName.toLowerCase(),
        );
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
