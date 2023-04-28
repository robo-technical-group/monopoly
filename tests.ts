namespace Tests {
    export const TESTING_KEY: string = 'CURRENT_TEST'
    const TITLE: string = '** TESTING MODE **'
    const INSTRUCTIONS: string = 'Stop tests in system menu.'

    export function run(): void {
        let currTest: number = 0
        if (settings.exists(TESTING_KEY)) {
            currTest = settings.readNumber(TESTING_KEY)
        } else {
            settings.writeNumber(TESTING_KEY, currTest)
        }

        switch (currTest) {
            case 0:
                splash('Automated game.')
                startAutomatedGame()
                break

            case 1:
                splash('Animated board and background tests.')
                Background.show()
                BoardTests.setup()
                break

            case 2:
                splash('Game state tests')
                GameStateTests.start()
                break

            case 3:
                splash('First roll test with four players.')
                FirstRollTests.start(4)
                break

            case 4:
                splash('First roll test with three players.')
                FirstRollTests.start(3)
                break

            case 5:
                splash('First roll test with two players.')
                FirstRollTests.start(2)
                break

            case 6:
                splash('Dice tests: D-pad=change direction, A=roll')
                DiceTests.start()
                break

            default:
                // Restart tests upon reboot
                currTest = -1
                splash('Avatar tests.')
                AvatarTest.startAvatarTest()
                break
        }

        currTest++
        settings.writeNumber(TESTING_KEY, currTest)
    }

    function splash(message: string): void {
        game.showLongText(TITLE + '\n' + message + '\n' + INSTRUCTIONS,
            DialogLayout.Full)
    }

    export function startAutomatedGame(): void {
        GameStateTests.loadTestState()
        g_state.CurrPlayer = randint(1, g_state.NumPlayers)
        g_state.testMode = true
        g_state.Mode = GameMode.Main
    }
}
