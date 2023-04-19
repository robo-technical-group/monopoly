/**
 * Current game state
 */
interface IGameState {
    gameMode: GameMode
    players: IPlayer[]
}

class GameState {
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

    public set State(value: IGameState) {
        this.gameMode = value.gameMode
        this.players = []
        for (let ps of value.players) {
            let p: Player = new Player()
            p.State = ps
        }
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