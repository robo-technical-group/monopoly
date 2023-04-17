/**
 * Code for attract mode
 */

const TEXT_HEADLINES: string[][] = [
    ['Monopoly is a registered', 'trademark of Hasbro'],
    ['MakeCode Arcade Port', '(C) 2023'],
    ['(C) 2023', 'Robo Technical Group'],
    ['Programmed in', 'MakeCode Arcade'],
    ['by', 'AlexK']
]
const TEXT_ACTIONS: string[][] = [[
    'For up to four players',
    'Local or multiplayer!',
]]
const TEXT_TITLES: string[] = ['Monopoly',]

/**
 * Global variables
 */
let g_gameMode: GameMode = GameMode.NotReady
let g_splashScreen: SplashScreens = null

function buildSplashScreen(): void {
    g_splashScreen = new SplashScreens(
        TEXT_TITLES, Color.Yellow,
        TEXT_HEADLINES, Color.Brown,
        TEXT_ACTIONS, Color.LightBlue)
}

function startAttractMode(): void {
    buildSplashScreen()
    g_splashScreen.build()
    g_gameMode = GameMode.Attract
}   // startAttractMode()
