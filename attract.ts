/**
 * Code for attract mode
 */

const TEXT_HEADLINES: string[][] = [
    ['My Game is', '(C) 20XX'],
    ['Programmed in', 'MakeCode Arcade'],
    ['by', 'Me']
]
const TEXT_ACTIONS: string[][] = [[
    'Left/Right = Action',
    'Up = Action',
    'Down = Action',
    'A = Action',
    'B = Action'
]]
const TEXT_TITLES: string[] = ['My Game', 'in JavaScript']

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
