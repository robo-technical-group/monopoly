/**
 * Monopoly
 * Built on
 * MakeCode Arcade JavaScript Template v. 4.2.2
 * Template last update: 11 Jun 2023 ak
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
 * - [ ] Refactor game loop to use an action queue.
 *       - [ ] Actions go to a common queue.
 *       - [ ] If queue is empty, then it's time to start the next turn.
 * - [ ] Player actions menu (generic, *e.g.*, while in jail, buy or auction property).
 *       - Add key binding sprites dynamically.
 *       - Move button actions below d-pad (maybe?)
 * - [X] Implement Player.goToJail()
 * - [X] Add player flag to skip next turn.
 *       - [X] Process skipped turn.
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
 *       - [X] Add train depots.
 * - [X] Refactor board and properties.
 * - [X] Move (most) strings to central location.
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

function updatePlayers(): void {
    for (let i: number = 1; i <= g_state.NumPlayers; i++) {
        let p: Player = g_state.getPlayer(i)
        let s: Sprite = p.Sprite
        if (i == g_state.CurrPlayer) {
            if (g_state.Board.SpacesMoved > 0 && g_state.Board.CurrSpace == g_state.Board.Go && !p.PassedGo) {
                p.PassedGo = true
                p.changeBank(GameSettings.GO_VALUE)
                g_state.updatePlayerStatus()
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
