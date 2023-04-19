/**
 * Routines for determining first player.
 */
namespace FirstRoll {
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
        for (let p of GameSettings.players) {
            if (p.Dice.AreRolling) {
                return false
            }
        }
        let highRoll: number = 0
        let winPlayer: number[] = []
        for (let i: number = 0; i < GameSettings.players.length; i++) {
            let p: Player = GameSettings.players[i]
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
            for (let i: number = 0; i < GameSettings.players.length; i++) {
                if (winPlayer.indexOf(i) > -1) {
                    GameSettings.players[i].Dice.startRoll()
                } else {
                    GameSettings.players[i].Dice.hide()
                }
            }
        } else {
            firstPlayer = winPlayer[0] + 1
            toReturn = true
        }
        return toReturn
    }

    export function moveDice(): void {
        for (let p of GameSettings.players) {
            if (p.Dice.AreRolling) {
                p.Dice.move()
            }
        }
    }

    export function setup(): void {
        GameSettings.gameMode = GameMode.NotReady
        scene.setBackgroundColor(Color.Wine)
        let header: TextSprite = textsprite.create('Determine first player',
            Color.Transparent, Color.Yellow)
        header.setPosition(80, 5)
        let footer: TextSprite = textsprite.create('Players: Press A to roll!',
            Color.Transparent, Color.White)
        footer.setPosition(80, 115)
        let deltaX: number = Math.floor(160 / GameSettings.numPlayers)
        let x: number = Math.floor(deltaX / 2)
        let y: number = 100
        for (let i: number = 0; i < GameSettings.numPlayers; i++) {
            let p: Player = GameSettings.players[i]
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
        GameSettings.gameMode = GameMode.FirstRoll
    }

    export function startRoll(player: number): void {
        if (player < 1 || player > GameSettings.players.length) {
            return
        }
        firstRollStarted[player - 1] = true
        GameSettings.players[player - 1].Dice.startRoll()
    }
}

namespace FirstRollTests {
    const PLAYER_NAMES: string[] = ['Robo', 'Xander', 'Lex', 'Solar',]
    const PLAYER_AVATARS: number[] = [0, 1, 2, 3]
    export function start(numPlayers: number): void {
        GameSettings.numPlayers = numPlayers
        GameSettings.initPlayers()
        for (let i: number = 0; i < numPlayers; i++) {
            GameSettings.players[i].Name = PLAYER_NAMES[i]
            GameSettings.players[i].Avatar = PLAYER_AVATARS[i]
        }
        FirstRoll.setup()
    }
}