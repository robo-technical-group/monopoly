/**
 * Controller event handlers
 */
function pressA(player: number): void {
    switch (g_state.Mode) {
        case GameMode.Attract:
            if (player == 1) {
                GameSettings.start()
            }
            break

        case GameMode.Settings:
            if (player == 1) {
                GameSettings.settingsScreens.select()
                if (GameSettings.settingsScreens.done) {
                    if (GameSettings.validate()) {
                        GameSettings.collect()
                        Avatar.startSelection()
                    }
                }   // if (GameSettings.settingsScreens.done)
            }
            break

        case GameMode.AvatarSelect:
            if (Avatar.selection.currPlayer == player) {
                Avatar.select()
            }
            break

        case GameMode.FirstRoll:
            FirstRoll.startRoll(player)
            break

        case GameMode.Main:
            break

        case GameMode.AvatarTest:
            AvatarTest.showNextAvatarTest()
            break

        case GameMode.DiceTest:
            DiceTests.diceTest.startRoll()
    }   // switch (g_state.Mode)
}

function pressB(player: number): void {
    switch (g_state.Mode) {
        case GameMode.Attract:
            if (player == 1) {
                GameSettings.start()
            }
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
    }   // switch (g_state.Mode)
}

function pressDown(player: number): void {
    switch (g_state.Mode) {
        case GameMode.Attract:
            if (player == 1) {
                GameSettings.start()
            }
            break

        case GameMode.Settings:
            if (player == 1) {
                GameSettings.settingsScreens.moveCursorDown()
            }
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
    }   // switch (g_state.Mode)
}

function pressLeft(player: number): void {
    switch (g_state.Mode) {
        case GameMode.Attract:
            if (player == 1) {
                GameSettings.start()
            }
            break

        case GameMode.Settings:
            if (player == 1) {
                GameSettings.settingsScreens.moveCursorLeft()
            }
            break

        case GameMode.AvatarSelect:
            if (Avatar.selection.currPlayer == player) {
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
    }   // switch (g_state.Mode)
}

function pressMenu(): void {
    if (PauseMenu.isMenuShowing) {
        PauseMenu.release()
    } else {
        PauseMenu.show()
    }
}

function pressRight(player: number): void {
    switch (g_state.Mode) {
        case GameMode.Attract:
            if (player == 1) {
                GameSettings.start()
            }
            break

        case GameMode.Settings:
            if (player == 1) {
                GameSettings.settingsScreens.moveCursorRight()
            }
            break

        case GameMode.AvatarSelect:
            if (Avatar.selection.currPlayer == player) {
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
    }   // switch (g_state.Mode)
}

function pressUp(player: number) {
    switch (g_state.Mode) {
        case GameMode.Attract:
            if (player == 1) {
                GameSettings.start()
            }
            break

        case GameMode.Settings:
            if (player == 1) {
                GameSettings.settingsScreens.moveCursorUp()
            }
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
    }   // switch (g_state.Mode)
}

/**
 * Player 1
 */
controller.player1.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Pressed,
    () => pressA(1))

controller.player1.onButtonEvent(ControllerButton.B, ControllerButtonEvent.Pressed,
    () => pressB(1))

controller.player1.onButtonEvent(ControllerButton.Up, ControllerButtonEvent.Pressed,
    () => pressUp(1))

controller.player1.onButtonEvent(ControllerButton.Down, ControllerButtonEvent.Pressed,
    () => pressDown(1))

controller.player1.onButtonEvent(ControllerButton.Left, ControllerButtonEvent.Pressed,
    () => pressLeft(1))

controller.player1.onButtonEvent(ControllerButton.Right, ControllerButtonEvent.Pressed,
    () => pressRight(1))

controller.menu.onEvent(ControllerButtonEvent.Pressed, () => pressMenu())

/**
 * Player 2
 */
controller.player2.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Pressed,
    () => pressA(2))

controller.player2.onButtonEvent(ControllerButton.B, ControllerButtonEvent.Pressed,
    () => pressB(2))

controller.player2.onButtonEvent(ControllerButton.Up, ControllerButtonEvent.Pressed,
    () => pressUp(2))

controller.player2.onButtonEvent(ControllerButton.Down, ControllerButtonEvent.Pressed,
    () => pressDown(2))

controller.player2.onButtonEvent(ControllerButton.Left, ControllerButtonEvent.Pressed,
    () => pressLeft(2))

controller.player2.onButtonEvent(ControllerButton.Right, ControllerButtonEvent.Pressed,
    () => pressRight(2))

/**
 * Player 3
 */
controller.player3.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Pressed,
    () => pressA(3))

controller.player3.onButtonEvent(ControllerButton.B, ControllerButtonEvent.Pressed,
    () => pressB(3))

controller.player3.onButtonEvent(ControllerButton.Up, ControllerButtonEvent.Pressed,
    () => pressUp(3))

controller.player3.onButtonEvent(ControllerButton.Down, ControllerButtonEvent.Pressed,
    () => pressDown(3))

controller.player3.onButtonEvent(ControllerButton.Left, ControllerButtonEvent.Pressed,
    () => pressLeft(3))

controller.player3.onButtonEvent(ControllerButton.Right, ControllerButtonEvent.Pressed,
    () => pressRight(3))

/**
 * Player 4
 */
controller.player4.onButtonEvent(ControllerButton.A, ControllerButtonEvent.Pressed,
    () => pressA(4))

controller.player4.onButtonEvent(ControllerButton.B, ControllerButtonEvent.Pressed,
    () => pressB(4))

controller.player4.onButtonEvent(ControllerButton.Up, ControllerButtonEvent.Pressed,
    () => pressUp(4))

controller.player4.onButtonEvent(ControllerButton.Down, ControllerButtonEvent.Pressed,
    () => pressDown(4))

controller.player4.onButtonEvent(ControllerButton.Left, ControllerButtonEvent.Pressed,
    () => pressLeft(4))

controller.player4.onButtonEvent(ControllerButton.Right, ControllerButtonEvent.Pressed,
    () => pressRight(4))
