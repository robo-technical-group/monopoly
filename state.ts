/**
 * Current game state
 */
/**
 * Interface that can be translated to/from JSON.
 */
interface IGameState {
    gameMode: GameMode
    players: IPlayer[]
}

class GameState {
    private static readonly KEY_PREFIX: string = 'mpy_'

    private gameMode: GameMode
    private players: Player[]

    constructor(numPlayers: number = 0) {
        this.gameMode = GameMode.NotReady
        this.initPlayers(numPlayers)
    }

    /**
     * Public properties
     */
    public get Mode(): GameMode {
        return this.gameMode
    }

    public set Mode(value: GameMode) {
        this.gameMode = value
    }
    
    public get NumPlayers(): number {
        return this.players.length
    }

    public set NumPlayers(value: number) {
        this.initPlayers(value)
    }

    public get Players(): Player[] {
        return this.players
    }

    public get State(): IGameState {
        let playerStates: IPlayer[] = []
        for (let p of this.players) {
            playerStates.push(p.State)
        }
        return {
            gameMode: this.gameMode,
            players: playerStates,
        }
    }

    /**
     * Public methods
     */
    public loadFromSetting(key: string): boolean {
        if (settings.exists(key)) {
            return this.loadState(settings.readJSON(key))
        } else {
            return false
        }
    }
    
    public loadState(state: any): boolean {
        if (typeof state != 'object') {
            return false
        }
        if (typeof state.gameMode == 'number') {
            this.gameMode = state.gameMode
        } else {
            this.gameMode = GameMode.NotReady
        }
        if (typeof state.players == 'object') {
            this.players = []
            let playerList = <object[]>state.players
            for (let playerState of playerList) {
                let p: Player = new Player()
                if (!p.loadState(playerState)) {
                    return false
                } else {
                    this.players.push(p)
                }
            }
        } else {
            return false
        }
        return true
    }

    public static savesExist(): boolean {
        return settings.list(GameState.KEY_PREFIX).length > 0
    }

    /**
     * Private methods
     */
    private initPlayers(numPlayers: number): void {
        this.players = []
        for (let i: number = 0; i < numPlayers; i++) {
            this.players.push(new Player(i + 1))
        }
    }
}

namespace GameStateTests {
    export function start() {
        /*
        let n: number = 0
        game.splash('n is a ' + typeof n)
        let a: number[] = [2, 6, 19]
        game.splash('a is a ' + typeof a)
        let gm: GameMode = GameMode.Attract
        game.splash('gm is a ' + typeof gm)
        */
        // Try to initialize game state with an incomplete object.
        let s: any = {
            players: [
                {
                    name: 'Robo',
                    controllerId: 1,
                    avatar: 9,
                }, {
                    name: 'Xander',
                    controllerId: 2,
                    avatar: 6,
                }, {
                    name: 'Lex',
                    controllerId: 3,
                    avatar: 2,
                }, {
                    name: 'Solar',
                    controllerId: 4,
                    avatar: 1,
                },
            ],
        }
        /*
        game.splash('s.gameMode is a ' + typeof s.gameMode)
        // Will this throw an error?
        game.splash('s.gameMode is ' + s.gameMode)
        game.splash('s.players is a ' + typeof s.players)
        */
        g_state.loadState(s)
        // game.showLongText(g_state.State, DialogLayout.Full)
        // game.splash(g_state.NumPlayers)
        FirstRoll.setup()
        g_state.Mode = GameMode.FirstRoll
    }
}