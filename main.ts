/**
 * Monopoly
 * Built on
 * MakeCode Arcade JavaScript Template v. 4.2.1
 * Template last update: 24 Apr 2023 ak
 * 
 * Immediate TODO List
 * - [X] Implement property states.
 * - [X] Automated roll tests.
 *       - [ ] Handle doubles.
 * - [ ] Player information sprites.
 * - [ ] Dialog replacement.
 * - [ ] Card decks.
 *       - [ ] Jail cards as properties.
 * - [ ] Player actions menu (generic, e.g., whlie in jail, buy or auction property).
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

function startGame(): void {
    g_state.Mode = GameMode.NotReady
    sprites.allOfKind(SpriteKind.Text).forEach((v: Sprite, index: number) => v.destroy())
    g_state.Players.forEach((p: Player, index: number) => {
        p.Status = PlayerStatus.WaitingForTurn
    })
    scene.setBackgroundColor(Color.Black)
    g_state.Mode = GameMode.Main
}   // startGame()

function startRoll(): void {
    let p: Player = g_state.getCurrPlayer()
    let d: Dice = p.Dice
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
                    p.changeLocation(d.Roll)
                    p.startAnimation(Board.direction)
                }
            }
            if (!d.AreRolling) {
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
            p.Status = PlayerStatus.WaitingForTurn
            g_state.nextPlayer()
            break

        case PlayerStatus.WaitingForTurn:
            startTurn()
            break
    }
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