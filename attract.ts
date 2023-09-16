/**
 * Attract mode routines
 */
namespace Attract {
    export const TEXT_HEADLINES: string[][] = [
        ['Monopoly is a registered', 'trademark of Hasbro'],
        ['MakeCode Arcade Port', '(C) 2023'],
        ['(C) 2023', 'Robo Technical Group'],
        ['Programmed in', 'MakeCode Arcade'],
        ['by', 'Alex K.'],
    ]
    const TEXT_ACTIONS: string[][] = [[
        'For up to four players',
        'Local or multiplayer!',
    ]]
    const TEXT_LOAD_GAME: string = 'Press B to load game'
    export const TEXT_TITLES: string[] = ['Monopoly',]

    /**
     * Global variables
     */
    export let splashScreen: SplashScreens = null

    export function build(): void {
        if (GameState.savesExist()) {
            let newActions: string[][] = []
            newActions.push(TEXT_ACTIONS[0].concat([TEXT_LOAD_GAME,]))
            splashScreen = new SplashScreens(
                TEXT_TITLES, Color.Yellow,
                TEXT_HEADLINES, Color.Brown,
                newActions, Color.LightBlue)
        } else {
            splashScreen = new SplashScreens(
                TEXT_TITLES, Color.Yellow,
                TEXT_HEADLINES, Color.Brown,
                TEXT_ACTIONS, Color.LightBlue)
        }
        for (let i: number = 0; i < 4; i++) {
            let n: number = randint(0, assets.animation`boardSides`.length +
                assets.animation`boardCorners`.length - 1)
            if (n >= assets.animation`boardSides`.length) {
                splashScreen.addMovingSprite(
                    assets.animation`boardCorners`[n - assets.animation`boardSides`.length])
            } else {
                splashScreen.addMovingSprite(
                    assets.animation`boardSides`[n]
                )
            }
        }
        for (let i: number = 0; i < 4; i++) {
            splashScreen.addMovingSprite(
                Avatar.AVATARS[randint(1, Avatar.AVATARS.length - 1)].frontImage)
        }
        splashScreen.movingSpriteOptions.mode = SpriteMode.BlankSpace
        splashScreen.movingSpriteOptions.dir = SpriteDirection.Both
        splashScreen.movingSpriteOptions.speed = 50
    }

    export function start(): void {
        build()
        splashScreen.build()
        g_state.Mode = GameMode.Attract
    }   // startAttractMode()

    export function update(): void {
        if (game.runtime() >= splashScreen.nextTime) {
            splashScreen.rotate()
        }   // if (game.runtime() >= splash.nextTime)
        if (sprites.allOfKind(SpriteKind.Moving).length === 0) {
            splashScreen.showScrollingSprite()
        }   // if (! sprites.allOfKind(SpriteKind.Moving))
    }
}
