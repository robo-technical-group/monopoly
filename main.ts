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
 * - [ ] Player actions menu (generic, *e.g.*, while in jail, buy or auction property).
 *       - Add key binding sprites dynamically.
 *       - Move button actions below d-pad (maybe?)
 * - [ ] Player actions menu (while in jail).
 * - [ ] Player actions menu (turn).
 *       - [ ] Roll.
 *       - [ ] Bankrupt.
 *       - [ ] Build/mortgage.
 *       - [ ] Trade.
 * - [ ] Player actions menu (unowned property).
 *       - [ ] Buy.
 *       - [ ] Auction.
 * - [ ] Auction property.
 *       - [ ] Multiplayer.
 *       - [ ] Single controller.
 * - [ ] Buy/sell houses + mortgage property.
 * - [ ] Trade mechanism.
 * - [X] BUG: Verify payments on railroads.
 *       - Saw an NaN payment after moving for a card.
 *       - Card may be missing a value or the payment calculation may be looking
 *         at wrong location in the values array.
 * - [X] Review logic for paying on Go.
 *       - Landing on Go and then moving for speed die results in double payment.
 *       - Perhaps refactor to count the number of times Go has paid and the
 *         number of times you have passed it. Moving backward over Go would
 *         deduct from counter.
 * - [X] BUG: After jail roll, current space for next player is processed.
 * - [X] BUG: PrintBank() is not erasing correct area.
 * - [X] Switch automatic processing for triples to pick a random location on the board.
 * - [X] Incorporate auction space after all properties are sold into automatic processing.
 * - [X] Move avatar into jail space if player is in jail.
 * - [X] BUG: Triples gets stuck in a loop.
 * - [X] BUG: Card type GoToGroup no longer working.
 * - [X] Move double speed when not moving for roll.
 * - [ ] BUG: Multiple players in jail gets automated game stuck in loop.
 * - [ ] Refactor action queue. Use methods rather than manually manipulating queue.
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
// Tests.startAutomatedGame(1)
Tests.startJailTest()
/*
if (settings.exists(Tests.TESTING_KEY)) {
    Tests.run()
} else {
    Attract.start()
}
Tests.testJailMenu()
BoardTests.setup()
BackgroundTests.setup()
*/
