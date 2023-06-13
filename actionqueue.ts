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

    function moveDice(queue: Item[]): void {
        let p: Player = g_state.getCurrPlayer()
        let stillRolling = p.moveDice()
        if (!stillRolling) {
            let _: Item = queue.shift()
            if (queue.length == 0) {
                // Assume we are rolling to start the player's move.
                queue.push({
                    action: PlayerAction.ProcessRoll,
                    values: [],
                })
            }
        }
    }

    function moveMoney(queue: Item[]): void {
        let item: Item = queue[0]
        let amount: number = item.values[0]
        let payerId: number = item.values[1]
        let recipientId: number = item.values[2]
    }

    function movePlayer(queue: Item[]): void {
        let p: Player = g_state.getCurrPlayer()
        if (p.Location != g_state.Board.CurrSpace ||
                (g_state.Board.Direction >= 0 && g_state.Board.getXCoordinate(p.Location) < p.Sprite.x) ||
                (g_state.Board.Direction < 0 && g_state.Board.getXCoordinate(p.Location) > p.Sprite.x)) {
            g_state.Board.move()
            Background.move()
            g_state.updatePlayerSprites()
        } else {
            p.stopAnimation()
            queue[0] = {
                action: PlayerAction.ProcessMove,
                values: [],
            }
        }
    }

    function processMove(queue: Item[]): void {
        let p: Player = g_state.getCurrPlayer()
        let space: Space = g_state.Board.BoardSpaces[p.Location]
        switch (space.spaceType) {
            case SpaceType.Free:
                game.splashForPlayer(g_state.CurrPlayer, Strings.BOARD_FREE_PARKING,
                    Strings.BOARD_FREE_SPACE)
                break

            case SpaceType.Go:
                game.splashForPlayer(g_state.CurrPlayer, Strings.BOARD_GO,
                    Strings.BOARD_FREE_SPACE)
                break

            case SpaceType.Jail:
                game.splashForPlayer(g_state.CurrPlayer, Strings.BOARD_JAIL,
                    Strings.BOARD_FREE_SPACE)
                break

            case SpaceType.Property:
                if (g_state.testMode) {
                    ActionQueueTestMode.processProperty(queue)
                }
                break
        }
    }

    export function processQueue(queue: Item[]): Item[] {
        if (queue.length == 0) {
            if (g_state.getCurrPlayer().DoublesRolled) {
                if (g_state.testMode) {
                    ActionQueueTestMode.startCurrentPlayer(queue)
                } else {
                    // Show player action menu.
                }
            } else {
                g_state.nextPlayer()
                startTurn(queue)
            }
            return queue
        }

        let _: Item
        switch (queue[0].action) {
            case PlayerAction.StartTurn:
                startCurrentPlayer(queue)
                _ = queue.shift()
                break

            case PlayerAction.MoveForRoll:
                startPlayerMove(queue)
                break

            case PlayerAction.Moving:
                movePlayer(queue)
                break

            case PlayerAction.PayMoney:
                if (g_state.testMode) {
                    ActionQueueTestMode.moveMoney(queue)
                } else {
                    moveMoney(queue)
                }
                break

            case PlayerAction.ProcessMove:
                _ = queue.shift()
                processMove(queue)
                break

            case PlayerAction.ProcessRoll:
                processRoll(queue)
                _ = queue.shift()
                break

            case PlayerAction.ProcessSpeedDie:
                // For now, ignore speed die.
                _ = queue.shift()
                break

            case PlayerAction.Rolling:
                moveDice(queue)
                break
        }
        return queue
    }

    /**
     * Process existing player roll as a roll to move.
     * @param: queue Current action queue.
     */
    function processRoll(queue: Item[]): void {
        let p: Player = g_state.getCurrPlayer()
        let d: Dice = p.Dice
        if (g_state.SpeedDie && d.AreTriples) {
            queue.push({
                action: PlayerAction.MoveForTriples,
                values: [],
            })
            return
        }
        p.DoublesRolled = d.AreDoubles
        if (p.DoublesRolled && p.TurnCount == 3) {
            queue.push({
                action: PlayerAction.GoToJail,
                values: [],
            })
            return
        }
        queue.push({
            action: PlayerAction.MoveForRoll,
            values: [d.Roll,],
        })
        if (g_state.SpeedDie && d.SpeedDie > 3) {
            queue.push({
                action: PlayerAction.ProcessSpeedDie,
                values: [d.SpeedDie,],
            })
        }
    }

    export function queuePayment(queue: Item[], amount: number, payer: number,
    recipient: number): void {
        queue.insertAt(0, {
            action: PlayerAction.PayMoney,
            values: [amount, payer, recipient]
        })
    }

    function startCurrentPlayer(queue: Item[]): void {
        let p: Player = g_state.getCurrPlayer()
        let playerStarted: boolean = p.startTurn()
        if (playerStarted) {
            g_state.hidePlayers()
            Background.show()
            g_state.Board.draw(p.Location)
            g_state.Board.Direction = 1
            g_state.updatePlayerStatus()
            if (g_state.testMode) {
                ActionQueueTestMode.startCurrentPlayer(queue)
            } else {
                // Show player action menu.
            }
        }
    }

    function startPlayerMove(queue: Item[]): void {
        let p: Player = g_state.getCurrPlayer()
        let spaces: number = queue[0].values[0]
        p.changeLocation(spaces)
        g_state.Board.Direction = spaces
        p.startAnimation(spaces)
        queue[0].action = PlayerAction.Moving
    }

    export function startTurn(queue: Item[]): void {
        queue.push({
            action: PlayerAction.StartTurn,
            values: []
        })
    }
}

namespace ActionQueueTestMode {
    function buyProperty(queue: ActionQueue.Item[]): void {
        let pId: number = g_state.CurrPlayer
        let p: Player = g_state.getCurrPlayer()
        let space: Space = g_state.Board.BoardSpaces[p.Location]
        let groupInfo: Properties.GroupInfo = g_state.Properties.info[space.values[0]]
        let groupState: Properties.GroupState = g_state.Properties.state[space.values[0]]
        let propertyInfo: Properties.Info = groupInfo.properties[space.values[1]]
        let propertyState: Properties.State = groupState.properties[space.values[1]]
        game.splashForPlayer(pId,
            Strings.PLAYER_BUY_PROPERTY.replace('%PLAYERNAME%', p.Name).replace(
                '%PROPERTY%', propertyInfo.name).replace('%VALUE%', propertyInfo.cost.toString()))
        p.changeBank(0 - propertyInfo.cost)
        propertyState.owner = pId
        let numOwned: number = groupState.properties.filter(
            (value: Properties.State, index: number) => value.owner == pId
        ).length
        if (numOwned == groupState.properties.length) {
            groupState.isMonopolyOwned = true
            groupState.canBuild = true
            groupState.owner = pId
        } else if (g_state.BoardIndex > 0 && numOwned == groupState.properties.length - 1) {
            groupState.isMonopolyOwned = false
            groupState.canBuild = true
            groupState.owner = pId
        } else {
            groupState.isMonopolyOwned = false
            groupState.canBuild = false
            groupState.owner = 0
        }
    }

    export function moveMoney(queue: ActionQueue.Item[]): void {
        let item: ActionQueue.Item = queue.shift()
        let amount: number = item.values[0]
        let payer: Player = g_state.getPlayer(item.values[1])
        payer.changeBank(0 - amount)
        if (item.values[2] > 0) {
            let recipient: Player = g_state.getPlayer(item.values[2])
            recipient.changeBank(amount)
        }
    }

    export function processProperty(queue: ActionQueue.Item[]): void {
        let pId: number = g_state.CurrPlayer
        let p: Player = g_state.getCurrPlayer()
        let space: Space = g_state.Board.BoardSpaces[p.Location]
        let groupInfo: Properties.GroupInfo = g_state.Properties.info[space.values[0]]
        let groupState: Properties.GroupState = g_state.Properties.state[space.values[0]]
        let propertyInfo: Properties.Info = groupInfo.properties[space.values[1]]
        let propertyState: Properties.State = groupState.properties[space.values[1]]
        if (propertyState.owner <= 0) {
            buyProperty(queue)
            return
        }
        if (propertyState.owner == pId) {
            game.splashForPlayer(pId, Strings.PLAYER_PROPERTY_OWNED)
            return
        }
        // Property is owned by another player.
        let owed: number = Properties.calculateRent(groupInfo, groupState, propertyInfo,
            propertyState, p.Dice.Roll, g_state.BoardIndex)
        let owner: Player = g_state.getPlayer(propertyState.owner)
        ActionQueue.queuePayment(queue, owed, pId, propertyState.owner)
        game.splashForPlayer(pId,
            Strings.PLAYER_OWES_PLAYER.replace('%PLAYERNAME%', p.Name).replace(
                '%OTHERPLAYER%', owner.Name).replace('%AMOUNT%', owed.toString()))
    }

    export function startCurrentPlayer(queue: ActionQueue.Item[]): void {
        let p: Player = g_state.getCurrPlayer()
        if (p.InJail) {
            // Any jail cards?
            let jailCards: Properties.State[] =
                g_state.Properties.state[Properties.GROUP_JAIL].properties.filter(
                (value: Properties.State, index: number) =>
                value.owner == g_state.CurrPlayer
            )
            if (jailCards.length > 0) {
                // Redeem jail card.
                jailCards[0].owner = 0
                p.InJail = false
                // Automatically roll in test mode.
                queue.push({
                    action: PlayerAction.Rolling,
                    values: [],
                })
                p.startRoll(g_state.SpeedDie ? 3 : 2)
            } else {
                queue.push({
                    action: PlayerAction.Rolling,
                    values: [],
                })
                queue.push({
                    action: PlayerAction.ProcessRollInJail,
                    values: [],
                })
                p.startRoll(2)
            }
        } else {
            // Automatically roll in test mode.
            queue.push({
                action: PlayerAction.Rolling,
                values: [],
            })
            p.startRoll(g_state.SpeedDie ? 3 : 2)
        }
    }
}