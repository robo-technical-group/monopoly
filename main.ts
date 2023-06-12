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
 *       - [ ] Implement PlayerState.MovingForCard
 * - [X] Handle player passing Go.
 * - [X] Add bank changing bump.
 * - [ ] Player actions menu (generic, e.g., while in jail, buy or auction property).
 *       - Add key binding sprites dynamically.
 *       - Move button actions below d-pad (maybe?)
 * - [X] Implement Player.goToJail()
 * - [ ] Refactor game loops.
 *       - [ ] Game loop (loop among players).
 *       - [ ] Player loop (maybe a queue or stack?).
 *             - [ ] Move turn processing to `Player` class.
 *             - [ ] Game loop waits for player status to become `WaitingForTurn`.
 *             - [ ] Give player states a value array (*e.g.*, card deck and number).
 * - [X] Add player flag to skip next turn.
 * - [ ] Player actions menu (while in jail).
 * - [ ] Player actions menu (turn).
 *       - [ ] Roll.
 *       - [ ] Bankrupt.
 *       - [ ] Build/mortgage.
 *       - [ ] Trade.
 * - [ ] Auction property.
 *       - [ ] Multiplayer.
 *       - [ ] Single controller.
 * - [ ] Buy/sell houses.
 * - [ ] Trade mechanism.
 * - [/] Mega Monopoly accommodations.
 *       - [X] Add assets.
 *       - [X] Add alternate board.
 *       - [X] Add speed die.
 *       - [ ] Add bus tickets.
 *       - [X] Add game settings.
 * - [X] Refactor board and properties.
 * - [ ] Move strings to central location(s).
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
            DiceTests.update()
            break

        case GameMode.SpeedDieTest:
            DiceTests.update()
            break

        case GameMode.BoardTest:
            BoardTests.update()
            break
    }   // switch (g_state.Mode)
})  // game.onUpdate()

/**
 * Other functions
 */
function finishTurn(): void {
    // Ensure player's turn has finished.
    let p: Player = g_state.getCurrPlayer()
    if (p.Status == PlayerStatus.WaitingForTurn) {
        if (p.DoublesRolled) {
            if (p.InJail) {
                p.InJail = false
                // End turn.
                g_state.nextPlayer()
            } else if (g_state.testMode) {
                startRoll()
            } else {
                // Show player actions.
            }
        } else {
            // End turn.
            g_state.nextPlayer()
        }
    }
}

function hidePlayers(): void {
    g_state.Players.forEach((p: Player, index: number) => {
        p.hideSprite()
        p.Dice.hide()
    })
}

function processRoll(): void {
    let pId: number = g_state.CurrPlayer
    let p: Player = g_state.getCurrPlayer()
    let priorStatus: PlayerStatus = p.Status
    p.Status = PlayerStatus.WaitingForTurn
    let space = g_state.Board.BoardSpaces[p.Location]
    let d: Dice = p.Dice
    switch (space.spaceType) {
        case SpaceType.Card:
            Cards.drawCard(space.values[0])
            break

        case SpaceType.Free:
            // Splash a message.
            break

        case SpaceType.Go:
            // Splash a message.
            break

        case SpaceType.GoToJail:
            game.splash('Going to jail!')
            p.goToJail()
            break

        case SpaceType.Jail:
            if (p.InJail) {
                if (d.AreDoubles) {
                    p.changeLocation(d.Roll)
                    p.Status = PlayerStatus.Moving
                } else {
                    p.JailTurns++
                    if (p.JailTurns == 4) {
                        g_state.ActionMenu = new InJailActionMenu(ActionMenuText.IN_JAIL_MUST_PAY)
                        p.Status = PlayerStatus.ActionMenu
                    }
                }
            } else {
                // Splash a message.
            }
            break

        case SpaceType.Property:
            let groupInfo: Properties.GroupInfo = g_state.Properties.info[space.values[0]]
            let groupState: Properties.GroupState = g_state.Properties.state[space.values[0]]
            let propertyInfo: Properties.Info = groupInfo.properties[space.values[1]]
            let propertyState: Properties.State = groupState.properties[space.values[1]]
            if (propertyState.owner <= 0) {
                // Property is unowned; buy it.
                game.splashForPlayer(pId, p.Name + " is buying " + propertyInfo.name)
                p.changeBank(0 - propertyInfo.cost)
                propertyState.owner = g_state.CurrPlayer
                let monopoly: boolean = true
                for (let p of groupState.properties) {
                    if (p.owner != g_state.CurrPlayer) {
                        monopoly = false
                        break
                    }
                }
                groupState.isMonopolyOwned = monopoly
                groupState.owner = monopoly ? g_state.CurrPlayer : 0
            } else {
                // Property is owned.
                if (propertyState.owner != g_state.CurrPlayer) {
                    // Current player owes money.
                    let owed: number = 0
                    switch (groupInfo.propertyType) {
                        case Properties.PropertyType.Transportation:
                            let count: number = groupState.properties.filter((value: Properties.State, index: number) =>
                                value.owner == propertyState.owner).length
                            owed = propertyInfo.rents[count - 1]
                            if (priorStatus == PlayerStatus.MovingForCard) {
                                // Player owes double.
                                owed *= 2
                            }
                            break

                        case Properties.PropertyType.Utility:
                            if (priorStatus == PlayerStatus.MovingForCard) {
                                // Player needs to re-roll and owes ten times amount rolled.
                            } else {
                                owed = p.Dice.Roll *
                                    (groupState.isMonopolyOwned ? propertyInfo.rents[1] : propertyInfo.rents[0])
                            }
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
                    p.changeBank(0 - owed)
                    owner.changeBank(owed)
                }
                else {
                    game.splashForPlayer(pId, "I'm home!")
                }
            }
            updatePlayerStatus()
            break

        case SpaceType.Tax:
            let tax: Tax = TAXES[space.values[0]]
            game.splashForPlayer(pId, p.Name + ' owes ' + tax.name)
            p.changeBank(0 - tax.value)
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
    scene.setBackgroundImage(assets.image`bg`)
    g_state.Mode = GameMode.Main
}   // startGame()

function startRoll(): void {
    g_state.getCurrPlayer().startRoll()
}

function startTurn(): void {
    // Update player status sprites.
    hidePlayers()
    Background.show()
    let p: Player = g_state.getCurrPlayer()
    g_state.Board.draw(p.Location)
    g_state.Board.Direction = 1
    updatePlayerStatus()
    p.startTurn()
    if (p.InJail) {
        p.JailTurns++
        g_state.ActionMenu = new InJailActionMenu(ActionMenuText.IN_JAIL + p.JailTurns + ')')
        g_state.ActionMenu.show()
    } else if (g_state.testMode) {
        p.startRoll()
    } else {
        // Show player actions.
    }
}

function update(): void {
    sprites.allOfKind(SpriteKind.BankBump).forEach((value: Sprite, index: number) => {
        if (game.runtime() >= value.data['created'] + GameSettings.BANK_BUMP_VISIBLE) {
            value.destroy()
        }
    })
    let p: Player = g_state.getCurrPlayer()
    if (p == null) {
        return
    }
    let d: Dice = p.Dice
    switch (p.Status) {
        case PlayerStatus.Moving:
        case PlayerStatus.MovingForCard:
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
                        p.startAnimation(g_state.Board.Direction)
                    }
                }
            }
            if (!d.AreRolling && (p.Status == PlayerStatus.Moving || p.Status == PlayerStatus.MovingForCard)) {
                if (p.Location != g_state.Board.CurrSpace || 
                        (g_state.Board.Direction >= 0 && g_state.Board.getXCoordinate(p.Location) < p.Sprite.x) || 
                        (g_state.Board.Direction < 0 && g_state.Board.getXCoordinate(p.Location) > p.Sprite.x)) {
                    g_state.Board.move()
                    Background.move()
                    updatePlayers()
                } else {
                    p.stopAnimation()
                    processRoll()
                    finishTurn()
                }
            }
            break

        case PlayerStatus.RollingInJail:
            if (d.AreRolling) {
                d.move()
            }
            if (!d.AreRolling) {
                processRoll()
            }
            break

        case PlayerStatus.WaitingForTurn:
            startTurn()
            break
    }
}

function updatePlayers(): void {
    for (let i: number = 1; i <= g_state.NumPlayers; i++) {
        let p: Player = g_state.getPlayer(i)
        let s: Sprite = p.Sprite
        if (i == g_state.CurrPlayer) {
            if (g_state.Board.SpacesMoved > 0 && g_state.Board.CurrSpace == g_state.Board.Go && !p.PassedGo) {
                p.PassedGo = true
                p.changeBank(GameSettings.GO_VALUE)
                updatePlayerStatus()
            }
            let spaces: number = p.Location - g_state.Board.CurrSpace
            if (g_state.Board.Direction < 0) {
                spaces = 0 - spaces
            }
            if (spaces < 0) {
                // Move wraps around the end of the board.
                spaces += g_state.Board.BoardSpaces.length
            }
            s.say(spaces == 0 ? '' : spaces)
        } else {
            if (g_state.Board.Direction >= 0) {
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

function updatePlayerStatus(): void {
    let x: number = 0
    let y: number = 0
    g_state.Players.forEach((value: Player, index: number) => {
        value.initStats()
        value.showStats(x, y)
        x += 40
    })
    let propertyState: Properties.GroupState[] = g_state.Properties.state
    g_state.Properties.info.forEach((pgi: Properties.GroupInfo, pgiIndex: number) => {
        pgi.properties.forEach((prop: Properties.Info, propIndex: number) => {
            g_state.Players.forEach((p: Player, playerIndex: number) => {
                let ps: Properties.State = propertyState[pgiIndex].properties[propIndex]
                if (ps.owner == playerIndex + 1) {
                    p.drawStatus(pgiIndex, propIndex, pgi.color, ps.isMortgaged)
                } else {
                    p.drawStatus(pgiIndex, propIndex, Properties.COLOR_UNOWNED, false)
                }
            })
        })
    })
    if (g_state.testMode) {
        g_state.updateStatusSprite()
    }
}

/**
 * Main() a.k.a. game.onStart()
 */
game.stats = true
Tests.startAutomatedGame(1)
/*
if (settings.exists(Tests.TESTING_KEY)) {
    Tests.run()
} else {
    Attract.start()
}
Tests.testJailMenu()
BoardTests.setup()
*/
