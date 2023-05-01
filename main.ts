/**
 * Monopoly
 * Built on
 * MakeCode Arcade JavaScript Template v. 4.2.1
 * Template last update: 24 Apr 2023 ak
 * 
 * Immediate TODO List
 * - [X] Implement property states.
 * - [X] Automated roll tests.
 *       - [X] Handle doubles.
 * - [X] Player information sprites.
 * - [X] Dialog replacement. Add to multiplayer-prompt.
 *       - [X] game.splashForPlayer()
 *       - [X] game.showLongTextForPlayer()
 * - [/] Card decks.
 *       - [X] Jail cards as properties.
 * - [ ] Player actions menu (generic, e.g., while in jail, buy or auction property).
 *       - Add key binding sprites dynamically.
 * - [ ] Player actions menu (turn).
 *       - [ ] Bankrupt.
 *       - [ ] Build/mortgage.
 *       - [ ] Trade.
 * - [ ] Auction property.
 * - [ ] Player actions menu (while in jail).
 */

/**
 * Constants
 */
const HARDWARE: boolean = control.ramSize() < (1024 * 1024)

/**
 * Global variables
 */
let g_state: GameState = new GameState()

/**
 * Game loops
 */
game.onUpdate(function () {
    switch (g_state.Mode) {
        case GameMode.Attract:
            if (game.runtime() >= Attract.splashScreen.nextTime) {
                Attract.splashScreen.rotate()
            }   // if (game.runtime() >= splash.nextTime)
            if (sprites.allOfKind(SpriteKind.Moving).length === 0) {
                Attract.splashScreen.showScrollingSprite()
            }   // if (! sprites.allOfKind(SpriteKind.Moving))
            break

        case GameMode.Settings:
            if (game.runtime() >= GameSettings.settingsScreens.nextTime) {
                GameSettings.settingsScreens.rotate()
            }   // if (game.runtime() >= settings.nextTime)
            break

        case GameMode.FirstRoll:
            FirstRoll.update()
            if (FirstRoll.findFirstPlayer()) {
                // Start game!
                game.splash(g_state.getPlayer(FirstRoll.firstPlayer).Name +
                    ": You're first!")
                g_state.CurrPlayer = FirstRoll.firstPlayer
                startGame()
            }
            break

        case GameMode.Main:
            update()
            break

        case GameMode.DiceTest:
            if (DiceTests.diceTest.AreRolling) {
                DiceTests.diceTest.move()
                if (!DiceTests.diceTest.AreRolling) {
                    game.splash('Roll: ' + DiceTests.diceTest.Roll +
                        ' Doubles: ' + DiceTests.diceTest.AreDoubles)
                }
            }
            break

        case GameMode.BoardTest:
            Background.move()
            Board.move()
            BoardTests.currSpace.text = Board.currSpace.toString()
            BoardTests.currSpace.update()
            break
    }   // switch (g_state.Mode)
})  // game.onUpdate()

/**
 * Other functions
 */
function hidePlayers(): void {
    g_state.Players.forEach((p: Player, index: number) => {
        p.hideSprite()
        p.Dice.hide()
    })
}

function movePlayers(): void {
    for (let i: number = 1; i <= g_state.NumPlayers; i++) {
        if (i != g_state.CurrPlayer) {
            let p: Player = g_state.getPlayer(i)
            let s: Sprite = p.Sprite
            if (Board.direction >= 0) {
                s.x++
                if (s.left > 160) {
                    p.hideSprite()
                }
            } else {
                s.x--
                if (s.right < 0) {
                    p.hideSprite()
                }
            }
        }
    }
}

function processRoll(): void {
    let pId: number = g_state.CurrPlayer
    let p: Player = g_state.getCurrPlayer()
    let space = Board.BOARD[p.Location]
    switch (space.spaceType) {
        case Board.SpaceType.Card:
            Cards.drawCard(space.values[0])
            break

        case Board.SpaceType.Free:
            break

        case Board.SpaceType.Go:
            break

        case Board.SpaceType.GoToJail:
            game.splash("Going to jail!")
            p.Location = Board.JAIL_SPACE
            // p.isInJail = true
            break

        case Board.SpaceType.Jail:
            break

        case Board.SpaceType.Property:
            let groupInfo: Properties.PropertyGroupInfo = Properties.PROPERTIES[space.values[0]]
            let groupState: Properties.PropertyGroupState = g_state.Properties[space.values[0]]
            let propertyInfo: Properties.PropertyInfo = groupInfo.properties[space.values[1]]
            let propertyState: Properties.PropertyState = groupState.properties[space.values[1]]
            if (propertyState.owner <= 0) {
                // Property is unowned; buy it.
                game.splashForPlayer(pId, p.Name + " is buying " + propertyInfo.name)
                p.Bank -= propertyInfo.cost
                propertyState.owner = g_state.CurrPlayer
                let monopoly: boolean = true
                for (let p of groupState.properties) {
                    if (p.owner != g_state.CurrPlayer) {
                        monopoly = false
                        break
                    }
                }
                groupState.isMonopolyOwned = monopoly
            } else {
                // Property is owned.
                if (propertyState.owner != g_state.CurrPlayer) {
                    // Current player owes money.
                    let owed: number = 0
                    switch (groupInfo.propertyType) {
                        case Properties.PropertyType.Transportation:
                            let count: number = 0
                            for (let i: number = 0; i < groupState.properties.length; i++) {
                                if (groupState.properties[i].owner == propertyState.owner) {
                                    count++
                                }
                            }
                            owed = propertyInfo.rents[count - 1]
                            break

                        case Properties.PropertyType.Utility:
                            owed = p.Dice.Roll *
                                (groupState.isMonopolyOwned ? propertyInfo.rents[0] : propertyInfo.rents[1])
                            break

                        default:
                            if (groupState.isMonopolyOwned && propertyState.houses == 0) {
                                owed = propertyInfo.rents[0] * 2
                            } else {
                                owed = propertyInfo.rents[propertyState.houses]
                            }
                    }
                    let owner: Player = g_state.getPlayer(propertyState.owner)
                    game.splashForPlayer(pId, p.Name + ' owes ' + GameSettings.CURRENCY_SYMBOL + owed +
                        ' to ' + owner.Name)
                    p.Bank -= owed
                    owner.Bank += owed
                }
                else {
                    game.splashForPlayer(pId, "I'm home!")
                }
            }
            updatePlayerStatus()
            break

        case Board.SpaceType.Tax:
            let tax: Tax = TAXES[space.values[0]]
            game.splashForPlayer(pId, p.Name + ' owes ' + tax.name)
            p.Bank -= tax.value
            updatePlayerStatus()
            break
    }
}

function startGame(): void {
    g_state.Mode = GameMode.NotReady
    sprites.allOfKind(SpriteKind.Text).forEach((v: Sprite, index: number) => v.destroy())
    g_state.Players.forEach((p: Player, index: number) => {
        p.Status = PlayerStatus.WaitingForTurn
        p.DoublesRolled = false
        p.TurnCount = 0
    })
    scene.setBackgroundColor(Color.Black)
    g_state.Mode = GameMode.Main
}   // startGame()

function startRoll(): void {
    let p: Player = g_state.getCurrPlayer()
    let d: Dice = p.Dice
    p.TurnCount++
    d.Orientation = DiceOrientation.Vertical
    d.setStartLocation(Board.DICE_BEGIN_X, Board.DICE_BEGIN_Y)
    d.setStopLocation(Board.DICE_END_X, Board.DICE_END_Y)
    d.startRoll()
    p.Status = PlayerStatus.Moving
}

function startTurn(): void {
    // Update player status sprites.
    hidePlayers()
    Background.show()
    Board.draw(g_state.getCurrPlayer().Location)
    updatePlayerStatus()
    let p: Player = g_state.getCurrPlayer()
    p.TurnCount = 0
    p.DoublesRolled = false
    if (g_state.testMode) {
        startRoll()
    } else {
        // Show player actions.
    }
}

function update(): void {
    let p: Player = g_state.getCurrPlayer()
    if (p == null) {
        return
    }
    let d: Dice = p.Dice
    switch (p.Status) {
        case PlayerStatus.Moving:
            if (d.AreRolling) {
                d.move()
                if (!d.AreRolling) {
                    // Check for doubles.
                    p.DoublesRolled = d.AreDoubles
                    if (p.DoublesRolled && p.TurnCount == 3) {
                        game.splash('Off to jail for you!')
                        p.stopAnimation()
                        p.Status = PlayerStatus.WaitingForTurn
                        g_state.nextPlayer()
                    } else {
                        p.changeLocation(d.Roll)
                        p.startAnimation(Board.direction)
                    }
                }
            }
            if (!d.AreRolling && p.Status == PlayerStatus.Moving) {
                if (p.Location != Board.currSpace || Board.getXCoordinate(p.Location) < p.Sprite.x) {
                    Board.move()
                    Background.move()
                    movePlayers()
                } else {
                    p.stopAnimation()
                    p.Status = PlayerStatus.ProcessingRoll
                }
            }
            break

        case PlayerStatus.ProcessingRoll:
            processRoll()
            // Start next turn.
            p.Status = PlayerStatus.WaitingForTurn
            if (p.DoublesRolled) {
                if (g_state.testMode) {
                    startRoll()
                } else {
                    // Show player actions.
                }
            } else {
                g_state.nextPlayer()
            }
            break

        case PlayerStatus.WaitingForTurn:
            startTurn()
            break
    }
}

function updatePlayerStatus(): void {
    let x: number = 0
    let y: number = 0
    g_state.Players.forEach((value: Player, index: number) => {
        value.initStats()
        value.showStats(x, y)
        x += 40
    })
    let propertyState: Properties.PropertyGroupState[] = g_state.Properties
    Properties.PROPERTIES.forEach((pgi: Properties.PropertyGroupInfo, pgiIndex: number) => {
        pgi.properties.forEach((prop: Properties.PropertyInfo, propIndex: number) => {
            g_state.Players.forEach((p: Player, playerIndex: number) => {
                let ps: Properties.PropertyState = propertyState[pgiIndex].properties[propIndex]
                if (ps.owner == playerIndex + 1) {
                    p.drawStatus(pgiIndex, propIndex, pgi.color, ps.isMortgaged)
                } else {
                    p.drawStatus(pgiIndex, propIndex, Properties.COLOR_UNOWNED, false)
                }
            })
        })
    })
}

/**
 * Main() a.k.a. game.onStart()
 */
game.stats = true
if (settings.exists(Tests.TESTING_KEY)) {
    Tests.run()
} else {
    Attract.start()
}
/*
Tests.startAutomatedGame()
*/