namespace Cards {
    export enum Action {
        GoToSpace,
        Repairs,
        PayBank,
        GoToGroup,
        BankPays,
        GetOutOfJail,
        MoveBackward,
        PayEachPlayer,
        CollectFromEachPlayer,
    }

    export enum CardLocations {
        Boardwalk,
        Illinois,
        Jail,
        Go,
        Reading,
        SaintCharles,
    }

    interface Card {
        action: Action
        text: string
        values: number[]
    }

    interface Deck {
        cards: Card[]
        color: number
        name: string
    }

    const CARDS: Deck[] = [
        {
            name: 'Chance',
            color: Color.Orange,
            cards: [
                // Card zero is the get out of jail card.
                {
                    text: 'Get out of jail free!',
                    action: Action.GetOutOfJail,
                    values: [],
                }, {
                    text: 'Advance to Illinois Avenue.',
                    action: Action.GoToSpace,
                    values: [CardLocations.Illinois,],
                }, {
                    text: 'Take a ride on the Reading.',
                    action: Action.GoToSpace,
                    values: [CardLocations.Reading],
                }, {
                    text: 'Make general repairs on your properties. Pay M25 per house and M100 per hotel.',
                    action: Action.Repairs,
                    values: [25, 100,],
                }, {
                    text: 'Pay poor tax of M15',
                    action: Action.PayBank,
                    values: [15,],
                }, {
                    text: 'Advance token to nearest utility. If owned, then throw dice and pay 10 times amount thrown.',
                    action: Action.GoToGroup,
                    values: [Properties.GROUP_UTIL,],
                }, {
                    text: 'Take a walk on Boardwalk.',
                    action: Action.GoToSpace,
                    values: [CardLocations.Boardwalk,],
                }, {
                    text: 'Bank pays you dividend of M50.',
                    action: Action.BankPays,
                    values: [50,],
                }, {
                    text: 'Go back 3 spaces.',
                    action: Action.MoveBackward,
                    values: [3,],
                }, {
                    text: 'You have been elected chairman of the board. Pay each player M50.',
                    action: Action.PayEachPlayer,
                    values: [50,],
                }, {
                    text: 'Go directly to jail! Do not pass Go. Do not collect M200.',
                    action: Action.GoToSpace,
                    values: [CardLocations.Jail,],
                }, {
                    text: 'Advance token to nearest railroad. Pay owner double.',
                    action: Action.GoToGroup,
                    values: [Properties.GROUP_RR,],
                }, {
                    text: 'Advance token to nearest railroad. Pay owner double.',
                    action: Action.GoToGroup,
                    values: [Properties.GROUP_RR,],
                }, {
                    text: 'Advance to Go!',
                    action: Action.GoToSpace,
                    values: [CardLocations.Go,],
                }, {
                    text: 'Advance to Saint Charles Place.',
                    action: Action.GoToSpace,
                    values: [CardLocations.SaintCharles,],
                }, {
                    text: 'Your building and loan matures. Collect M150.',
                    action: Action.BankPays,
                    values: [150,],
                }
            ],
        }, {
            name: 'Community Chest',
            color: Color.Yellow,
            cards: [
                // Card zero is the get out of jail card.
                {
                    text: 'Get out of jail free!',
                    action: Action.GetOutOfJail,
                    values: [],
                }, {
                    text: 'Grand opera opening! Collect M50 from every player for opening night seats.',
                    action: Action.CollectFromEachPlayer,
                    values: [50,],
                }, {
                    text: 'You have won second prize in a beauty contest! Collect M10.',
                    action: Action.BankPays,
                    values: [10,],
                }, {
                    text: "Pay M50 doctor's fee.",
                    action: Action.PayBank,
                    values: [50,],
                }, {
                    text: 'You are assessed street repairs. Pay M40 per house and M115 per hotel.',
                    action: Action.Repairs,
                    values: [40, 115,],
                }, {
                    text: 'Go directly to jail! Do not pass Go. Do not collect M200.',
                    action: Action.GoToSpace,
                    values: [CardLocations.Jail,],
                }, {
                    text: 'Pay hospital M100',
                    action: Action.PayBank,
                    values: [100,],
                }, {
                    text: 'Income tax refund. Collect M20.',
                    action: Action.BankPays,
                    values: [20,],
                }, {
                    text: 'Life insurance matures. Collect M100.',
                    action: Action.BankPays,
                    values: [100,],
                }, {
                    text: 'From sale of stock, you get M45.',
                    action: Action.BankPays,
                    values: [45,],
                }, {
                    text: 'Receive for services M25.',
                    action: Action.BankPays,
                    values: [25,],
                }, {
                    text: 'Bank error in your favor. Collect M200.',
                    action: Action.BankPays,
                    values: [200,],
                }, {
                    text: 'You inherit M100.',
                    action: Action.BankPays,
                    values: [100,],
                }, {
                    text: 'Pay school tax of M150.',
                    action: Action.PayBank,
                    values: [150,],
                }, {
                    text: 'Xmas fund matures. Collect M100.',
                    action: Action.BankPays,
                    values: [100,],
                }, {
                    text: 'Advance to Go!',
                    action: Action.GoToSpace,
                    values: [CardLocations.Go,],
                }
            ],
        }
    ]

    let deckIndex: number[] = []
    let decks: number[][] = []

    export function drawCard(deck: number): void {
        if (decks.length == 0) {
            initDecks()
        }
        if (deckIndex[deck] == 0 && g_state.Properties.state[Properties.GROUP_JAIL].properties[deck].owner > 0) {
            // Jail card is owned; skip to next card.
            moveIndex(deck)
        }
        let playerId: number = g_state.CurrPlayer
        let player: Player = g_state.getCurrPlayer()
        let card: Card = CARDS[deck].cards[decks[deck][deckIndex[deck]]]
        game.splashForPlayer(playerId, CARDS[deck].name, card.text)

        switch (card.action) {
            case Action.BankPays:
                player.changeBank(card.values[0])
                updatePlayerStatus()
                break

            case Action.CollectFromEachPlayer:
                for (let i: number = 0; i < g_state.NumPlayers; i++) {
                    if (i + 1 == playerId) {
                        player.changeBank(card.values[0] * (g_state.NumPlayers - 1))
                    } else {
                        g_state.Players[i].changeBank(0 - card.values[0])
                    }
                }
                updatePlayerStatus()
                break

            case Action.GetOutOfJail:
                g_state.Properties.state[Properties.GROUP_JAIL].properties[deck].owner = playerId
                updatePlayerStatus()
                break

            case Action.GoToGroup:
                for (let i: number = 0; i < g_state.Board.BoardSpaces.length; i++) {
                    let space: Space = g_state.Board.BoardSpaces[i]
                    if (space.spaceType == SpaceType.Property &&
                        space.values[0] == card.values[0] &&
                        i > player.Location) {
                        player.Location = i
                        break
                    }
                }
                g_state.Board.Direction = 1
                player.startAnimation(1)
                player.Status = PlayerStatus.MovingForCard
                player.PassedGo = false
                break

            case Action.GoToSpace:
                if (card.values[0] == CardLocations.Jail) {
                    player.goToJail()
                } else {
                    player.Location = g_state.Board.getCardLocation(card.values[0])
                    g_state.Board.Direction = 1
                    player.startAnimation(1)
                    // Not needed? player.Status = PlayerStatus.MovingForCard
                    player.Status = PlayerStatus.Moving
                    player.PassedGo = false
                }
                break

            case Action.MoveBackward:
                player.changeLocation(0 - card.values[0])
                g_state.Board.Direction = -1
                player.startAnimation(-1)
                // Not needed: player.Status = PlayerStatus.MovingForCard
                player.Status = PlayerStatus.Moving
                break

            case Action.PayBank:
                player.changeBank(0 - card.values[0])
                break

            case Action.PayEachPlayer:
                for (let i: number = 0; i < g_state.NumPlayers; i++) {
                    if (i + 1 == playerId) {
                        player.changeBank(0 - card.values[0] * (g_state.NumPlayers - 1))
                    } else {
                        g_state.Players[i].changeBank(card.values[0])
                    }
                }
                updatePlayerStatus()
                break

            case Action.Repairs:
                let houses: number = 0
                let hotels: number = 0
                g_state.Properties.state.forEach((pgs: Properties.GroupState, index: number) => {
                    pgs.properties.forEach((ps: Properties.State, index: number) => {
                        if (ps.houses == 5) {
                            hotels++
                        } else {
                            houses += ps.houses
                        }
                    })
                })
                player.changeBank(0 - houses * card.values[0] - hotels * card.values[1])
                break
        }
        moveIndex(deck)
    }

    function initDecks(): void {
        for (let deck: number = 0; deck < CARDS.length; deck++) {
            decks[deck] = []
            deckIndex[deck] = 0
            for (let card: number = 0; card < CARDS[deck].cards.length; card++) {
                decks[deck].push(card)
            }
            // Shuffle deck.
            let t: number = 0
            let swap: number = 0
            for (let card: number = 0; card < decks[deck].length; card++) {
                swap = randint(0, decks[deck].length - 1)
                if (card != swap) {
                    t = decks[deck][card]
                    decks[deck][card] = decks[deck][swap]
                    decks[deck][swap] = t
                }
            }
        }
    }

    function moveIndex(deck: number): void {
        deckIndex[deck]++
        if (deckIndex[deck] >= decks[deck].length) {
            deckIndex[deck] = 0
        }
    }
}