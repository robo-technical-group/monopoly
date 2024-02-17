/**
 * Monopoly
 * Built on
 * MakeCode Arcade JavaScript Template v. 4.2.2
 * Template last update: 11 Jun 2023 ak
 * 
 * Immediate TODO List
 * - [/] Refactor game loop to use an action queue.
 *       - [/] Handle card actions.
 *             - [ ] Handle go to any space.
 *             - [ ] Handle go to space and all pay.
 *             - [ ] Handle lottery.
 *             - [ ] Handle selective tax.
 *             - [ ] Handle roll backward.
 *             - [ ] Handle skip next turn.
 *       - [ ] Handle bus options.
 *       - [ ] Handle gift options.
 *       - [ ] Handle bankrupt player.
 * - [ ] Auction property.
 *       - [ ] Multiplayer.
 *       - [ ] Single controller.
 * - [ ] Buy/sell houses + mortgage property.
 * - [ ] Trade mechanism.
 * - [ ] BUG: Roll after card moving to utility is not paying owner.
 * - [ ] Show property information as a sprite when purchasing, auctioning, or mortgaging.
 * - [ ] Add subclass of action menu for starting a turn with appropriate default actions.
 *       - Trade
 *       - Build/Mortgage
 * - [ ] Player select a space mechanism.
 *       - [ ] Allow for restraints (*e.g.*, select only a property, select from one side of the board).
 * - [ ] Game select a random space mechanism.
 *       - [X] Add *Press Your Luck* sound effect. :-)
 *       - [ ] Perhaps add both "spin" and "bounce" selection mechanisms.
 * - [ ] Production version cleanup.
 *       - [ ] Remove viewing of action queue.
 *       - [ ] Remove template board images from assets.
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
            Attract.update()
            break

        case GameMode.Settings:
            GameSettings.update()
            break

        case GameMode.FirstRoll:
            FirstRoll.update()
            if (FirstRoll.ready) {
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

        case GameMode.BackgroundTest:
            BackgroundTests.update()
            break
    }   // switch (g_state.Mode)
})  // game.onUpdate()

/**
 * Other functions
 */
function startGame(): void {
    g_state.Mode = GameMode.NotReady
    sprites.allOfKind(SpriteKind.Text).forEach((v: Sprite, index: number) => v.destroy())
    g_state.Players.filter((p: Player, index: number) => index > 0)
        .forEach((p: Player, index: number) => {
            p.Dice.Orientation = DiceOrientation.Vertical
            p.Dice.setStartLocation(Board.DICE_BEGIN_X, Board.DICE_BEGIN_Y)
            p.Dice.setStopLocation(Board.DICE_END_X, Board.DICE_END_Y)
            p.Dice.setLocationChange(5, 0)
            p.DoublesRolled = false
            p.TurnCount = 0
    })
    scene.setBackgroundColor(Color.Black)
    scene.setBackgroundImage(assets.image`bg`)
    g_state.start()
    g_state.Mode = GameMode.Main
}   // startGame()

function update(): void {
    sprites.allOfKind(SpriteKind.BankBump).forEach((value: Sprite, index: number) => {
        if (game.runtime() >= value.data['created'] + GameSettings.BANK_BUMP_VISIBLE) {
            value.destroy()
        }
    })
    g_state.update()
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
if (settings.exists(Tests.TESTING_KEY)) {
    Tests.run()
} else {
    Attract.start()
}
Tests.startBoardSpaceMenu(0)
Tests.startJailTest(0)
Tests.startAutomatedGame(0)
g_state.testMode = false
Tests.startTestMenu()
FirstRollTests.start(2)
BackgroundTests.setup()
BoardTests.setup()
*/
