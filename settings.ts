/**
 * Game settings and configuration screens
 */
namespace GameSettings {
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
    export let settingsScreens: OptionScreenCollection = null
    export let controllers: ControllerSetting = ControllerSetting.Multiple

    /**
     * Functions
     */
    export function build(): void {
        let headlines: string[][] = []
        headlines.push(TEXT_SETTINGS_HEADLINES)
        for (let s of Attract.TEXT_HEADLINES) {
            headlines.push(s)
        }
        settingsScreens = new OptionScreenCollection(
            Attract.TEXT_TITLES, Color.Yellow,
            headlines, Color.Brown)
        settingsScreens.titles.fontSize = 8
        settingsScreens.headlines.fontSize = 5
        settingsScreens.footer.fontSize = 5
        settingsScreens.doneText = TEXT_DONE
        settingsScreens.addScreen(TEXT_SETTINGS_PLAYERS_TAB, TEXT_SETTINGS_PLAYERS, false)
        settingsScreens.addScreen(TEXT_SETTINGS_MULTIPLAYER_TAB, TEXT_SETTINGS_MULTIPLAYER, false)

        // Default settings: two players, local for hardware, multiplayer otherwise.
        settingsScreens.setSelectionForScreen(0, 0, 1)
        if (HARDWARE) {
            settingsScreens.setSelectionForScreen(1, 0, 0)

        } else {
            settingsScreens.setSelectionForScreen(1, 0, 1)
        }
    }

    export function collect(): void {
        g_state.NumPlayers = settingsScreens.getSelectionForScreen(0, 0) + 1
        switch (settingsScreens.getSelectionForScreen(1, 0)) {
            case 0:
                controllers = ControllerSetting.Single
                break

            case 1:
                controllers = ControllerSetting.Multiple
                break
        }
    }

    export function start(): void {
        g_state.Mode = GameMode.NotReady
        Attract.splashScreen.release()
        build()
        settingsScreens.build()
        g_state.Mode = GameMode.Settings
    }

    export function validate(): boolean {
        let toReturn: boolean = true
        if (HARDWARE && settingsScreens.getSelectionForScreen(1, 0) == 0) {
            game.showLongText(TEXT_HARDWARE_CONTROLLER, DialogLayout.Full)
            toReturn = false
        }
        if (settingsScreens.getSelectionForScreen(0, 0) == 0) {
            game.showLongText(TEXT_ONE_PLAYER, DialogLayout.Full)
        }
        settingsScreens.done = toReturn
        return toReturn
    }
}
