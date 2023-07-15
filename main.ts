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
 * - [X] Player actions menu (while in jail).
 * - [X] Player actions menu (turn).
 *       - [X] Roll.
 *       - [X] Bankrupt.
 *       - [X] Build/mortgage.
 *       - [X] Trade.
 * - [X] Player actions menu (unowned property).
 *       - [X] Buy.
 *       - [X] Auction.
 * - [ ] Auction property.
 *       - [ ] Multiplayer.
 *       - [ ] Single controller.
 * - [ ] Buy/sell houses + mortgage property.
 * - [ ] Trade mechanism.
 * - [ ] BUG: Roll after card moving to utility is not paying owner.
 * - [ ] Show property information as a sprite when purchasing, auctioning, or mortgaging.
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
    g_state.Players.forEach((p: Player, index: number) => {
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
Tests.startTestMenu()
/*
if (settings.exists(Tests.TESTING_KEY)) {
    Tests.run()
} else {
    Attract.start()
}
Tests.startAutomatedGame(0)
g_state.testMode = false
Tests.startJailTest()
BackgroundTests.setup()
BoardTests.setup()
*/
