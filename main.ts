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

/**
 * Game loops
 */
game.onUpdate(function () {
    switch (g_gameMode) {
        case GameMode.Attract:
            if (game.runtime() >= g_splashScreen.nextTime) {
                g_splashScreen.rotate()
            }   // if (game.runtime() >= splash.nextTime)
            break

        case GameMode.Settings:
            if (game.runtime() >= g_settingsScreens.nextTime) {
                g_settingsScreens.rotate()
            }   // if (game.runtime() >= settings.nextTime)
            break

        case GameMode.Main:
            break
    }   // switch (g_gameMode)
})  // game.onUpdate()

/**
 * Other functions
 */
function startGame(): void {
    g_gameMode = GameMode.NotReady
    g_settingsScreens.release()
    scene.setBackgroundImage(assets.image`bg`)
    g_gameMode = GameMode.Main
}   // startGame()

/**
 * Main() a.k.a. game.onStart()
 */
startAttractMode()
