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

    function processCard(queue: Item[]): void {
        let item: Item = queue.shift()
        let p: Player = g_state.getCurrPlayer()
        let pId: number = g_state.CurrPlayer
        let deck: number = item.values[0]
        let card: Cards.Card = Cards.drawCard(deck)
        let msg: string = card.text
        let multiplier: number = 1
        if (card.action == Cards.Action.GoToGroup) {
            switch (card.values[0]) {
                case Properties.GROUP_UTIL:
                    multiplier = (g_state.BoardIndex == 0 ? card.values[1] : card.values[2])
                    break

                case Properties.GROUP_RR:
                    multiplier = card.values[1]
            }
            msg = msg.replace('%MULTIPLIER%', multiplier.toString())
        }
        game.splashForPlayer(pId, Cards.deckName(deck), msg)

        switch (card.action) {
            case Cards.Action.BankPays:
                queuePayment(queue, card.values[0], 0, pId)
                break

            case Cards.Action.BusTicket:
                p.BusTickets++
                g_state.updatePlayerStatus()
                break

            case Cards.Action.BusTicketExpireAll:
                for (let player of g_state.Players) {
                    player.BusTickets = 0
                }
                p.BusTickets = 1
                g_state.updatePlayerStatus()
                break

            case Cards.Action.CollectFromEachPlayer:
                for (let i: number = 1; i <= g_state.NumPlayers; i++) {
                    if (i != pId) {
                        queuePayment(queue, card.values[0], i, pId)
                    }
                }
                break

            case Cards.Action.GetOutOfJail:
                g_state.Properties.state[Properties.GROUP_JAIL].properties[deck]
                    .owner = pId
                g_state.updatePlayerStatus()
                break

            case Cards.Action.GoToAny:
                // Use same mechanism as rolling triples.
                break

            case Cards.Action.GoToGroup:
                for (let i: number = 0; i < g_state.Board.BoardSpaces.length; i++) {
                    let space: Space = g_state.getBoardSpace(i)
                    if (space.spaceType == SpaceType.Property &&
                            space.values[0] == card.values[0] &&
                            i > p.Location) {
                        p.Location = i
                        break
                    }
                }
                g_state.Board.Direction = 1
                p.startAnimation(1)
                p.PassedGo = false
                queue.insertAt(0, {
                    action: PlayerAction.MoveForCard,
                    values: [deck, multiplier,],
                })
                queue.insertAt(0, {
                    action: PlayerAction.Moving,
                    values: [],
                })
                break

            case Cards.Action.GoToSpace:
                if (card.values[0] == Cards.CardLocations.Jail) {
                    queue.insertAt(0, {
                        action: PlayerAction.GoToJail,
                        values: [],
                    })
                } else {
                    p.Location = g_state.Board.getCardLocation(card.values[0])
                    g_state.Board.Direction = 1
                    p.startAnimation(1)
                    p.PassedGo = false
                    queue.insertAt(0, {
                        action: PlayerAction.MoveForCard,
                        values: [deck,],
                    })
                    queue.insertAt(0, {
                        action: PlayerAction.Moving,
                        values: [],
                    })
                }
                break

            case Cards.Action.GoToSpaceAllPay:
                // TODO: Implement.
                break

            case Cards.Action.Lottery:
                // TODO: Implement.
                break

            case Cards.Action.MoveBackward:
                p.changeLocation(0 - card.values[0])
                g_state.Board.Direction = -1
                p.startAnimation(-1)
                queue.insertAt(0, {
                    action: PlayerAction.MoveForCard,
                    values: [deck,],
                })
                queue.insertAt(0, {
                    action: PlayerAction.Moving,
                    values: [],
                })
                break

            case Cards.Action.PayBank:
                queuePayment(queue, card.values[0], pId, 0)
                break

            case Cards.Action.PayEachPlayer:
                for (let i: number = 1; i <= g_state.NumPlayers; i++) {
                    if (i != pId) {
                        queuePayment(queue, card.values[0], 0, i)
                    }
                }
                if (g_state.NumPlayers > 1) {
                    queuePayment(queue, card.values[0] * (g_state.NumPlayers - 1), pId, 0)
                }
                break

            case Cards.Action.PayTax:
                // TODO: Implement.
                break

            case Cards.Action.Repairs:
                let houses: number = 0
                let hotels: number = 0
                let skyscrapers: number = 0
                g_state.Properties.state.forEach((pgs: Properties.GroupState, index: number) =>
                    pgs.properties.forEach((ps: Properties.State, index: number) => {
                        if (ps.houses == 6) {
                            skyscrapers++
                        } else if (ps.houses == 5) {
                            hotels++
                        } else {
                            houses += ps.houses
                        }
                    }
                ))
                let owed: number = houses * card.values[0] + hotels * card.values[1]
                if (card.values.length > 2) {
                    owed += skyscrapers * card.values[2]
                }
                queuePayment(queue, owed, pId, 0)
                break

            case Cards.Action.SkipNextTurn:
                // TODO: Implement.
                break
        }
    }

    function processGift(queue: Item[]): void {
        // TODO: Implement.
    }

    function processMove(queue: Item[]): void {
        let p: Player = g_state.getCurrPlayer()
        let space: Space = g_state.Board.BoardSpaces[p.Location]
        switch (space.spaceType) {
            case SpaceType.Auction:
                if (g_state.testMode) {
                    ActionQueueTestMode.processAuctionSpace(queue)
                } else {
                    // TODO: Implement
                }
                break

            case SpaceType.BusTicket:
                if (g_state.Bus) {
                    if (Cards.getBusTicketsRemaining() > 0) {
                        queue.insertAt(0, {
                            action: PlayerAction.DrawCard,
                            values: [Cards.BUS_DECK,],
                        })
                    } else {
                        game.splashForPlayer(g_state.CurrPlayer,
                            Strings.BOARD_BUS, Strings.BOARD_FREE_SPACE)
                    }
                } else {
                    // TODO: Process as if bus rolled on speed die.
                }
                break

            case SpaceType.Card:
                queue.insertAt(0, {
                    action: PlayerAction.DrawCard,
                    values: [space.values[0],],
                })
                break

            case SpaceType.Free:
                game.splashForPlayer(g_state.CurrPlayer, Strings.BOARD_FREE_PARKING,
                    Strings.BOARD_FREE_SPACE)
                break

            case SpaceType.Gift:
                if (g_state.testMode) {
                    ActionQueueTestMode.processGift(queue)
                } else {
                    processGift(queue)
                }
                break

            case SpaceType.Go:
                game.splashForPlayer(g_state.CurrPlayer, Strings.BOARD_GO,
                    Strings.BOARD_FREE_SPACE)
                break

            case SpaceType.GoToJail:
                queue.insertAt(0, {
                    action: PlayerAction.GoToJail,
                    values: [],
                })
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

            case SpaceType.Tax:
                let tax: Tax = TAXES[space.values[0]]
                queuePayment(queue, tax.value, g_state.CurrPlayer, 0)
                game.splashForPlayer(g_state.CurrPlayer,
                    Strings.PLAYER_PAY_TAX.replace('%PLAYERNAME%', p.Name).replace(
                    '%TAXNAME%', tax.name).replace('%TAXAMOUNT%', tax.value.toString()))
                break
        }
    }

    export function processQueue(queue: Item[]): void {
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
            return
        }

        let _: Item
        let p: Player = g_state.getCurrPlayer()
        let pId: number = g_state.CurrPlayer
        switch (queue[0].action) {
            case PlayerAction.StartTurn:
                _ = queue.shift()
                startCurrentPlayer(queue)
                break

            case PlayerAction.DrawCard:
                processCard(queue)
                break

            case PlayerAction.GoToJail:
                // Sending a player to jail clears the queue.
                while (queue.length > 0) {
                    _ = queue.shift()
                }
                p.goToJail()
                break

            case PlayerAction.MoveForCard:
                // If this is the top action in the queue,
                // + then the move has already been processed.
                _ = queue.shift()
                break

            case PlayerAction.MoveForRoll:
                startPlayerMove(queue)
                break

            case PlayerAction.MoveForTriples:
                // For now, just move the player.
                game.splashForPlayer(pId, 'Triples!')
                startPlayerMove(queue)
                // TODO: Implement properly.
                break

            case PlayerAction.Moving:
                movePlayer(queue)
                break

            case PlayerAction.NeedMoney:
                // TODO: Implement
                break

            case PlayerAction.PayMoney:
                if (g_state.testMode) {
                    ActionQueueTestMode.moveMoney(queue)
                } else {
                    moveMoney(queue)
                }
                break

            case PlayerAction.ProcessCard:
                // TODO: Implement
                break

            case PlayerAction.ProcessMove:
                _ = queue.shift()
                processMove(queue)
                break

            case PlayerAction.ProcessRoll:
                _ = queue.shift()
                processRoll(queue)
                break

            case PlayerAction.ProcessRollInJail:
                _ = queue.shift()
                if (g_state.testMode) {
                    ActionQueueTestMode.processJailRoll(queue)
                } else {
                    // TODO: Process jail roll.
                }
                break

            case PlayerAction.ProcessSpeedDie:
                processSpeedDie(queue)
                break

            case PlayerAction.ReceiveMoney:
                // TODO: Implement
                break

            case PlayerAction.Rolling:
                moveDice(queue)
                break
        }
    }

    /**
     * Process existing player roll as a roll to move.
     * @param: queue Current action queue.
     */
    function processRoll(queue: Item[]): void {
        let p: Player = g_state.getCurrPlayer()
        let d: Dice = p.Dice
        if (queue.length > 0) {
            let item: Item = queue[0]
            switch (item.action) {
                case PlayerAction.MoveForCard:
                    let pId: number = g_state.CurrPlayer
                    let space: Space = g_state.Board.BoardSpaces[p.Location]
                    let groupInfo: Properties.GroupInfo = g_state.Properties.info[space.values[0]]
                    let groupState: Properties.GroupState = g_state.Properties.state[space.values[0]]
                    let propertyInfo: Properties.Info = groupInfo.properties[space.values[1]]
                    let propertyState: Properties.State = groupState.properties[space.values[1]]
                    if (groupInfo.propertyType == Properties.PropertyType.Utility) {
                        item = queue.shift()
                        let owed: number = p.Roll * (g_state.BoardIndex == 0 ?
                            item.values[1] : item.values[2])
                        queuePayment(queue, owed, pId, propertyState.owner)
                    }
                    // TODO: Process roll for other cards.
                    break
            }
        } else {
            if (g_state.SpeedDie && d.AreTriples) {
                queue.push({
                    action: PlayerAction.MoveForTriples,
                    values: [d.Roll,],
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
    }

    function processSpeedDie(queue: Item[]): void {
        let item: Item = queue.shift()
        switch (item.values[0]) {
            case 4:
                if (g_state.testMode) {
                    ActionQueueTestMode.processSpeedDieBus(queue)
                } else {
                    processSpeedDieBus(queue)
                }
                break

            case 5:
            case 6:
                processSpeedDieMonopoly(queue)
                break
        }
    }

    function processSpeedDieBus(queue: Item[]): void {
        // TODO: Implement.
    }

    function processSpeedDieMonopoly(queue: Item[]): void {
        // Find nearest unowned property.
        let pId: number = g_state.CurrPlayer
        let p: Player = g_state.getCurrPlayer()
        let newLocation: number = p.Location + 1
        if (newLocation >= g_state.Board.BoardSpaces.length) {
            newLocation = 0
        }
        while (newLocation != p.Location) {
            let space: Space = g_state.getBoardSpace(newLocation)
            if (space.spaceType == SpaceType.Property) {
                let groupState: Properties.GroupState = g_state.Properties.state[space.values[0]]
                let propState: Properties.State = groupState.properties[space.values[1]]
                if (propState.owner == 0) {
                    break
                }
            }
            newLocation++
            if (newLocation >= g_state.Board.BoardSpaces.length) {
                newLocation = 0
            }
        }
        if (newLocation != p.Location) {
            p.Location = newLocation
            g_state.Board.Direction = 1
            p.startAnimation(1)
            p.PassedGo = false
            queue.insertAt(0, {
                action: PlayerAction.Moving,
                values: [],
            })
            return
        }
        // Move to next property that is owned and not mortgaged.
        newLocation = p.Location + 1
        if (newLocation >= g_state.Board.BoardSpaces.length) {
            newLocation = 0
        }
        while (newLocation != p.Location) {
            let space: Space = g_state.getBoardSpace(newLocation)
            if (space.spaceType == SpaceType.Property) {
                let groupState: Properties.GroupState = g_state.Properties.state[space.values[0]]
                let propState: Properties.State = groupState.properties[space.values[1]]
                if (propState.owner != pId && !propState.isMortgaged) {
                    break
                }
            }
            newLocation++
            if (newLocation >= g_state.Board.BoardSpaces.length) {
                newLocation = 0
            }
        }
        if (newLocation != p.Location) {
            p.Location = newLocation
            g_state.Board.Direction = 1
            p.startAnimation(1)
            p.PassedGo = false
            queue.insertAt(0, {
                action: PlayerAction.Moving,
                values: [],
            })
        } else {
            game.splashForPlayer(pId, Strings.ACTION_SPEED_DIE,
                Strings.ACTION_SPEED_DIE_MONOPOLY_NO_SPACE)
        }
    }

    export function queueJailRoll(queue: Item[]): void {
        let p: Player = g_state.getCurrPlayer()
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
            Strings.PLAYER_BUY_PROPERTY.replace('%PLAYERNAME%', p.Name)
                .replace('%PROPERTY%', propertyInfo.name)
                .replace('%VALUE%', propertyInfo.cost.toString()))
        p.changeBank(0 - propertyInfo.cost)
        propertyState.owner = pId
        Properties.updatePropertyGroup(groupState, space.values[0], g_state.BoardIndex)
        g_state.updatePlayerStatus()
    }

    export function moveMoney(queue: ActionQueue.Item[]): void {
        let item: ActionQueue.Item = queue.shift()
        let amount: number = item.values[0]
        let payerId: number = item.values[1]
        if (payerId > 0) {
            let payer: Player = g_state.getPlayer(payerId)
            payer.changeBank(0 - amount)
        }
        if (item.values.length > 2 && item.values[2] > 0) {
            let recipient: Player = g_state.getPlayer(item.values[2])
            recipient.changeBank(amount)
        }
    }

    export function processAuctionSpace(queue: ActionQueue.Item[]): void {
        // For now, just find the space with the highest rent.
        let pId: number = g_state.CurrPlayer
        let p: Player = g_state.getCurrPlayer()
        let newLocation: number = p.Location
        let rentOwed: number = 0
        let reviewing: number = p.Location + 1
        let spaceReviewed: Space = null
        let propFullInfo: Properties.FullInfo = null
        while (reviewing != p.Location) {
            if (reviewing >= g_state.Board.BoardSpaces.length) {
                reviewing = 0
            }
            spaceReviewed = g_state.getBoardSpace(reviewing)
            if (spaceReviewed.spaceType == SpaceType.Property) {
                propFullInfo = g_state.getPropertyInfo(reviewing)
                if (propFullInfo.propState.owner > 0 &&
                        propFullInfo.propState.owner != pId) {
                    let rent: number =
                        Properties.calculateRent(propFullInfo, g_state.BoardIndex)
                    if (rent > rentOwed) {
                        rentOwed = rent
                        newLocation = reviewing
                    }
                }
            }
            reviewing++
            if (reviewing >= g_state.Board.BoardSpaces.length) {
                reviewing = 0
            }
        }
        if (newLocation != p.Location) {
            p.Location = newLocation
            g_state.Board.Direction = 1
            p.startAnimation(1)
            p.PassedGo = false
            queue.insertAt(0, {
                action: PlayerAction.Moving,
                values: [],
            })
        }
    }

    export function processGift(queue: ActionQueue.Item[]): void {
        let pId: number = g_state.CurrPlayer
        let p: Player = g_state.getCurrPlayer()
        let space: Space = g_state.Board.BoardSpaces[p.Location]
        if (g_state.Bus) {
            if (Cards.getBusTicketsRemaining() > 0) {
                queue.insertAt(0, {
                    action: PlayerAction.DrawCard,
                    values: [Cards.BUS_DECK,],
                })
            } else {
                ActionQueue.queuePayment(queue, space.values[0], 0, pId)
            }
        } else {
            processSpeedDieBus(queue)
        }
    }

    export function processJailRoll(queue: ActionQueue.Item[]): void {
        let p: Player = g_state.getCurrPlayer()
        let pId: number = g_state.CurrPlayer
        let d: Dice = p.Dice
        let jailSpace: Space = g_state.getBoardSpace(g_state.Board.Jail)
        if (d.AreDoubles) {
            game.splash(Strings.ACTION_IN_JAIL_DOUBLES)
            p.InJail = false
            queue.push({
                action: PlayerAction.MoveForRoll,
                values: [d.Roll,],
            })
        } else {
            p.JailTurns++
            if (p.JailTurns == 3) {
                ActionQueue.queuePayment(queue, jailSpace.values[0], pId, 0)
                p.InJail = false
                queue.push({
                    action: PlayerAction.MoveForRoll,
                    values: [d.Roll,],
                })
            } else {
                g_state.nextPlayer()
            }
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
        let owed: number = Properties.calculateRent({
                groupInfo: groupInfo,
                groupState: groupState,
                propInfo: propertyInfo,
                propState: propertyState,
            }, g_state.BoardIndex)
        if (space.values[0] == Properties.GROUP_UTIL) {
            if (queue.length == 0) {
                owed *= p.Roll
            } else {
                let item: ActionQueue.Item = queue[0]
                if (item.action == PlayerAction.MoveForCard && item.values.length == 2) {
                    queue.insertAt(0, {
                        action: PlayerAction.Rolling,
                        values: [],
                    })
                    p.startRoll(2)
                    return
                } else {
                    owed *= p.Roll
                }
            }
        }
        if (space.values[0] == Properties.GROUP_RR && queue.length > 0) {
            let item: ActionQueue.Item = queue[0]
            if (item.action == PlayerAction.MoveForCard && item.values.length == 2) {
                owed *= item.values[1]
            }
        }
        let owner: Player = g_state.getPlayer(propertyState.owner)
        ActionQueue.queuePayment(queue, owed, pId, propertyState.owner)
        game.splashForPlayer(pId,
            Strings.PLAYER_OWES_PLAYER.replace('%PLAYERNAME%', p.Name)
                .replace('%OTHERPLAYER%', owner.Name)
                .replace('%AMOUNT%', owed.toString()))
    }

    export function processSpeedDieBus(queue: ActionQueue.Item[]): void {
        // Just move to the next card space.
        let pId: number = g_state.CurrPlayer
        let p: Player = g_state.getCurrPlayer()
        let newLocation: number = p.Location + 1
        if (newLocation >= g_state.Board.BoardSpaces.length) {
            newLocation = 0
        }
        while (newLocation != p.Location) {
            let space: Space = g_state.getBoardSpace(newLocation)
            if (space.spaceType == SpaceType.Card) {
                break
            }
            newLocation++
            if (newLocation >= g_state.Board.BoardSpaces.length) {
                newLocation = 0
            }
        }
        if (newLocation != p.Location) {
            p.Location = newLocation
            g_state.Board.Direction = 1
            p.startAnimation(1)
            p.PassedGo = false
            queue.insertAt(0, {
                action: PlayerAction.Moving,
                values: [],
            })
        } else {
            // This really should not happen.
            throw 'ActionQueueTestMode.processSpeedDieBus: No space found.'
        }
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
                game.splash('Using jail card.')
                jailCards[0].owner = 0
                p.InJail = false
                g_state.updatePlayerSprites()
                // Automatically roll in test mode.
                queue.push({
                    action: PlayerAction.Rolling,
                    values: [],
                })
                p.startRoll(g_state.SpeedDie ? 3 : 2)
            } else {
                ActionQueue.queueJailRoll(queue)
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