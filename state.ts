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
        this.players.forEach((value: Player, index: number) =>
            playerStates.push(value.State))
        return {
            gameMode: this.gameMode,
            players: playerStates,
        }
    }

    /**
     * Public methods
     */
    public static addSystemMenuItem(text: string, icon: Image, handler: () => void): void {
        if (infoScreens.addMenuOption != undefined) {
            game.splash('Info Screens plugin is missing.')
            return
        }
        infoScreens.addMenuOption(text, icon, handler)
    }

    public static addSaveGameMenuItem(handler: () => void): void {
        GameState.addSystemMenuItem(GameState.SAVE_TEXT, assets.image`saveIcon`, handler)
    }

    public static delete(filename: string): void {
        if (filename.indexOf(GameState.KEY_PREFIX) != 0) {
            filename = GameState.KEY_PREFIX + filename
        }
        if (settings.exists(filename)) {
            settings.remove(filename)
        }
    }

    public static exists(filename: string): boolean {
        if (filename.indexOf(GameState.KEY_PREFIX) != 0) {
            filename = GameState.KEY_PREFIX + filename
        }
        return settings.exists(filename)
    }

    /**
     * @param player Player to retrieve. First player = 1.
     */
    public getPlayer(player: number): Player {
        return this.players[player - 1]
    }

    public static list(): string[] {
        return settings.list(GameState.KEY_PREFIX).map((value: string, index: number) =>
            value.slice(GameState.KEY_PREFIX.length)
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

    /**
     * Destroy resources that are not automatically released by the garbage collector.
     */
    public release(): void {
        this.players.forEach((value: Player, index: number) =>
            value.release())
    }

    public static rename(oldname: string, newname: string): boolean {
        if (oldname.indexOf(GameState.KEY_PREFIX) != 0) {
            oldname = GameState.KEY_PREFIX + oldname
        }
        if (newname.indexOf(GameState.KEY_PREFIX) != 0) {
            newname = GameState.KEY_PREFIX + newname
        }
        if (!settings.exists(oldname) || settings.exists(newname)) {
            return false
        }
        settings.writeJSON(newname, settings.readJSON(oldname))
        settings.remove(oldname)
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
    enum ManageActions {
        Rename,
        Delete,
    }

    const DELETE_CONFIRM: string = 'Delete saved game?'
    const DELETED_FILE: string = '--Deleted--'
    const FILENAME_PROMPT: string = 'Enter filename.'
    const GAME_SAVE_CONFIRM: string = 'Game saved!'
    const GAME_SAVE_CANCEL: string = 'Game save cancelled.'
    const CONTROLLER_TITLE: string = 'Set controller mode.'
    const LOAD_ERROR: string = 'Error loading file'
    const LOAD_TITLE: string = 'Select game to load.'
    const MANAGE_MENU_TITLE: string = 'A=Rename B=Delete'
    const RENAME_EXISTS: string = 'New name already exists.'
    const RENAME_PROMPT: string = 'Enter new name.'
    const TEXT_CLOSE: string = '--Close menu--'
    const Z: number = 255

    let controllerMenu: miniMenu.MenuSprite = null
    let isManageVisible: boolean = false
    let fileMenu: miniMenu.MenuSprite = null
    let fileToLoad: string = ''
    let manageMenu: miniMenu.MenuSprite = null

    function controllerSelected(selection: string, selectedIndex: number): void {
        controllerMenu.close()
        if (selectedIndex == GameSettings.TEXT_SETTINGS_MULTIPLAYER[0].length) {
            // User chose to close the menu.
            g_state.Mode = GameMode.Attract
            return
        }
        let newGame: GameState = GameState.loadFromSetting(fileToLoad)
        if (newGame == null) {
            newGame.release()
            game.splash(LOAD_ERROR + ' ' + selection)
            g_state.Mode = GameMode.Attract
        } else {
            Attract.splashScreen.release()
            GameSettings.controllers = selectedIndex
            let oldState: GameState = g_state
            g_state = newGame
            oldState.release()
            switch (newGame.Mode) {
                case GameMode.FirstRoll:
                    FirstRoll.setup()
                    break

                case GameMode.Main:
                default:
                    // For now, just start a new game.
                    startGame()
                    break
            }
        }
    }

    export function load(): void {
        g_state.Mode = GameMode.NotReady
        let menuItems: miniMenu.MenuItem[] = []
        if (menuItems.length > 10) {
            menuItems.push(miniMenu.createMenuItem(TEXT_CLOSE))
        }
        GameState.list().forEach((value: string, index: number) =>
            menuItems.push(miniMenu.createMenuItem(value)))
        menuItems.push(miniMenu.createMenuItem(TEXT_CLOSE))
        fileMenu = miniMenu.createMenuFromArray(menuItems)
        fileMenu.setTitle(LOAD_TITLE)
        setCommonSettings(fileMenu)
        fileMenu.onButtonPressed(controller.A, loadFileSelected)
        g_state.Mode = GameMode.PauseMenu
    }

    function loadFileSelected(selection: string, selectedIndex: number): void {
        if (selectedIndex >= GameState.list().length ||
                selection == TEXT_CLOSE) {
            // User selected to close menu without selecting a file.
            fileMenu.close()
            g_state.Mode = GameMode.Attract
            return
        }
        let newGame: GameState = GameState.loadFromSetting(selection)
        if (newGame == null) {
            game.splash(LOAD_ERROR + ' ' + selection)
        } else {
            newGame.release()
            fileToLoad = selection
            fileMenu.close()
            let menuItems: miniMenu.MenuItem[] = []
            GameSettings.TEXT_SETTINGS_MULTIPLAYER[0].forEach(
                (value: string, index: number) =>
                    menuItems.push(miniMenu.createMenuItem(value))
            )
            menuItems.push(miniMenu.createMenuItem(TEXT_CLOSE))
            controllerMenu = miniMenu.createMenuFromArray(menuItems)
            controllerMenu.setTitle(CONTROLLER_TITLE)
            setCommonSettings(controllerMenu)
            controllerMenu.onButtonPressed(controller.A, controllerSelected)
        }
    }

    export function manage(): void {
        if (isManageVisible) {
            return
        }
        if (PauseMenu.menuVisible()) {
            PauseMenu.hide()
        }
        let menuItems: miniMenu.MenuItem[] = []
        GameState.list().forEach((value: string, index: number) =>
            menuItems.push(miniMenu.createMenuItem(value)))
        menuItems.push(miniMenu.createMenuItem(TEXT_CLOSE))
        manageMenu = miniMenu.createMenuFromArray(menuItems)
        manageMenu.setTitle(MANAGE_MENU_TITLE)
        setCommonSettings(manageMenu)
        manageMenu.onButtonPressed(controller.A, manageMenuSelectedA)
        manageMenu.onButtonPressed(controller.B, manageMenuSelectedB)
        isManageVisible = true
    }

    function manageMenuSelected(selection: string, selectedIndex: number, action: ManageActions): void {
        if (selection == TEXT_CLOSE) {
            manageMenu.close()
            if (PauseMenu.menuRunning()) {
                PauseMenu.show()
            }
            isManageVisible = false
            return
        }
        manageMenu.buttonEventsEnabled = false
        switch (action) {
            case ManageActions.Delete:
                if (game.ask(DELETE_CONFIRM, selection)) {
                    GameState.delete(selection)
                    manageMenu.items[selectedIndex].text = DELETED_FILE
                }
                break

            case ManageActions.Rename:
                let n: string | undefined = game.askForString(selection +
                    ' ' + RENAME_PROMPT)
                if (n == undefined) {
                    break
                }
                if (GameState.rename(selection, n)) {
                    manageMenu.items[selectedIndex].text = n
                } else {
                    game.splash(RENAME_EXISTS)
                }
                break
        }
        manageMenu.buttonEventsEnabled = true
    }

    function manageMenuSelectedA(selection: string, selectedIndex: number) {
        manageMenuSelected(selection, selectedIndex, ManageActions.Rename)
    }

    function manageMenuSelectedB(selection: string, selectedIndex: number) {
        manageMenuSelected(selection, selectedIndex, ManageActions.Delete)
    }

    export function save(gameModeToSave: GameMode): void {
        let filename: string | undefined = game.askForString(FILENAME_PROMPT)
        if (filename == undefined) {
            game.splash(GAME_SAVE_CANCEL)
            return
        }
        let currMode: GameMode = g_state.Mode
        g_state.Mode = gameModeToSave
        g_state.save(filename)
        g_state.Mode = currMode
        game.splash(GAME_SAVE_CONFIRM)
    }

    function setCommonSettings(m: miniMenu.MenuSprite) {
        m.setMenuStyleProperty(miniMenu.MenuStyleProperty.Width, 140)
        m.setMenuStyleProperty(miniMenu.MenuStyleProperty.Height, 100)
        m.setStyleProperty(miniMenu.StyleKind.Title,
            miniMenu.StyleProperty.Foreground, Color.White)
        m.setStyleProperty(miniMenu.StyleKind.Title,
            miniMenu.StyleProperty.Background, Color.Wine)
        m.top = 10
        m.left = 10
        m.z = Z
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