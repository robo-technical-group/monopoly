/**
 * Queue of player actions.
 */
namespace ActionQueue {
    export interface Item {
        action: PlayerAction
        values: number[]
    }

    export function buildFromState(state: any): Item[] {
        if (!Array.isArray(state)) {
            return []
        }
        let toReturn: Item[] = []
        for (let i of <any[]>state) {
            if (typeof i.action == 'number' &&
            Array.isArray(i.values)) {
                let newItem: Item = {
                    action: i.action,
                    values: []
                }
                if (i.values.length > 0 && typeof i.values[0] == 'number') {
                    for (let v of <number[]>i.values) {
                        newItem.values.push(v)
                    }
                }
                toReturn.push(newItem)
            }
        }
        return toReturn
    }

    export function processQueue(queue: Item[]): Item[] {
        return queue
    }
}
