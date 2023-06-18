namespace Cards {
    export enum Action {
        BankPays,
        BusTicket,
        BusTicketExpireAll,
        CollectFromEachPlayer,
        GetOutOfJail,
        GoToAny,
        GoToGroup,
        GoToSpace,
        GoToSpaceAllPay,
        Lottery,
        MoveBackward,
        PayBank,
        PayEachPlayer,
        PayTax,
        Repairs,
        SkipNextTurn,
    }

    export enum CardLocations {
        Boardwalk,
        Illinois,
        Jail,
        Go,
        Reading,
        SaintCharles,
    }

    export interface Card {
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
                    values: [CardLocations.Reading,],
                }, {
                    text: 'Make general repairs on your properties. Pay M25 per house and M100 per hotel.',
                    action: Action.Repairs,
                    values: [25, 100,],
                }, {
                    text: 'Pay poor tax of M15',
                    action: Action.PayBank,
                    values: [15,],
                }, {
                    text: 'Advance token to nearest utility. If owned, then throw dice and pay %MULTIPLIER% times amount thrown.',
                    action: Action.GoToGroup,
                    values: [Properties.GROUP_UTIL, 10, 20,],
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
                    values: [Properties.GROUP_RR, 2,],
                }, {
                    text: 'Advance token to nearest railroad. Pay owner double.',
                    action: Action.GoToGroup,
                    values: [Properties.GROUP_RR, 2,],
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
        }, {
            name: 'Bus Tickets',
            color: Color.LightBlue,
            cards: [
                {
                    text: 'Save for future use.',
                    action: Action.BusTicket,
                    values: [],
                }, {
                    text: 'All other player tickets expire.',
                    action: Action.BusTicketExpireAll,
                    values: [],
                },
            ],
        },
    ]

    export const BUS_DECK: number = CARDS.length - 1
    const BUS_TICKETS_EXPIRE_CARDS: number = 3    
    // Maximum card deck size.
    // + Allows for additional cards that can be shuffled into the decks.
    const CARDS_MAX_LENGTH: number = 16

    let deckIndex: number[] = []
    let decks: number[][] = []

    function currentCard(deck: number): Card {
        let index: number = deckIndex[deck]
        if (index >= decks[deck].length) {
            return null
        }
        let cards: Card[] = CARDS[deck].cards
        let cardIndex: number = decks[deck][index]
        return cards[cardIndex]
    }

    export function deckColor(deck: number): number {
        return CARDS[deck].color
    }

    export function deckName(deck: number): string {
        return CARDS[deck].name
    }

    export function drawCard(deck: number): Card {
        if (decks.length == 0) {
            initDecks()
        }
        if (deck != BUS_DECK &&
                g_state.Properties.state[Properties.GROUP_JAIL].properties[deck].owner > 0) {
            let currCard: Card = currentCard(deck)
            if (currCard.action == Action.GetOutOfJail) {
                // Jail card is owned; skip to next card.
                moveIndex(deck)
            }
        }

        let toReturn: Card = currentCard(deck)
        moveIndex(deck)
        return toReturn
    }

    export function getBusTicketsRemaining(): number {
        if (g_state.Bus) {
            return CARDS_MAX_LENGTH - deckIndex[CARDS.length - 1]
        } else {
            return 0
        }
    }

    function initDecks(): void {
        for (let deck: number = 0; deck < CARDS.length; deck++) {
            decks[deck] = []
            deckIndex[deck] = 0
            if (deck == BUS_DECK) {
                for (let i: number = 0; i < BUS_TICKETS_EXPIRE_CARDS; i++) {
                    decks[deck].push(1)
                }
                while (decks[deck].length < CARDS_MAX_LENGTH) {
                    decks[deck].push(0)
                }
            } else {
                for (let card: number = 1; card < CARDS[deck].cards.length; card++) {
                    decks[deck].push(card)
                }
                if (decks[deck].length >= CARDS_MAX_LENGTH) {
                    // Select a random deck of cards.
                    shuffleDeck(decks[deck])
                    while (decks[deck].length >= CARDS_MAX_LENGTH) {
                        let _: number = decks[deck].pop()
                    }
                }
                // Add the jail card.
                decks[deck].push(0)
            }
            shuffleDeck(decks[deck])
        }
    }

    function moveIndex(deck: number): void {
        if (deck == BUS_DECK && deckIndex[deck] >= decks[deck].length) {
            return
        }
        deckIndex[deck]++
        if (deck <= BUS_DECK && deckIndex[deck] >= decks[deck].length) {
            deckIndex[deck] = 0
        }
    }

    export function setIndex(deck: number, index: number): void {
        if (index >= 0 && index < CARDS_MAX_LENGTH) {
            deckIndex[deck] = index
        }
    }

    function shuffleDeck(deck: number[]): void {
        let t: number = 0
        let swap: number = 0
        for (let card: number = 0; card < deck.length; card++) {
            swap = randint(0, deck.length - 1)
            if (card != swap) {
                t = deck[card]
                deck[card] = deck[swap]
                deck[swap] = t
            }
        }
    }
}