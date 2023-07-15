/**
 * Queue of player actions.
 */
interface ActionItem {
    action: PlayerAction
    values: number[]
}

class ActionQueue {
    protected data: ActionItem[]

    constructor() {
        this.data = []
    }

    /**
     * Public properties.
     */
    public get IsEmpty(): boolean {
        return this.data.length == 0
    }

    public get Length(): number {
        return this.data.length
    }
    
    public get State(): ActionItem[] {
        return this.data
    }

    /**
     * Queue manipulation functions.
     */
    public enqueue(value: ActionItem): void {
        this.data.push(value)
    }

    public peek(): ActionItem {
        return this.data[0]
    }

    public pop(): ActionItem {
        return this.data.shift()
    }

    public purge(): void {
        this.data = []
    }

    public push(value: ActionItem): void {
        this.data.insertAt(0, value)
    }

    /**
     * Other public functions.
     */
    public actionStartRoll(): void {
        let p: Player = g_state.getCurrPlayer()
        this.enqueue({
            action: PlayerAction.Rolling,
            values: [],
        })
        p.startRoll(g_state.SpeedDie ? 3 : 2)
    }

    public buildFromState(state: any): void {
        this.data = []
        if (!Array.isArray(state)) {
            return
        }
        for (let i of <any[]>state) {
            if (typeof i.action == 'number' &&
                Array.isArray(i.values)) {
                let newItem: ActionItem = {
                    action: i.action,
                    values: []
                }
                if (i.values.length > 0 && typeof i.values[0] == 'number') {
                    for (let v of <number[]>i.values) {
                        newItem.values.push(v)
                    }
                }
                this.data.push(newItem)
            }
        }
    }

    public processNext(): void {
        if (this.data.length == 0) {
            if (g_state.getCurrPlayer().DoublesRolled) {
                if (g_state.testMode) {
                    this.tmStartCurrentPlayer()
                } else {
                    this.showActionMenu(ActionMenuType.StartTurn)
                }
            } else {
                g_state.nextPlayer()
                this.startTurn()
            }
            return
        }

        let nextItem: ActionItem = this.peek()
        let _: ActionItem
        let p: Player = g_state.getCurrPlayer()
        let pId: number = g_state.CurrPlayer
        switch (nextItem.action) {
            case PlayerAction.StartTurn:
                _ = this.pop()
                this.startCurrentPlayer()
                g_state.Board.DoubleSpeed = false
                break

            case PlayerAction.DrawCard:
                this.processCard()
                break

            case PlayerAction.GoToJail:
                // Sending a player to jail clears the queue.
                this.data = []
                p.goToJail()
                break

            case PlayerAction.MoveForCard:
                // If this is the top action in the queue,
                // + then the move has already been processed.
                _ = this.pop()
                break

            case PlayerAction.MoveForRoll:
                this.startPlayerMove()
                break

            case PlayerAction.MoveForTriples:
                _ = this.pop()
                if (g_state.testMode) {
                    this.tmProcessTriples()
                } else {
                    // TODO: Implement.
                    game.splash('Triples! Need to implement.')
                }
                break

            case PlayerAction.MoveToLocation:
                this.startPlayerMoveToLocation()
                g_state.Board.DoubleSpeed = true
                break

            case PlayerAction.Moving:
                this.movePlayer()
                break

            case PlayerAction.NeedMoney:
                // TODO: Implement
                game.splash('Does this need to be implemented?')
                break

            case PlayerAction.PayMoney:
                if (g_state.testMode) {
                    this.tmMoveMoney()
                } else {
                    this.moveMoney()
                }
                break

            case PlayerAction.ProcessCard:
                // TODO: Implement
                game.splash('Does this need to be implemented?')
                break

            case PlayerAction.ProcessMove:
                _ = this.pop()
                this.processMove()
                break

            case PlayerAction.ProcessRoll:
                _ = this.pop()
                this.processRoll()
                break

            case PlayerAction.ProcessRollInJail:
                _ = this.pop()
                if (g_state.testMode) {
                    this.tmProcessJailRoll()
                } else {
                    // TODO: Process jail roll.
                    game.splash('Jail roll! Need to implement.')
                }
                break

            case PlayerAction.ProcessSpeedDie:
                this.processSpeedDie()
                break

            case PlayerAction.ReceiveMoney:
                // TODO: Implement
                game.splash('Does this need to be implemented?')
                break

            case PlayerAction.Rolling:
                this.moveDice()
                break
        }
    }

    public queueJailRoll(): void {
        let p: Player = g_state.getCurrPlayer()
        this.enqueue({
            action: PlayerAction.Rolling,
            values: [],
        })
        this.enqueue({
            action: PlayerAction.ProcessRollInJail,
            values: [],
        })
        p.startRoll(2)
    }

    public queuePayment(amount: number, payer: number,
        recipient: number): void {
        this.push({
            action: PlayerAction.PayMoney,
            values: [amount, payer, recipient]
        })
    }

    public startTurn(): void {
        this.enqueue({
            action: PlayerAction.StartTurn,
            values: []
        })
    }

    /**
     * Protected methods
     */
    protected moveDice(): void {
        let p: Player = g_state.getCurrPlayer()
        let stillRolling = p.moveDice()
        if (!stillRolling) {
            let _: ActionItem = this.pop()
            if (this.data.length == 0) {
                // Assume we are rolling to start the player's move.
                this.enqueue({
                    action: PlayerAction.ProcessRoll,
                    values: [],
                })
            }
        }
    }

    protected moveMoney(): void {
        let item: ActionItem = this.peek()
        let amount: number = item.values[0]
        let payerId: number = item.values[1]
        let recipientId: number = item.values[2]
        if (payerId > 0) {
            let payer: Player = g_state.getPlayer(payerId)
            if (payer.Bank >= amount) {
                item = this.pop()
                payer.changeBank(0 - amount)
                if (item.values.length > 2 && item.values[2] > 0) {
                    let recipient: Player = g_state.getPlayer(item.values[2])
                    recipient.changeBank(amount)
                }
            } else {
                // TODO: Implement.
                game.splash('moveMoney: Not enough cash! Need to implement.')
            }
        }
    }

    protected movePlayer(): void {
        let p: Player = g_state.getCurrPlayer()
        if (p.Location != g_state.Board.CurrSpace ||
                (g_state.Board.Direction >= 0 && g_state.Board.getXCoordinate(p.Location) < p.Sprite.x) ||
                (g_state.Board.Direction < 0 && g_state.Board.getXCoordinate(p.Location) > p.Sprite.x)) {
            g_state.Board.move()
            Background.move(g_state.Board.Speed)
            g_state.updatePlayerSprites()
        } else {
            p.stopAnimation()
            g_state.hideMovementMessage()
            this.data[0] = {
                action: PlayerAction.ProcessMove,
                values: [],
            }
        }
    }

    protected processCard(): void {
        let item: ActionItem = this.pop()
        let p: Player = g_state.getCurrPlayer()
        let pId: number = g_state.CurrPlayer
        let deck: number = item.values[0]
        let card: Cards.Card = Cards.drawCard(deck)
        let msg: string = card.text
        let multiplier: number = 1
        let newLocation: number = -1
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
                this.queuePayment(card.values[0], 0, pId)
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
                        this.queuePayment(card.values[0], i, pId)
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
                newLocation = p.Location + 1
                while (newLocation != p.Location) {
                    if (newLocation >= g_state.Board.BoardSpaces.length) {
                        newLocation = 0
                    }
                    let space: Space = g_state.getBoardSpace(newLocation)
                    if (space.spaceType == SpaceType.Property &&
                            space.values[0] == card.values[0]) {
                        break
                    }
                    newLocation++
                    if (newLocation >= g_state.Board.BoardSpaces.length) {
                        newLocation = 0
                    }
                }
                this.push({
                    action: PlayerAction.MoveForCard,
                    values: [deck, multiplier,],
                })
                this.push({
                    action: PlayerAction.MoveToLocation,
                    values: [newLocation,],
                })
                g_state.Board.DoubleSpeed = true
                break

            case Cards.Action.GoToSpace:
                if (card.values[0] == Cards.CardLocations.Jail) {
                    this.push({
                        action: PlayerAction.GoToJail,
                        values: [],
                    })
                } else {
                    this.push({
                        action: PlayerAction.MoveForCard,
                        values: [deck,],
                    })
                    this.push({
                        action: PlayerAction.MoveToLocation,
                        values: [g_state.Board.getCardLocation(card.values[0]),],
                    })
                    g_state.Board.DoubleSpeed = true
                }
                break

            case Cards.Action.GoToSpaceAllPay:
                // TODO: Implement.
                game.splash('Cards.Action.GoToSpaceAllPay: Need to implement.')
                break

            case Cards.Action.Lottery:
                // TODO: Implement.
                game.splash('Cards.Action.Lottery: Need to implement.')
                break

            case Cards.Action.MoveBackward:
                this.push({
                    action: PlayerAction.MoveForCard,
                    values: [deck,],
                })
                this.push({
                    action: PlayerAction.MoveForRoll,
                    values: [0 - card.values[0],],
                })
                g_state.Board.DoubleSpeed = true
                break

            case Cards.Action.PayBank:
                this.queuePayment(card.values[0], pId, 0)
                break

            case Cards.Action.PayEachPlayer:
                for (let i: number = 1; i <= g_state.NumPlayers; i++) {
                    if (i != pId) {
                        this.queuePayment(card.values[0], 0, i)
                    }
                }
                if (g_state.NumPlayers > 1) {
                    this.queuePayment(card.values[0] * (g_state.NumPlayers - 1), pId, 0)
                }
                break

            case Cards.Action.PayTax:
                // TODO: Implement.
                game.splash('Cards.Action.PayTax: Need to implement.')
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
                this.queuePayment(owed, pId, 0)
                break

            case Cards.Action.SkipNextTurn:
                // TODO: Implement.
                game.splash('Cards.Action.SkipNextTurn: Need to implement.')
                break
        }
    }

    protected processGift(): void {
        // TODO: Implement.
        game.splash('processGift: Need to implement.')
    }

    protected processMove(): void {
        let p: Player = g_state.getCurrPlayer()
        let space: Space = g_state.Board.BoardSpaces[p.Location]
        switch (space.spaceType) {
            case SpaceType.Auction:
                if (g_state.testMode) {
                    this.tmProcessAuctionSpace()
                } else {
                    // TODO: Implement
                    game.splash('Auction space: Need to implement.')
                }
                break

            case SpaceType.BusTicket:
                if (g_state.Bus) {
                    if (Cards.getBusTicketsRemaining() > 0) {
                        this.push({
                            action: PlayerAction.DrawCard,
                            values: [Cards.BUS_DECK,],
                        })
                    } else {
                        game.splashForPlayer(g_state.CurrPlayer,
                            Strings.BOARD_BUS, Strings.BOARD_FREE_SPACE)
                    }
                } else {
                    // TODO: Process as if bus rolled on speed die.
                    game.splash('SpaceType.BusTicket: Need to implement if not using bus tickets.')
                }
                break

            case SpaceType.Card:
                this.push({
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
                    this.tmProcessGift()
                } else {
                    this.processGift()
                }
                break

            case SpaceType.Go:
                game.splashForPlayer(g_state.CurrPlayer, Strings.BOARD_GO,
                    Strings.BOARD_FREE_SPACE)
                break

            case SpaceType.GoToJail:
                this.push({
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
                    this.tmProcessProperty()
                }
                break

            case SpaceType.Tax:
                let tax: Tax = TAXES[space.values[0]]
                this.queuePayment(tax.value, g_state.CurrPlayer, 0)
                game.splashForPlayer(g_state.CurrPlayer,
                    Strings.PLAYER_PAY_TAX.replace('%PLAYERNAME%', p.Name).replace(
                    '%TAXNAME%', tax.name).replace('%TAXAMOUNT%', tax.value.toString()))
                break
        }
    }

    /**
     * Process existing player roll.
     * @param: queue Current action queue.
     */
    protected processRoll(): void {
        let p: Player = g_state.getCurrPlayer()
        let d: Dice = p.Dice
        if (this.data.length > 0) {
            let item: ActionItem = this.peek()
            switch (item.action) {
                case PlayerAction.MoveForCard:
                    let pId: number = g_state.CurrPlayer
                    let space: Space = g_state.Board.BoardSpaces[p.Location]
                    let groupInfo: Properties.GroupInfo = g_state.Properties.info[space.values[0]]
                    let groupState: Properties.GroupState = g_state.Properties.state[space.values[0]]
                    let propertyInfo: Properties.Info = groupInfo.properties[space.values[1]]
                    let propertyState: Properties.State = groupState.properties[space.values[1]]
                    if (groupInfo.propertyType == Properties.PropertyType.Utility) {
                        item = this.pop()
                        let owed: number = p.Roll * (g_state.BoardIndex == 0 ?
                            item.values[1] : item.values[2])
                        this.queuePayment(owed, pId, propertyState.owner)
                    } else {
                        game.splash('processRoll: Need to implement for other card types.')
                    }
                    // TODO: Process roll for other cards.
                    break
            }
        } else {
            // Process roll as player's move.
            if (g_state.SpeedDie && d.AreTriples) {
                p.DoublesRolled = false
                this.enqueue({
                    action: PlayerAction.MoveForTriples,
                    values: [d.Roll,],
                })
                return
            }
            p.DoublesRolled = d.AreDoubles
            if (p.DoublesRolled && p.TurnCount == 3) {
                this.enqueue({
                    action: PlayerAction.GoToJail,
                    values: [],
                })
                return
            }
            this.enqueue({
                action: PlayerAction.MoveForRoll,
                values: [d.Roll,],
            })
            if (g_state.SpeedDie && d.SpeedDie > 3) {
                this.enqueue({
                    action: PlayerAction.ProcessSpeedDie,
                    values: [d.SpeedDie,],
                })
            }
            g_state.Board.DoubleSpeed = false
        }
    }

    protected processSpeedDie(): void {
        let item: ActionItem = this.pop()
        switch (item.values[0]) {
            case 4:
                if (g_state.testMode) {
                    this.tmProcessSpeedDieBus()
                } else {
                    this.processSpeedDieBus()
                }
                break

            case 5:
            case 6:
                this.processSpeedDieMonopoly()
                break
        }
    }

    protected processSpeedDieBus(): void {
        // TODO: Implement.
        game.splash('processSpeedDieBus: Need to implement.')
    }

    protected processSpeedDieMonopoly(): void {
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
            g_state.showMovementMessage(Strings.ACTION_SPEED_DIE_MONOPOLY)
            this.push({
                action: PlayerAction.MoveToLocation,
                values: [newLocation,],
            })
            g_state.Board.DoubleSpeed = true
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
            g_state.showMovementMessage(Strings.ACTION_SPEED_DIE_MONOPOLY)
            this.push({
                action: PlayerAction.MoveToLocation,
                values: [newLocation,],
            })
            g_state.Board.DoubleSpeed = true
        } else {
            game.splashForPlayer(pId, Strings.ACTION_SPEED_DIE,
                Strings.ACTION_SPEED_DIE_MONOPOLY_NO_SPACE)
        }
    }

    protected showActionMenu(menu: ActionMenuType): void {
        g_state.showMenu(menu)
        this.push({
            action: PlayerAction.WaitingForAction,
            values: []
        })
    }

    protected startCurrentPlayer(): void {
        let p: Player = g_state.getCurrPlayer()
        let playerStarted: boolean = p.startTurn()
        if (playerStarted) {
            g_state.hidePlayers()
            Background.show()
            g_state.Board.draw(p.Location)
            g_state.Board.Direction = 1
            g_state.Board.DoubleSpeed = false
            g_state.updatePlayerStatus()
            if (g_state.testMode) {
                this.tmStartCurrentPlayer()
            } else {
                if (p.InJail) {
                    this.showActionMenu(ActionMenuType.InJail)
                } else {
                    this.showActionMenu(ActionMenuType.StartTurn)
                }
            }
        }
    }

    protected startPlayerMove(): void {
        let p: Player = g_state.getCurrPlayer()
        let spaces: number = this.peek().values[0]
        let msg: string = Strings.ACTION_ROLLED
            .replace('%ROLL%', spaces.toString())
        if (spaces == 8 || spaces == 11) {
            msg = msg.replace(' a ', ' an ')
        }
        g_state.showMovementMessage(msg)
        p.OnGo = (p.Location == g_state.Board.Go)
        p.changeLocation(spaces)
        g_state.Board.Direction = spaces
        p.startAnimation(spaces)
        this.peek().action = PlayerAction.Moving
    }

    protected startPlayerMoveToLocation(): void {
        let p: Player = g_state.getCurrPlayer()
        let newLocation: number = this.peek().values[0]
        if (newLocation != p.Location) {
            p.OnGo = (p.Location == g_state.Board.Go)
            p.Location = newLocation
            g_state.Board.Direction = 1
            p.startAnimation(1)
            this.peek().action = PlayerAction.Moving
        } else {
            // Already at requested location.
            let _: ActionItem = this.pop()
            g_state.hideMovementMessage()
        }
    }

    /**
     * Test mode methods used in automated games.
     */
    protected tmBuyProperty(): void {
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

    protected tmMoveMoney(): void {
        let item: ActionItem = this.pop()
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

    protected tmProcessAuctionSpace(): void {
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
            this.push({
                action: PlayerAction.MoveToLocation,
                values: [newLocation,],
            })
            g_state.Board.DoubleSpeed = true
        }
    }

    protected tmProcessGift(): void {
        let pId: number = g_state.CurrPlayer
        let p: Player = g_state.getCurrPlayer()
        let space: Space = g_state.Board.BoardSpaces[p.Location]
        if (g_state.Bus) {
            if (Cards.getBusTicketsRemaining() > 0) {
                this.push({
                    action: PlayerAction.DrawCard,
                    values: [Cards.BUS_DECK,],
                })
            } else {
                this.queuePayment(space.values[0], 0, pId)
            }
        } else {
            this.processSpeedDieBus()
        }
    }

    protected tmProcessJailRoll(): void {
        let p: Player = g_state.getCurrPlayer()
        let pId: number = g_state.CurrPlayer
        let d: Dice = p.Dice
        let jailSpace: Space = g_state.getBoardSpace(g_state.Board.Jail)
        if (d.AreDoubles) {
            game.splash(Strings.ACTION_IN_JAIL_DOUBLES)
            p.InJail = false
            g_state.Board.redraw()
            this.enqueue({
                action: PlayerAction.MoveForRoll,
                values: [d.Roll,],
            })
            g_state.Board.DoubleSpeed = false
        } else {
            p.JailTurns++
            if (p.JailTurns == 3) {
                this.queuePayment(jailSpace.values[0], pId, 0)
                p.InJail = false
                g_state.Board.redraw()
                this.enqueue({
                    action: PlayerAction.MoveForRoll,
                    values: [d.Roll,],
                })
                g_state.Board.DoubleSpeed = false
            } else {
                // Move on to the next player.
                if (this.data.length > 0) {
                    // This really should not happen, but just in case?
                    this.data = []
                }
            }
        }
    }

    protected tmProcessProperty(): void {
        let pId: number = g_state.CurrPlayer
        let p: Player = g_state.getCurrPlayer()
        let space: Space = g_state.Board.BoardSpaces[p.Location]
        let groupInfo: Properties.GroupInfo = g_state.Properties.info[space.values[0]]
        let groupState: Properties.GroupState = g_state.Properties.state[space.values[0]]
        let propertyInfo: Properties.Info = groupInfo.properties[space.values[1]]
        let propertyState: Properties.State = groupState.properties[space.values[1]]
        if (propertyState.owner <= 0) {
            this.tmBuyProperty()
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
            if (this.data.length == 0) {
                owed *= p.Roll
            } else {
                let item: ActionItem = this.peek()
                if (item.action == PlayerAction.MoveForCard && item.values.length == 2) {
                    this.push({
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
        if (space.values[0] == Properties.GROUP_RR && this.data.length > 0) {
            let item: ActionItem = this.peek()
            if (item.action == PlayerAction.MoveForCard && item.values.length == 2) {
                owed *= item.values[1]
            }
        }
        let owner: Player = g_state.getPlayer(propertyState.owner)
        this.queuePayment(owed, pId, propertyState.owner)
        game.splashForPlayer(pId,
            Strings.PLAYER_OWES_PLAYER.replace('%PLAYERNAME%', p.Name)
                .replace('%OTHERPLAYER%', owner.Name)
                .replace('%AMOUNT%', owed.toString()))
    }

    protected tmProcessSpeedDieBus(): void {
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
            g_state.showMovementMessage(Strings.ACTION_SPEED_DIE_BUS)
            this.push({
                action: PlayerAction.MoveToLocation,
                values: [newLocation,],
            })
            g_state.Board.DoubleSpeed = true
        } else {
            // This really should not happen.
            throw 'ActionQueueTestMode.processSpeedDieBus: No space found.'
        }
    }

    protected tmProcessTriples(): void {
        let pId: number = g_state.CurrPlayer
        let p: Player = g_state.getCurrPlayer()
        game.splashForPlayer(pId, 'Triples!')
        // Move to a random location.
        this.push({
            action: PlayerAction.MoveToLocation,
            values: [randint(0, g_state.Board.BoardSpaces.length - 1),],
        })
        g_state.Board.DoubleSpeed = false
    }

    protected tmStartCurrentPlayer(): void {
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
                g_state.Board.redraw()
                // Automatically roll in test mode.
                this.actionStartRoll()
            } else {
                this.queueJailRoll()
            }
        } else {
            // Automatically roll in test mode.
            this.actionStartRoll()
        }
    }
}