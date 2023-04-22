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
    private static readonly SAVE_TEXT: string = 'SAVE GAME'

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
    public static addSystemMenuItem(handler: () => void): void {
        if (infoScreens.addMenuOption != undefined) {
            infoScreens.addMenuOption(GameState.SAVE_TEXT,assets.image`saveIcon`, handler)
        }
    }

    /**
     * @param player Player to retrieve. First player = 1.
     */
    public getPlayer(player: number): Player {
        return this.players[player - 1]
    }

    public static list(): string[] {
        return settings.list(GameState.KEY_PREFIX).map((value: string, index: number) =>
            value.slice(GameState.KEY_PREFIX.length - 1)
        )
    }

    public static loadFromSetting(key: string): GameState {
        if (key.indexOf(GameState.KEY_PREFIX) != 0) {
            key = GameState.KEY_PREFIX + key
        }
        if (settings.exists(key)) {
            let toReturn: GameState = new GameState()
            if (toReturn.loadState(settings.readJSON(key))) {
                return toReturn
            } else {
                return null
            }
        } else {
            return null
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

    public save(filename: string): void {
        if (filename.indexOf(GameState.KEY_PREFIX) == -1) {
            filename = GameState.KEY_PREFIX + filename
        }
        settings.writeJSON(filename, this.State)
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

namespace GameStateUI {
    const FILENAME_PROMPT: string = 'Enter filename.'
    const GAME_SAVE_CONFIRM: string = 'Game saved!'
    const GAME_SAVE_CANCEL: string = 'Game save cancelled.'
    const MANAGE_MENU_TITLE: string = 'A=Rename B=Delete'
    const TEXT_CLOSE: string = '--Close menu--'

    let isManageVisible: boolean = false
    let manageMenu: miniMenu.MenuSprite = null

    export function manage(): void {
        if (isManageVisible) {
            return
        }
        if (PauseMenu.menuVisible()) {
            PauseMenu.hide()
        }
        let menuItems: miniMenu.MenuItem[] = []
        for (let f of GameState.list()) {
            menuItems.push(miniMenu.createMenuItem(f))
        }
        menuItems.push(miniMenu.createMenuItem(TEXT_CLOSE))
        manageMenu = miniMenu.createMenuFromArray(menuItems)
        manageMenu.setTitle(MANAGE_MENU_TITLE)
        manageMenu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Width, 140)
        manageMenu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Height, 100)
        manageMenu.setStyleProperty(miniMenu.StyleKind.Title,
            miniMenu.StyleProperty.Foreground, Color.White)
        manageMenu.setStyleProperty(miniMenu.StyleKind.Title,
            miniMenu.StyleProperty.Background, Color.Wine)
        manageMenu.top = 10
        manageMenu.left = 10
        manageMenu.onButtonPressed(controller.A, processSelection)
        manageMenu.onButtonPressed(controller.B, processSelection)
        isManageVisible = true
        /*
        if (isMenuVisible) {
            return
        }
        previousMode = g_state.Mode
        g_state.Mode = GameMode.PauseMenu
        let menuItems: miniMenu.MenuItem[] = []
        for (let t of MENU_TEXT) {
            menuItems.push(miniMenu.createMenuItem(t))
        }
        pauseMenu = miniMenu.createMenuFromArray(menuItems)
        pauseMenu.setTitle(MENU_TITLE)
        pauseMenu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Width, 140)
        pauseMenu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Height, 100)
        pauseMenu.setStyleProperty(miniMenu.StyleKind.Title,
            miniMenu.StyleProperty.Foreground, Color.White)
        pauseMenu.setStyleProperty(miniMenu.StyleKind.Title,
            miniMenu.StyleProperty.Background, Color.Wine)
        pauseMenu.top = 10
        pauseMenu.left = 10
        isShowingConsole = game.consoleOverlay.isVisible()
        isShowingStats = game.stats
        updateBrightness()
        updateConsole()
        updateStats()
        updateVolume()
        pauseMenu.onButtonPressed(controller.A, processSelection)
        pauseMenu.onButtonPressed(controller.B, processSelection)
        isMenuVisible = true
        */
    }

    function processSelection(selection: string, selectedIndex: number): void {
        if (selection == TEXT_CLOSE) {
            manageMenu.close()
            if (PauseMenu.menuRunning()) {
                PauseMenu.show()
            }
            isManageVisible = false
            return
        }
    }

    export function save(): void {
        let filename: string = game.askForString(FILENAME_PROMPT)
        if (filename.length > 0) {
            g_state.save(filename)
            game.splash(GAME_SAVE_CONFIRM)
        } else {
            game.splash(GAME_SAVE_CANCEL)
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