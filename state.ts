/**
 * Current game state
 */
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

    /**
     * Public methods
     */
    public Load(filename: string): boolean {
        if (!settings.exists(filename)) {
            return false
        }
        let newState: GameState = settings.readJSON(filename)
        if (newState == null) {
            return false
        }
        return true
    }

    public Save(filename: string): void {
        settings.writeJSON(filename, this)
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