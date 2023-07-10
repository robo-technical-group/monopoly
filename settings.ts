/**
 * Game settings and configuration screens
 */
namespace GameSettings {
    /**
     * Constants
     */
    // Milliseconds for a bank bump to be visible.
    export const BANK_BUMP_VISIBLE: number = 2000
    // export const CURRENCY_SYMBOL: string = '$'
    export const CURRENCY_SYMBOL: string = 'M'
    export const CURRENCY_IS_PREFIX: boolean = true
    export const JAIL_FEE: number = 50
    const TEXT_DONE = 'Start game!'
    const TEXT_HARDWARE_CONTROLLER: string = 'You must use a shared controller when playing this game on hardware.'
    const TEXT_ONE_PLAYER: string = 'This game does not have AI players yet. A one-player game will never end.'
    const TEXT_SETTINGS_HEADLINES: string[] = ['Game Options',]
    const TEXT_SETTINGS_BOARD_TAB: string = 'Board size'
    const TEXT_SETTINGS_BOARD: string[][] = [
        ['Standard board', 'Mega board',],
    ]
    const TEXT_SETTINGS_DEPOTS_TAB: string = 'Depots'
    const TEXT_SETTINGS_DEPOTS: string[][] = [
        ['No train depots', 'Add train depots'],
    ]
    const TEXT_SETTINGS_PLAYERS_TAB: string = 'Players'
    const TEXT_SETTINGS_PLAYERS: string[][] = [
        ['1 player', '2 players', '3 players', '4 players',],
    ]
    const TEXT_SETTINGS_MULTIPLAYER_TAB: string = 'Multiplayer'
    export const TEXT_SETTINGS_MULTIPLAYER: string[][] = [
        ['Shared controller', 'Online/Multiple controllers',],
    ]
    const TEXT_SETTINGS_MOVEMENT_TAB: string = 'Movement'
    const TEXT_SETTINGS_MOVEMENT: string[][] = [
        ['Dice', 'Standard', '+ speed die',],
        ['Bus Tickets', 'No', 'Yes',],
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
        settingsScreens.addScreen(TEXT_SETTINGS_MOVEMENT_TAB, TEXT_SETTINGS_MOVEMENT, true)
        settingsScreens.addScreen(TEXT_SETTINGS_BOARD_TAB, TEXT_SETTINGS_BOARD, false)
        settingsScreens.addScreen(TEXT_SETTINGS_DEPOTS_TAB, TEXT_SETTINGS_DEPOTS, false)

        /**
         * Default settings:
         * - Two players.
         * - Local for hardware, multiplayer otherwise.
         * - No speed die + no bus tickets.
         * - Standard board.
         * - No train depots.
         */
        settingsScreens.setSelectionForScreen(0, 0, 1)
        if (HARDWARE) {
            settingsScreens.setSelectionForScreen(1, 0, 0)
        } else {
            settingsScreens.setSelectionForScreen(1, 0, 1)
        }
        settingsScreens.setSelectionForScreen(2, 0, 0)
        settingsScreens.setSelectionForScreen(2, 1, 0)
        settingsScreens.setSelectionForScreen(3, 0, 0)
        settingsScreens.setSelectionForScreen(4, 0, 0)
    }

    export function collect(): void {
        switch (settingsScreens.getSelectionForScreen(1, 0)) {
            case 0:
                controllers = ControllerSetting.Single
                break

            case 1:
                controllers = ControllerSetting.Multiple
                break
        }
        g_state.SpeedDie = (settingsScreens.getSelectionForScreen(2, 0) == 1)
        g_state.Bus = (settingsScreens.getSelectionForScreen(2, 1) == 1)
        g_state.BoardIndex = settingsScreens.getSelectionForScreen(3, 0)
        g_state.NumPlayers = settingsScreens.getSelectionForScreen(0, 0) + 1
        g_state.Depots = (settingsScreens.getSelectionForScreen(4, 0) == 1)
    }

    export function start(): void {
        g_state.Mode = GameMode.NotReady
        Attract.splashScreen.release()
        build()
        settingsScreens.build()
        g_state.Mode = GameMode.Settings
    }

    export function update(): void {
        if (game.runtime() >= settingsScreens.nextTime) {
            settingsScreens.rotate()
        }   // if (game.runtime() >= settingsScreens.nextTime)
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
