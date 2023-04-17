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
                    collectSettings()
                    startAvatarSelection()
                }
            }   // if (g_settingsScreens.done)
            break

        case GameMode.AvatarSelect:
            if (g_avatarSelection.currPlayer == 0) {
                selectAvatar()
            }
            break

        case GameMode.Main:
            break

        case GameMode.AvatarTest:
            showNextAvatarTest()
            break

        case GameMode.DiceTest:
            g_diceTest.startRoll()
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

        case GameMode.AvatarTest:
            toggleAvatarTestAnims()
            break

        case GameMode.DiceTest:
            if (g_diceTest.Skin == DiceSkin.Orange) {
                g_diceTest.Skin = DiceSkin.White
            } else {
                g_diceTest.Skin++
            }
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

        case GameMode.AvatarTest:
            showTestAvatarBack()
            break

        case GameMode.DiceTest:
            g_diceTest.Orientation = DiceOrientation.Horizontal
            g_diceTest.setStartLocation(5, 115)
            g_diceTest.setStopLocation(5, 6)
            g_diceTest.setLocationChange(0, -5)
            g_diceTest.show()
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

        case GameMode.AvatarTest:
            showTestAvatarFront()
            break

        case GameMode.DiceTest:
            g_diceTest.Orientation = DiceOrientation.Horizontal
            g_diceTest.setStartLocation(5, 5)
            g_diceTest.setStopLocation(5, 114)
            g_diceTest.setLocationChange(0, 5)
            g_diceTest.show()
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

        case GameMode.AvatarSelect:
            if (g_avatarSelection.currPlayer == 0) {
                showNextAvatar(-1)
            }
            break

        case GameMode.Main:
            break

        case GameMode.AvatarTest:
            showTestAvatarLeft()
            break

        case GameMode.DiceTest:
            g_diceTest.Orientation = DiceOrientation.Vertical
            g_diceTest.setStartLocation(155, 5)
            g_diceTest.setStopLocation(6, 5)
            g_diceTest.setLocationChange(-5, 0)
            g_diceTest.show()
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

        case GameMode.AvatarSelect:
            if (g_avatarSelection.currPlayer == 0) {
                showNextAvatar(1)
            }
            break

        case GameMode.Main:
            break

        case GameMode.AvatarTest:
            showTestAvatarRight()
            break

        case GameMode.DiceTest:
            g_diceTest.Orientation = DiceOrientation.Vertical
            g_diceTest.setStartLocation(5, 5)
            g_diceTest.setStopLocation(154, 5)
            g_diceTest.setLocationChange(5, 0)
            g_diceTest.show()
            break
    }   // switch (g_gameMode)
})

/**
 * Player 2
 */
controller.player2.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        case GameMode.AvatarSelect:
            if (g_avatarSelection.currPlayer == 1) {
                selectAvatar()
            }
            break
    }
})

controller.player2.onButtonEvent(ControllerButton.B, ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        default:
            break
    }
})

controller.player2.onButtonEvent(ControllerButton.Up, ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        default:
            break
    }
})

controller.player2.onButtonEvent(ControllerButton.Down, ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        default:
            break
    }
})

controller.player2.onButtonEvent(ControllerButton.Left, ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        case GameMode.AvatarSelect:
            if (g_avatarSelection.currPlayer == 1) {
                showNextAvatar(-1)
            }
            break
    }
})

controller.player2.onButtonEvent(ControllerButton.Right, ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        case GameMode.AvatarSelect:
            if (g_avatarSelection.currPlayer == 1) {
                showNextAvatar(1)
            }
            break
    }
})

/**
 * Player 3
 */
controller.player3.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        case GameMode.AvatarSelect:
            if (g_avatarSelection.currPlayer == 2) {
                selectAvatar()
            }
            break
    }
})

controller.player3.onButtonEvent(ControllerButton.B, ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        default:
            break
    }
})

controller.player3.onButtonEvent(ControllerButton.Up, ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        default:
            break
    }
})

controller.player3.onButtonEvent(ControllerButton.Down, ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        default:
            break
    }
})

controller.player3.onButtonEvent(ControllerButton.Left, ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        case GameMode.AvatarSelect:
            if (g_avatarSelection.currPlayer == 2) {
                showNextAvatar(-1)
            }
            break
    }
})

controller.player3.onButtonEvent(ControllerButton.Right, ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        case GameMode.AvatarSelect:
            if (g_avatarSelection.currPlayer == 2) {
                showNextAvatar(1)
            }
            break
    }
})

/**
 * Player 4
 */
controller.player4.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        case GameMode.AvatarSelect:
            if (g_avatarSelection.currPlayer == 3) {
                selectAvatar()
            }
            break
    }
})

controller.player4.onButtonEvent(ControllerButton.B, ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        default:
            break
    }
})

controller.player4.onButtonEvent(ControllerButton.Up, ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        default:
            break
    }
})

controller.player4.onButtonEvent(ControllerButton.Down, ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        default:
            break
    }
})

controller.player4.onButtonEvent(ControllerButton.Left, ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        case GameMode.AvatarSelect:
            if (g_avatarSelection.currPlayer == 3) {
                showNextAvatar(-1)
            }
            break
    }
})

controller.player4.onButtonEvent(ControllerButton.Right, ControllerButtonEvent.Pressed, function () {
    switch (g_gameMode) {
        case GameMode.AvatarSelect:
            if (g_avatarSelection.currPlayer == 3) {
                showNextAvatar(1)
            }
            break
    }
})

