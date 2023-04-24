/**
 * Monopoly
 * Built on
 * MakeCode Arcade JavaScript Template v. 4.2.0
 * Template last update: 24 Apr 2023 ak
 * 
 * Immediate TODO List
 * - [X] Work on single-controller implementation.
 * - [X] Finish game load and manage save file routines.
 * - [X] Update Blocks and JavaScript templates accordingly.
 * - [X] Add game board animations.
 * - [X] Add background animations.
 * - [X] Setup automated testing.
 * - [X] Update JavaScript template.
 * - [X] Revisit all tests to ensure they work.
 * - [ ] Check that menu sprites are destroyed when loading saved game.
 * - [ ] Update JavaScript template accordingly.
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
function startGame(): void {
    g_state.Mode = GameMode.NotReady
    scene.setBackgroundImage(assets.image`bg`)
    g_state.Mode = GameMode.Main
}   // startGame()

/**
 * Main() a.k.a. game.onStart()
 */
game.stats = true
if (settings.exists(Tests.TESTING_KEY)) {
    Tests.run()
} else {
    Attract.start()
}
