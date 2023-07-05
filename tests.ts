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
                splash('Test action menu.')
                startTestMenu()
                break

            case 1:
                splash('Test in-jail menu.')
                testJailMenu()
                break

            case 2:
                splash('Automated game.')
                startAutomatedGame(0)
                break

            case 3:
                splash('Animated board and background tests.')
                BackgroundTests.setup()
                break

            case 4:
                splash('Animated board tests (no background).')
                BoardTests.setup()
                break

            case 5:
                splash('Game state tests')
                GameStateTests.start()
                break

            case 6:
                splash('First roll test with four players.')
                FirstRollTests.start(4)
                break

            case 7:
                splash('First roll test with three players.')
                FirstRollTests.start(3)
                break

            case 8:
                splash('First roll test with two players.')
                FirstRollTests.start(2)
                break

            case 9:
                splash('Dice tests: D-pad=change direction, A=roll')
                DiceTests.start()
                break

            case 10:
                splash('Speed die tests: D-pad=change direction, A=roll')
                DiceTests.start(3)
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

    export function startAutomatedGame(board: number): void {
        GameStateTests.loadTestState()
        g_state.CurrPlayer = randint(1, g_state.NumPlayers)
        g_state.testMode = true
        if (board > 0) {
            g_state.BoardIndex = board
            g_state.SpeedDie = true
            g_state.Bus = true
            g_state.Depots = true
            for (let p of g_state.Players) {
                p.Bank = 2500
            }
        }
        startGame()
    }

    export function startTestMenu(): void {
        scene.setBackgroundImage(assets.image`bg`)
        GameStateTests.loadTestState()
        g_state.CurrPlayer = randint(1, g_state.NumPlayers)
        g_state.testMode = true
        g_state.Board.draw(0)
        let menu: ActionMenu = new TestActionMenu('Test action menu!')
        menu.show()
    }

    export function testJailMenu(): void {
        scene.setBackgroundImage(assets.image`bg`)
        GameStateTests.loadTestState()
        g_state.CurrPlayer = randint(1, g_state.NumPlayers)
        let p: Player = g_state.getCurrPlayer()
        g_state.Properties.state[Properties.GROUP_JAIL].properties[0].owner = g_state.CurrPlayer
        g_state.Properties.state[Properties.GROUP_JAIL].properties[1].owner = g_state.CurrPlayer
        p.goToJail()
        g_state.testMode = true
        startGame()
    }
}
