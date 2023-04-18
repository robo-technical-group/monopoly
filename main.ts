/**
 * Monopoly
 * Built on
 * MakeCode Arcade JavaScript Template v. 3.0.3
 * Template last update: 16 Apr 2023 ak
 */

/**
 * Constants
 */
const HARDWARE: boolean = control.ramSize() < (1024 * 1024)

/**
 * Global variables
 */
let g_activePlayer: number = -1
let g_currPlayer: number = -1
let g_gameMode: GameMode = GameMode.NotReady
let g_players: Player[] = []

/**
 * Game loops
 */
game.onUpdate(function () {
    switch (g_gameMode) {
        case GameMode.Attract:
            if (game.runtime() >= Attract.splashScreen.nextTime) {
                Attract.splashScreen.rotate()
            }   // if (game.runtime() >= splash.nextTime)
            break

        case GameMode.Settings:
            if (game.runtime() >= GameSettings.settingsScreens.nextTime) {
                GameSettings.settingsScreens.rotate()
            }   // if (game.runtime() >= settings.nextTime)
            break

        case GameMode.FirstRoll:
            FirstRoll.moveDice()
            if (FirstRoll.findFirstPlayer()) {
                // Start game!
                startGame()
            }

        case GameMode.Main:
            break

        case GameMode.DiceTest:
            if (g_diceTest.AreRolling) {
                g_diceTest.move()
                if (!g_diceTest.AreRolling) {
                    game.splash('Roll: ' + g_diceTest.Roll + ' Doubles: ' + g_diceTest.AreDoubles)
                }
            }
            break
    }   // switch (g_gameMode)
})  // game.onUpdate()

/**
 * Other functions
 */
function startGame(): void {
    g_gameMode = GameMode.NotReady
    GameSettings.settingsScreens.release()
    scene.setBackgroundImage(assets.image`bg`)
    g_gameMode = GameMode.Main
}   // startGame()

/**
 * Main() a.k.a. game.onStart()
 */
Attract.start()
// startAvatarTest()
// startDiceTest()