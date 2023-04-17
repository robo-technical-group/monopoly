/**
 * Monopoly
 * Built on
 * MakeCode Arcade JavaScript Template v. 3.0.3
 * Template last update: 16 Apr 2023 ak
 */

/**
 * Constants
 */

/**
 * Global variables
 */

/**
 * Main() a.k.a. game.onStart()
 */
startAttractMode()

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

        case GameMode.Main:
            break
    }   // switch (g_gameMode)
})  // game.onUpdate()

/**
 * Start game modes
 */
function startGame(): void {
    g_gameMode = GameMode.NotReady
    g_splashScreen.release()
    scene.setBackgroundImage(assets.image`bg`)
    g_gameMode = GameMode.Main
}   // startGame()

/**
 * Other functions
 */
