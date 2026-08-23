namespace Tutorial {
    enum Tutorial {
        First = 0,
        Settings,
        FirstTurn,
        FirstTurnB,
        FirstTurnC,
        FirstTurnD,
        FirstTurnE,
        FirstSale,
        FirstMonopoly,
    }

    const ASK: string[] = [
        'Enable tutorials?',
        'A = Yes, B = No',
    ]
    const GAME_NAME: string = 'Monopoly'
    const INTRO: string = 'Welcome to ' + GAME_NAME + '!'
    const PERSIST_KEY_PREFIX: string = 'TUTORIAL_PERSIST_'
    const PLAYER_1_REMINDER: string = 'Player 1: Remember that you are in control of the tutorials.\n \n' +
        'Player 1, press A to continue.'
    const TEXT: string[] = [
        // First
        'TUTORIAL MODE ENABLED\n \nPlayer 1 should read the tutorials aloud to the other players.\n \n' +
        'Player 1 controls the tutorials. Player 1, press your A button to continue. \n \n' +
        'You can enable and disable the tutorials from the system menu by selecting the Menu button.',

        // Settings
        'Use these screens to change the settings for your game.\n \n' +
        'For your first game, just set the number of players and whether your are playing over the network ' +
        'in the Multiplayer screen.\n \n \n' +
        'The other screens set advanced options for variations of the core game.\n \n' +
        'The Next and Previous buttons switch screens.\n \n' +
        'Select Start Game! when you are happy with your settings.',

        // First turn
        'Welcome to the game board and main screen!',

        // First turn (B)
        'At the bottom of the screen is the game board.\n \n' +
        'It shows the board spaces, the players, and the status of each property.\n \n' +
        "You'll see the player pieces as you pass them on the game board, " +
        'houses, hotels, and more!\n \n' +
        'If a property is for sale, then you will see the price at the bottom of the property. ' +
        'If it is owned, then you will see a tag indicating the owner.',

        // First turn (C)
        "At the top of the screen is the game's current status.\n \n" +
        "It shows each player's current inventory and cash on hand.\n \n" +
        'The current player is marked with a star in front of their name. ' +
        'Each square represents an asset, like a property on the board. ' +
        'When a player owns an asset, it lights up with its color.',

        // First turn (D)
        'The center of the screen shows the action menu. ' +
        'When the game is waiting for a player, a menu appears showing the possible actions. ' +
        'Press a button on your controller to activate the related action.',

        // First turn (E)
        "You'll learn more about each action and board space when you encounter it for the first time. \n \n" +
        "For now, %PLAYERNAME%, it's your turn!",

        // First sale
        'You purchased the first property of the game. Congratulations!\n \n' +
        'When another player lands on your property, they owe you rent to stay at your property.\n \n' +
        'In this version of the game, the money will automatically transfer to you. ' +
        'In the future, you will need to demand rent from a player who lands on your property.',

        // First monopoly
        'You own the first monopoly of the game. Congratulations!\n \n' +
        'You can build houses and hotels on your property at any time by pressing the B button. ' +
        "You can even interrupt other player's turns! " +
        'You must build evenly (there can be at most one house difference) across the properties in the monopoly.',
    ]

    export function resetTutorials(): void {
        for (let i: number = 0; i < 2; i++) {
            if (i < 2) {
                let key: string = PERSIST_KEY_PREFIX + i
                settings.writeNumber(key, 0)
            }
            g_state.setTutorialState(i, false)
        }
    }

    export function firstMonopoly(): void {
        show(Tutorial.FirstMonopoly)
    }

    export function firstSale(): void {
        show(Tutorial.FirstSale)
    }

    export function firstTurn(): void {
        if (g_state.getTutorialState(Tutorial.FirstTurn)) {
            return
        } else {
            g_state.setTutorialState(Tutorial.FirstTurnB, false)
            g_state.setTutorialState(Tutorial.FirstTurnC, false)
            g_state.setTutorialState(Tutorial.FirstTurnD, false)
            g_state.setTutorialState(Tutorial.FirstTurnE, false)
        }
        show(Tutorial.FirstTurn)
        g_state.setTutorialState(Tutorial.FirstTurn, false)
        show(Tutorial.FirstTurnB, DialogLayout.Top)
        show(Tutorial.FirstTurnC, DialogLayout.Bottom)
        show(Tutorial.FirstTurnD, DialogLayout.Bottom)
        show(Tutorial.FirstTurnE)
        g_state.setTutorialState(Tutorial.FirstTurn, true)
    }

    export function firstTutorial(): void {
        show(Tutorial.First, DialogLayout.Full, true)
    }

    export function gameSettings(): void {
        show(Tutorial.Settings, DialogLayout.Top, true)
    }

    function show(tutorial: Tutorial, loc: DialogLayout = DialogLayout.Full, persist: boolean = false): void {
        if (tutorial == Tutorial.First) {
            g_state.TutorialMode = game.ask(ASK[0], ASK[1])
        }
        if (!g_state.TutorialMode) {
            return
        }
        let persistKey: string = PERSIST_KEY_PREFIX + tutorial
        if (persist &&
            settings.exists(persistKey) &&
            settings.readNumber(persistKey) == 1
        ) {
            if (tutorial == Tutorial.First) {
                game.showLongText(PLAYER_1_REMINDER, DialogLayout.Center)
            }
            return
        }
        if (g_state.getTutorialState(tutorial)) {
            return
        }
        let m: string = 
            (loc == DialogLayout.Full ? GAME_NAME.toUpperCase() + " TUTORIAL\n \n" : "") +
            TEXT[tutorial]
        m = m.replaceAll("%PLAYERNAME%", g_state.getCurrPlayer().Name)
        game.showLongText(m, loc)
        g_state.setTutorialState(tutorial, true)
        if (persist) {
            settings.writeNumber(persistKey, 1)
        }
    }
}