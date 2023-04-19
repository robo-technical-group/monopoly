/**
 * Routines for determining first player.
 */
namespace FirstRoll {
    const HEADING_TEXT: string = 'Highest roll goes first'
    const FOOTER_TEXT: string = 'Players: Press A to roll!'
    
    /**
     * Global variables
     */
    let firstRollStarted: boolean[] = []
    export let firstPlayer: number = 0

    /**
     * Functions
     */
    /**
     * Returns true when first player has been determined.
     */
    export function findFirstPlayer(): boolean {
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

    export function moveDice(): void {
        for (let p of g_state.Players) {
            if (p.Dice.AreRolling) {
                p.Dice.move()
            }
        }
    }

    export function setup(): void {
        g_state.Mode = GameMode.NotReady
        scene.setBackgroundColor(Color.Wine)
        let header: TextSprite = textsprite.create(HEADING_TEXT,
            Color.Transparent, Color.Yellow)
        header.setPosition(80, 5)
        let footer: TextSprite = textsprite.create(FOOTER_TEXT,
            Color.Transparent, Color.White)
        footer.setPosition(80, 115)
        let deltaX: number = Math.floor(160 / g_state.NumPlayers)
        let x: number = Math.floor(deltaX / 2)
        let y: number = 100
        for (let i: number = 0; i < g_state.NumPlayers; i++) {
            let p: Player = g_state.Players[i]
            p.moveSprite(x, y)
            p.showSprite()
            p.Dice.Orientation = DiceOrientation.Horizontal
            p.Dice.setStartLocation(x - 7, y - 20)
            p.Dice.setStopLocation(x - 7, 16)
            p.Dice.setLocationChange(0, -5)
            p.Dice.show()
            x += deltaX
            firstRollStarted.push(false)
        }
        g_state.Mode = GameMode.FirstRoll
    }

    export function startRoll(player: number): void {
        if (player < 1 || player > g_state.NumPlayers) {
            return
        }
        firstRollStarted[player - 1] = true
        g_state.Players[player - 1].Dice.startRoll()
    }
}

namespace FirstRollTests {
    const PLAYER_NAMES: string[] = ['Robo', 'Xander', 'Lex', 'Solar',]
    const PLAYER_AVATARS: number[] = [0, 1, 2, 3]
    export function start(numPlayers: number): void {
        g_state.NumPlayers = numPlayers
        for (let i: number = 0; i < numPlayers; i++) {
            g_state.Players[i].Name = PLAYER_NAMES[i]
            g_state.Players[i].Avatar = PLAYER_AVATARS[i]
        }
        FirstRoll.setup()
    }
}