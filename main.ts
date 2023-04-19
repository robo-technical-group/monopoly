/**
 * Monopoly
 * Built on
 * MakeCode Arcade JavaScript Template v. 3.1.0
 * Template last update: 17 Apr 2023 ak
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
    switch (GameSettings.gameMode) {
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
                game.splash(GameSettings.players[FirstRoll.firstPlayer - 1].Name +
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
    }   // switch (GameSettings.gameMode)
})  // game.onUpdate()

/**
 * Other functions
 */
function startGame(): void {
    GameSettings.gameMode = GameMode.NotReady
    scene.setBackgroundImage(assets.image`bg`)
    GameSettings.gameMode = GameMode.Main
}   // startGame()

/**
 * Main() a.k.a. game.onStart()
 */
// Attract.start()
// AvatarTest.startAvatarTest()
// DiceTests.start()
FirstRollTests.start(4)
