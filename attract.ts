/**
 * Attract mode routines
 */
namespace Attract {
    export const TEXT_HEADLINES: string[][] = [
        ['Monopoly is a registered', 'trademark of Hasbro'],
        ['MakeCode Arcade Port', '(C) 2023'],
        ['(C) 2023', 'Robo Technical Group'],
        ['Programmed in', 'MakeCode Arcade'],
        ['by', 'AlexK'],
    ]
    const TEXT_ACTIONS: string[][] = [[
        'For up to four players',
        'Local or multiplayer!',
    ]]
    export const TEXT_TITLES: string[] = ['Monopoly',]

    /**
     * Global variables
     */
    export let splashScreen: SplashScreens = null

    export function build(): void {
        splashScreen = new SplashScreens(
            TEXT_TITLES, Color.Yellow,
            TEXT_HEADLINES, Color.Brown,
            TEXT_ACTIONS, Color.LightBlue)
    }

    export function start(): void {
        build()
        splashScreen.build()
        g_gameMode = GameMode.Attract
    }   // startAttractMode()
}
