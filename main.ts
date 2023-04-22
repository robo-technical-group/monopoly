/**
 * Monopoly
 * Built on
 * MakeCode Arcade JavaScript Template v. 4.0.0
 * Template last update: 20 Apr 2023 ak
 * 
 * Immediate TODO List
 * - [X] Add mini menu extension. See https://forum.makecode.com/t/arcade-mini-menu-extension/14368
 * - [X] Implement game load mechanism from attract menu.
 * - [X] Add function in Option Screens plugin to add items to system menu.  See https://forum.makecode.com/t/custom-menu-showcase/18381
 * - [X] Create alternate pause menu.
 * - [X] Update Blocks and JavaScript templates accordingly.
 * - [ ] Work on single-controller implementation.
 * - [ ] Finish game load and manage save file routines.
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
                startGame()
            }

        case GameMode.Main:
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
    }   // switch (g_state.Mode)
})  // game.onUpdate()

/**
 * Other functions
 */
function startGame(): void {
    g_state.Mode = GameMode.NotReady
    scene.setBackgroundImage(assets.image`bg`)
    g_state.Mode = GameMode.Main
}   // startGame()

/**
 * Main() a.k.a. game.onStart()
 */
game.stats = true
Attract.start()
// GameState.addSystemMenuItem(saveGame) // This won't work; reimplement system menu.
// AvatarTest.startAvatarTest()
// DiceTests.start()
// FirstRollTests.start(4)
// GameStateTests.start()
