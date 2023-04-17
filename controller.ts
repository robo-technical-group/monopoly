/**
 * Controller event handlers
 */
/**
 * Player 1
 */
controller.player1.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Pressed, function() {
    switch (g_gameMode) {
        case GameMode.Attract:
            startSettingsMode()
            break

        case GameMode.Settings:
            g_settingsScreens.select()
            if (g_settingsScreens.done) {
                if (validateSettings()) {
                    // Start avatar selection mode.
                    game.splash("Let's roll!")
                }
            }   // if (g_settingsScreens.done)
            break

        case GameMode.Main:
            break
    }   // switch (g_gameMode)
})

controller.player1.onButtonEvent(ControllerButton.B, ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        case GameMode.Attract:
            startSettingsMode()
            break

        case GameMode.Settings:
            break

        case GameMode.Main:
            break
    }   // switch (g_gameMode)
})

controller.player1.onButtonEvent(ControllerButton.Up, ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        case GameMode.Attract:
            startSettingsMode()
            break

        case GameMode.Settings:
            g_settingsScreens.moveCursorUp()
            break

        case GameMode.Main:
            break
    }   // switch (g_gameMode)
})

controller.player1.onButtonEvent(ControllerButton.Down, ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        case GameMode.Attract:
            startSettingsMode()
            break

        case GameMode.Settings:
            g_settingsScreens.moveCursorDown()
            break

        case GameMode.Main:
            break
    }   // switch (g_gameMode)
})

controller.player1.onButtonEvent(ControllerButton.Left, ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        case GameMode.Attract:
            startSettingsMode()
            break

        case GameMode.Settings:
            g_settingsScreens.moveCursorLeft()
            break

        case GameMode.Main:
            break
    }   // switch (g_gameMode)
})

controller.player1.onButtonEvent(ControllerButton.Right, ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        case GameMode.Attract:
            startSettingsMode()
            break

        case GameMode.Settings:
            g_settingsScreens.moveCursorRight()
            break

        case GameMode.Main:
            break
    }   // switch (g_gameMode)
})

