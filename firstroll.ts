namespace FirstRoll {
    /**
     * Global variables
     */
    let g_firstRollStarted: boolean[] = []

    /**
     * Functions
     */
    /**
     * Returns true when first player has been determined.
     */
    export function findFirstPlayer(): boolean {
        let toReturn: boolean = false
        for (let frs of g_firstRollStarted) {
            if (!frs) {
                return false
            }
        }
        for (let p of g_players) {
            if (p.Dice.AreRolling) {
                return false
            }
        }
        let highRoll: number = 0
        let winPlayer: number[] = []
        for (let i: number = 0; i < g_players.length; i++) {
            let p: Player = g_players[i]
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
            for (let i: number = 0; i < g_players.length; i++) {
                if (winPlayer.indexOf(i) > -1) {
                    g_players[i].Dice.startRoll()
                } else {
                    g_players[i].Dice.hide()
                }
            }
        } else {
            game.splash('Player ' + winPlayer[0] + ' goes first!')
            toReturn = true
        }
        return toReturn
    }

    export function moveDice(): void {
        for (let p of g_players) {
            if (p.Dice.AreRolling) {
                p.Dice.move()
            }
        }
    }

    export function setup(): void {
        g_gameMode = GameMode.NotReady
        scene.setBackgroundColor(Color.Wine)
        let header: TextSprite = textsprite.create('Determine first player',
            Color.Transparent, Color.Yellow)
        header.setPosition(80, 5)
        let footer: TextSprite = textsprite.create('Players: Press A to roll!',
            Color.Transparent, Color.White)
        footer.setPosition(80, 115)
        let x: number = 20
        let y: number = 100
        for (let i: number = 0; i < g_settings.numPlayers; i++) {
            let p: Player = g_players[i]
            p.moveSprite(x, y)
            p.showSprite()
            p.Dice.Orientation = DiceOrientation.Horizontal
            p.Dice.setStartLocation(x - 7, y - 20)
            p.Dice.setStopLocation(x - 7, 16)
            p.Dice.setLocationChange(0, -5)
            p.Dice.show()
            x += 37
            g_firstRollStarted.push(false)
        }
        g_gameMode = GameMode.FirstRoll
    }

    export function startRoll(player: number): void {
        if (player < 1 || player > g_players.length) {
            return
        }
        g_firstRollStarted[player - 1] = true
        g_players[player - 1].Dice.startRoll()
    }
}
