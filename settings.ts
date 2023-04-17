// Configure game settings
interface GameSettings {
    numPlayers: number
    controllers: ControllerSetting
}

/**
 * Constants
 */
const TEXT_DONE = 'Start game!'
const TEXT_HARDWARE_CONTROLLER: string = 'You must use a shared controller when playing this game on hardware.'
const TEXT_ONE_PLAYER: string = 'This game does not have AI players yet. A one-player game will never end.'
const TEXT_SETTINGS_HEADLINES: string[] = ['Game Options',]
const TEXT_SETTINGS_PLAYERS_TAB: string = 'Players'
const TEXT_SETTINGS_PLAYERS: string[][] = [
    ['1 player', '2 players', '3 players', '4 players'],
]
const TEXT_SETTINGS_MULTIPLAYER_TAB: string = 'Multiplayer'
const TEXT_SETTINGS_MULTIPLAYER: string[][] = [
    ['Shared controller', 'Online/Multiple controllers'],
]

/**
 * Global variables
 */
let g_settingsScreens: OptionScreenCollection = null
let g_settings: GameSettings = {
    numPlayers: 2,
    controllers: ControllerSetting.Multiple,
}

/**
 * Functions
 */
function buildSettingsScreens(): void {
    let headlines: string[][] = []
    headlines.push(TEXT_SETTINGS_HEADLINES)
    for (let s of TEXT_HEADLINES) {
        headlines.push(s)
    }
    g_settingsScreens = new OptionScreenCollection(
        TEXT_TITLES, Color.Yellow,
        headlines, Color.Brown)
    g_settingsScreens.titles.fontSize = 8
    g_settingsScreens.headlines.fontSize = 5
    g_settingsScreens.footer.fontSize = 5
    g_settingsScreens.doneText = TEXT_DONE
    g_settingsScreens.addScreen(TEXT_SETTINGS_PLAYERS_TAB, TEXT_SETTINGS_PLAYERS, false)
    g_settingsScreens.addScreen(TEXT_SETTINGS_MULTIPLAYER_TAB, TEXT_SETTINGS_MULTIPLAYER, false)

    // Default settings: two players, local for hardware, multiplayer otherwise.
    g_settingsScreens.setSelectionForScreen(0, 0, 1)
    if (HARDWARE) {
        g_settingsScreens.setSelectionForScreen(1, 0, 0)

    } else {
        g_settingsScreens.setSelectionForScreen(1, 0, 1)
    }
}

function collectSettings(): void {
    g_settings.numPlayers = g_settingsScreens.getSelectionForScreen(0, 0) + 1
    switch (g_settingsScreens.getSelectionForScreen(1, 0)) {
        case 0:
            g_settings.controllers = ControllerSetting.Single
            break

        case 1:
            g_settings.controllers = ControllerSetting.Multiple
            break
    }
}

function startSettingsMode(): void {
    g_gameMode = GameMode.NotReady
    g_splashScreen.release()
    buildSettingsScreens()
    g_settingsScreens.build()
    g_gameMode = GameMode.Settings
}

function validateSettings(): boolean {
    let toReturn: boolean = true
    if (HARDWARE && g_settingsScreens.getSelectionForScreen(1, 0) == 0) {
        game.showLongText(TEXT_HARDWARE_CONTROLLER, DialogLayout.Full)
        toReturn = false
    }
    if (g_settingsScreens.getSelectionForScreen(0, 0) == 0) {
        game.showLongText(TEXT_ONE_PLAYER, DialogLayout.Full)
    }
    g_settingsScreens.done = toReturn
    return toReturn
}
