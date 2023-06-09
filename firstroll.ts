/**
 * Routines for determining first player.
 */
namespace SpriteKind {
    export const FirstRoll = SpriteKind.create()
}

namespace FirstRoll {
    const BLINK_INTERVAL: number = 500

    /**
     * Global variables
     */
    let firstRollStarted: boolean[] = []
    export let firstPlayer: number = 0
    let cursor: Sprite = null
    let nextUpdate: number = 0
    export let ready: boolean = false

    /**
     * Functions
     */
    /**
     * Returns true when first player has been determined.
     */
    function foundFirstPlayer(): boolean {
        let toReturn: boolean = false
        for (let frs of firstRollStarted) {
            if (!frs) {
                return false
            }
        }
        for (let p of g_state.Players) {
            if (p.Dice.AreRolling) {
                return false
            }
        }
        let highRoll: number = 0
        let winPlayer: number[] = []
        for (let i: number = 0; i < g_state.NumPlayers; i++) {
            let p: Player = g_state.Players[i]
            if (p.Dice.Visible && p.Dice.Roll == highRoll) {
                winPlayer.push(i)
            }
            if (p.Dice.Visible && p.Dice.Roll > highRoll) {
                winPlayer = []
                winPlayer.push(i)
                highRoll = p.Dice.Roll
            }
        }
        if (winPlayer.length > 1) {
            for (let i: number = 0; i < g_state.NumPlayers; i++) {
                if (winPlayer.indexOf(i) > -1) {
                    g_state.Players[i].Dice.startRoll()
                } else {
                    g_state.Players[i].Dice.hide()
                }
            }
        } else {
            firstPlayer = winPlayer[0] + 1
            toReturn = true
        }
        return toReturn
    }

    function moveDice(): void {
        for (let p of g_state.Players) {
            if (p.Dice.AreRolling) {
                p.Dice.move()
            }
        }
    }

    export function setup(): void {
        g_state.Mode = GameMode.NotReady
        scene.setBackgroundColor(Color.Wine)
        let header: TextSprite = textsprite.create(Strings.FIRSTROLL_HEADING_TEXT,
            Color.Transparent, Color.Yellow)
        header.setPosition(80, 5)
        let footer: TextSprite = textsprite.create(Strings.FIRSTROLL_FOOTER_TEXT,
            Color.Transparent, Color.White)
        footer.setPosition(80, 115)
        let deltaX: number = Math.floor(160 / g_state.NumPlayers)
        let x: number = Math.floor(deltaX / 2)
        let y: number = 100
        g_state.Players.forEach((p: Player, index: number) => {
            p.moveSprite(x, y)
            p.showSprite()
            p.Dice.Count = 2
            p.Dice.Orientation = DiceOrientation.Horizontal
            p.Dice.setStartLocation(x - 7, y - 20)
            p.Dice.setStopLocation(x - 7, 16)
            p.Dice.setLocationChange(0, -5)
            p.Dice.show()
            x += deltaX
            firstRollStarted.push(false)
        })
        if (GameSettings.controllers == ControllerSetting.Single) {
            cursor = sprites.create(assets.image`playerCursor`, SpriteKind.FirstRoll)
            cursor.setFlag(SpriteFlag.Ghost, true)
            cursor.setFlag(SpriteFlag.Invisible, true)
            let firstPlayer: Player = g_state.getPlayer(1)
            cursor.setPosition(firstPlayer.Sprite.x, firstPlayer.Sprite.y)
            update()
        }
        g_state.Mode = GameMode.FirstRoll
    }

    export function startRoll(player: number): void {
        if (player < 1 || player > g_state.NumPlayers) {
            return
        }
        if (GameSettings.controllers == ControllerSetting.Single) {
            for (let i: number = 0; i < g_state.NumPlayers; i++) {
                if (!firstRollStarted[i]) {
                    player = i + 1
                    if (player < g_state.NumPlayers) {
                        let p: Player = g_state.Players[player]
                        cursor.setPosition(p.Sprite.x, p.Sprite.y)
                    } else {
                        cursor.setPosition(-20, -20)
                    }
                    break
                }
            }
        } else if (!firstRollStarted[player - 1]) {
            firstRollStarted[player - 1] = true
            g_state.getPlayer(player).Dice.startRoll()
        }
    }

    export function update(): void {
        moveDice()
        if (GameSettings.controllers == ControllerSetting.Single &&
                nextUpdate <= game.runtime()) {
            cursor.setFlag(SpriteFlag.Invisible,
                (cursor.flags & SpriteFlag.Invisible) == 0)
            nextUpdate = game.runtime() + BLINK_INTERVAL
        }
        if (foundFirstPlayer()) {
            g_state.CurrPlayer = firstPlayer
            ready = true
            let msg: string = Strings.FIRSTROLL_START.replace('%PLAYERNAME%',
                g_state.getPlayer(firstPlayer).Name)
            game.splash(msg)
        }
    }
}

namespace FirstRollTests {
    const PLAYER_NAMES: string[] = ['Robo', 'Xander', 'Lex', 'Solar',]
    const PLAYER_AVATARS: number[] = [0, 1, 2, 3]
    export function start(numPlayers: number): void {
        g_state.NumPlayers = numPlayers
        g_state.Players.forEach((value: Player, index: number) => {
            value.Name = PLAYER_NAMES[index]
            value.Avatar = PLAYER_AVATARS[index]
        })
        FirstRoll.setup()
    }
}