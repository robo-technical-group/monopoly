/**
 * Controller event handlers
 */
/**
 * Player 1
 */
controller.player1.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Pressed, function() {
    switch (GameSettings.gameMode) {
        case GameMode.Attract:
            GameSettings.start()
            break

        case GameMode.Settings:
            GameSettings.settingsScreens.select()
            if (GameSettings.settingsScreens.done) {
                if (GameSettings.validate()) {
                    GameSettings.collect()
                    Avatar.startSelection()
                }
            }   // if (GameSettings.settingsScreens.done)
            break

        case GameMode.AvatarSelect:
            if (Avatar.selection.currPlayer == 1) {
                Avatar.select()
            }
            break

        case GameMode.FirstRoll:
            FirstRoll.startRoll(1)
            break

        case GameMode.Main:
            break

        case GameMode.AvatarTest:
            AvatarTest.showNextAvatarTest()
            break

        case GameMode.DiceTest:
            DiceTests.diceTest.startRoll()
    }   // switch (GameSettings.gameMode)
})

controller.player1.onButtonEvent(ControllerButton.B, ControllerButtonEvent.Pressed, function () {
    switch (GameSettings.gameMode) {
        case GameMode.Attract:
            GameSettings.start()
            break

        case GameMode.Settings:
            break

        case GameMode.Main:
            break

        case GameMode.AvatarTest:
            AvatarTest.toggleAvatarTestAnims()
            break

        case GameMode.DiceTest:
            if (DiceTests.diceTest.Skin == DiceSkin.Orange) {
                DiceTests.diceTest.Skin = DiceSkin.White
            } else {
                DiceTests.diceTest.Skin++
            }
            break
    }   // switch (GameSettings.gameMode)
})

controller.player1.onButtonEvent(ControllerButton.Up, ControllerButtonEvent.Pressed, function () {
    switch (GameSettings.gameMode) {
        case GameMode.Attract:
            GameSettings.start()
            break

        case GameMode.Settings:
            GameSettings.settingsScreens.moveCursorUp()
            break

        case GameMode.Main:
            break

        case GameMode.AvatarTest:
            AvatarTest.showTestAvatarBack()
            break

        case GameMode.DiceTest:
            DiceTests.diceTest.Orientation = DiceOrientation.Horizontal
            DiceTests.diceTest.setStartLocation(5, 115)
            DiceTests.diceTest.setStopLocation(5, 6)
            DiceTests.diceTest.setLocationChange(0, -5)
            DiceTests.diceTest.show()
            break
    }   // switch (GameSettings.gameMode)
})

controller.player1.onButtonEvent(ControllerButton.Down, ControllerButtonEvent.Pressed, function () {
    switch (GameSettings.gameMode) {
        case GameMode.Attract:
            GameSettings.start()
            break

        case GameMode.Settings:
            GameSettings.settingsScreens.moveCursorDown()
            break

        case GameMode.Main:
            break

        case GameMode.AvatarTest:
            AvatarTest.showTestAvatarFront()
            break

        case GameMode.DiceTest:
            DiceTests.diceTest.Orientation = DiceOrientation.Horizontal
            DiceTests.diceTest.setStartLocation(5, 5)
            DiceTests.diceTest.setStopLocation(5, 114)
            DiceTests.diceTest.setLocationChange(0, 5)
            DiceTests.diceTest.show()
            break
    }   // switch (GameSettings.gameMode)
})

controller.player1.onButtonEvent(ControllerButton.Left, ControllerButtonEvent.Pressed, function () {
    switch (GameSettings.gameMode) {
        case GameMode.Attract:
            GameSettings.start()
            break

        case GameMode.Settings:
            GameSettings.settingsScreens.moveCursorLeft()
            break

        case GameMode.AvatarSelect:
            if (Avatar.selection.currPlayer == 1) {
                Avatar.showNext(-1)
            }
            break

        case GameMode.Main:
            break

        case GameMode.AvatarTest:
            AvatarTest.showTestAvatarLeft()
            break

        case GameMode.DiceTest:
            DiceTests.diceTest.Orientation = DiceOrientation.Vertical
            DiceTests.diceTest.setStartLocation(155, 5)
            DiceTests.diceTest.setStopLocation(6, 5)
            DiceTests.diceTest.setLocationChange(-5, 0)
            DiceTests.diceTest.show()
            break
    }   // switch (GameSettings.gameMode)
})

controller.player1.onButtonEvent(ControllerButton.Right, ControllerButtonEvent.Pressed, function () {
    switch (GameSettings.gameMode) {
        case GameMode.Attract:
            GameSettings.start()
            break

        case GameMode.Settings:
            GameSettings.settingsScreens.moveCursorRight()
            break

        case GameMode.AvatarSelect:
            if (Avatar.selection.currPlayer == 1) {
                Avatar.showNext(1)
            }
            break

        case GameMode.Main:
            break

        case GameMode.AvatarTest:
            AvatarTest.showTestAvatarRight()
            break

        case GameMode.DiceTest:
            DiceTests.diceTest.Orientation = DiceOrientation.Vertical
            DiceTests.diceTest.setStartLocation(5, 5)
            DiceTests.diceTest.setStopLocation(154, 5)
            DiceTests.diceTest.setLocationChange(5, 0)
            DiceTests.diceTest.show()
            break
    }   // switch (GameSettings.gameMode)
})

/**
 * Player 2
 */
controller.player2.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Pressed, function () {
    switch (GameSettings.gameMode) {
        case GameMode.AvatarSelect:
            if (Avatar.selection.currPlayer == 2) {
                Avatar.select()
            }
            break

        case GameMode.FirstRoll:
            FirstRoll.startRoll(2)
            break
    }
})

controller.player2.onButtonEvent(ControllerButton.B, ControllerButtonEvent.Pressed, function () {
    switch (GameSettings.gameMode) {
        default:
            break
    }
})

controller.player2.onButtonEvent(ControllerButton.Up, ControllerButtonEvent.Pressed, function () {
    switch (GameSettings.gameMode) {
        default:
            break
    }
})

controller.player2.onButtonEvent(ControllerButton.Down, ControllerButtonEvent.Pressed, function () {
    switch (GameSettings.gameMode) {
        default:
            break
    }
})

controller.player2.onButtonEvent(ControllerButton.Left, ControllerButtonEvent.Pressed, function () {
    switch (GameSettings.gameMode) {
        case GameMode.AvatarSelect:
            if (Avatar.selection.currPlayer == 2) {
                Avatar.showNext(-1)
            }
            break
    }
})

controller.player2.onButtonEvent(ControllerButton.Right, ControllerButtonEvent.Pressed, function () {
    switch (GameSettings.gameMode) {
        case GameMode.AvatarSelect:
            if (Avatar.selection.currPlayer == 2) {
                Avatar.showNext(1)
            }
            break
    }
})

/**
 * Player 3
 */
controller.player3.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Pressed, function () {
    switch (GameSettings.gameMode) {
        case GameMode.AvatarSelect:
            if (Avatar.selection.currPlayer == 3) {
                Avatar.select()
            }
            break

        case GameMode.FirstRoll:
            FirstRoll.startRoll(3)
            break
    }
})

controller.player3.onButtonEvent(ControllerButton.B, ControllerButtonEvent.Pressed, function () {
    switch (GameSettings.gameMode) {
        default:
            break
    }
})

controller.player3.onButtonEvent(ControllerButton.Up, ControllerButtonEvent.Pressed, function () {
    switch (GameSettings.gameMode) {
        default:
            break
    }
})

controller.player3.onButtonEvent(ControllerButton.Down, ControllerButtonEvent.Pressed, function () {
    switch (GameSettings.gameMode) {
        default:
            break
    }
})

controller.player3.onButtonEvent(ControllerButton.Left, ControllerButtonEvent.Pressed, function () {
    switch (GameSettings.gameMode) {
        case GameMode.AvatarSelect:
            if (Avatar.selection.currPlayer == 3) {
                Avatar.showNext(-1)
            }
            break
    }
})

controller.player3.onButtonEvent(ControllerButton.Right, ControllerButtonEvent.Pressed, function () {
    switch (GameSettings.gameMode) {
        case GameMode.AvatarSelect:
            if (Avatar.selection.currPlayer == 3) {
                Avatar.showNext(1)
            }
            break
    }
})

/**
 * Player 4
 */
controller.player4.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Pressed, function () {
    switch (GameSettings.gameMode) {
        case GameMode.AvatarSelect:
            if (Avatar.selection.currPlayer == 4) {
                Avatar.select()
            }
            break

        case GameMode.FirstRoll:
            FirstRoll.startRoll(4)
            break
    }
})

controller.player4.onButtonEvent(ControllerButton.B, ControllerButtonEvent.Pressed, function () {
    switch (GameSettings.gameMode) {
        default:
            break
    }
})

controller.player4.onButtonEvent(ControllerButton.Up, ControllerButtonEvent.Pressed, function () {
    switch (GameSettings.gameMode) {
        default:
            break
    }
})

controller.player4.onButtonEvent(ControllerButton.Down, ControllerButtonEvent.Pressed, function () {
    switch (GameSettings.gameMode) {
        default:
            break
    }
})

controller.player4.onButtonEvent(ControllerButton.Left, ControllerButtonEvent.Pressed, function () {
    switch (GameSettings.gameMode) {
        case GameMode.AvatarSelect:
            if (Avatar.selection.currPlayer == 4) {
                Avatar.showNext(-1)
            }
            break
    }
})

controller.player4.onButtonEvent(ControllerButton.Right, ControllerButtonEvent.Pressed, function () {
    switch (GameSettings.gameMode) {
        case GameMode.AvatarSelect:
            if (Avatar.selection.currPlayer == 4) {
                Avatar.showNext(1)
            }
            break
    }
})

