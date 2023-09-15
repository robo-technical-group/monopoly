/**
 * Current game state
 */
/**
 * Interface that can be translated to/from JSON.
 */
interface IGameState {
    actionQueue: ActionItem[]
    auctionQueue: number[]
    board: number
    bus: boolean
    busTickets: number
    currPlayer: number
    depots: boolean
    gameMode: GameMode
    players: IPlayer[]
    properties: Properties.GroupState[]
    speedDie: boolean
}

class GameState {
    protected static readonly KEY_PREFIX: string = 'mpy_'
    protected static readonly MESSAGE_TOP: number = 32
    protected static readonly SAVE_TEXT: string = 'SAVE GAME'
    protected static readonly STARTING_BALANCES: number[] = [1500, 2500,]

    public testMode: boolean

    protected actionQueue: ActionQueue
    protected actionMenu: ActionMenu
    protected auctionQueue: number[]
    protected board: Board
    protected boardIndex: number
    protected bus: boolean
    protected currPlayer: number
    protected depots: boolean
    protected gameMode: GameMode
    protected monopolyStatus: Sprite
    protected movementSprite: Sprite
    protected players: Player[]
    protected properties: Properties.Properties
    protected speedDie: boolean

    constructor(numPlayers: number = 0, board: number = 0) {
        this.actionQueue = new ActionQueue()
        this.actionMenu = null
        this.auctionQueue = []
        this.board = new Board(board)
        this.boardIndex = board
        this.bus = false
        this.currPlayer = (numPlayers > 0 ? 1 : 0)
        this.depots = false
        this.gameMode = GameMode.NotReady
        this.initPlayers(numPlayers)
        this.monopolyStatus = null
        this.movementSprite = null
        this.players = []
        this.properties = {
            info: Properties.PROPERTIES[this.boardIndex],
            state: Properties.buildFromState(null, this.boardIndex),
        }
        this.speedDie = false
        this.testMode = false
    }

    /**
     * Public properties
     */
    public get ActionMenu(): ActionMenu {
        return this.actionMenu
    }

    public set ActionMenu(value: ActionMenu) {
        this.actionMenu = value
    }

    public get ActionQueueString(): string {
        return this.actionQueue.toString()
    }

    public get Board(): Board {
        return this.board
    }

    public get BoardIndex(): number {
        return this.boardIndex
    }

    public set BoardIndex(value: number) {
        if (value == 0 || value == 1) {
            if (value != this.boardIndex) {
                this.board = new Board(value)
                this.boardIndex = value
                this.properties = {
                    info: Properties.PROPERTIES[value],
                    state: Properties.buildFromState(null, value),
                }
            }
        }
    }

    public get Bus(): boolean {
        return this.bus
    }

    public set Bus(value: boolean) {
        this.bus = value
    }
    
    public get CurrPlayer(): number {
        return this.currPlayer
    }

    public set CurrPlayer(value: number) {
        if (value > 0 && value <= this.players.length) {
            this.currPlayer = value
        }
    }

    public get Depots(): boolean {
        return this.depots
    }

    public set Depots(value: boolean) {
        this.depots = value
    }

    public get Mode(): GameMode {
        return this.gameMode
    }

    public set Mode(value: GameMode) {
        this.gameMode = value
    }
    
    public get NumPlayers(): number {
        return this.players.length - 1
    }

    public set NumPlayers(value: number) {
        this.initPlayers(value)
    }

    public get Players(): Player[] {
        return this.players
    }

    public get Properties(): Properties.Properties {
        return this.properties
    }

    public get Spaces(): Space[] {
        return this.board.BoardSpaces
    }

    public get SpeedDie(): boolean {
        return this.speedDie
    }

    public set SpeedDie(value: boolean) {
        this.speedDie = value
    }

    public get State(): IGameState {
        let playerStates: IPlayer[] = []
        this.players.forEach((value: Player, index: number) =>
            playerStates.push(value.State))
        return {
            actionQueue: this.actionQueue.State,
            auctionQueue: this.auctionQueue,
            board: this.boardIndex,
            bus: this.bus,
            busTickets: Cards.getBusTicketsRemaining(),
            currPlayer: this.currPlayer,
            depots: this.depots,
            gameMode: this.gameMode,
            players: playerStates,
            properties: this.properties.state,
            speedDie: this.speedDie,
        }
    }

    /**
     * Public methods
     */
    public actionPayJailFee(): void {
        this.hideMenu()
        this.actionQueue.queuePayment(GameSettings.JAIL_FEE, this.currPlayer, 0)
        let p: Player = this.getCurrPlayer()
        p.InJail = false
        this.board.draw(p.Location)
        if (p.JailTurns < 3) {
            this.actionQueue.actionStartRoll()
        } else {
            p.Dice.show()
        }
    }

    public actionPropertyAuction(): void {
        game.splashForPlayer(this.currPlayer, 'Auctions have not yet been implemented.')
    }

    public actionPropertyPurchase(): void {
        let pId: number = this.currPlayer
        let p: Player = this.getCurrPlayer()
        let property: Properties.FullInfo = this.getPropertyInfo(p.Location)
        if (p.Bank >= property.info.cost) {
            this.hideMenu()
            this.actionQueue.queuePayment(property.info.cost, pId, 0)
            property.state.owner = pId
        }
    }
    
    public actionStartRoll(): void {
        this.hideMenu()
        this.actionQueue.actionStartRoll()
    }

    public actionStartRollInJail(): void {
        this.hideMenu()
        this.actionQueue.queueJailRoll()
    }

    public actionUseJailCard(): void {
        let p: Player = this.getCurrPlayer()
        let cards: Properties.State[] =
            this.Properties.state[Properties.GROUP_JAIL].properties.filter(
                (value: Properties.State, index: number) =>
                    value.owner == this.currPlayer
            )
        if (cards.length > 0) {
            this.hideMenu()
            cards[0].owner = 0
            p.InJail = false
            this.board.draw(p.Location)
            if (p.JailTurns < 3) {
                this.actionQueue.actionStartRoll()
            } else {
                p.Dice.show()
            }
        }
    }

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

    public static exists(filename: string): boolean {
        if (filename.indexOf(GameState.KEY_PREFIX) != 0) {
            filename = GameState.KEY_PREFIX + filename
        }
        return settings.exists(filename)
    }

    public getBoardSpace(location: number): Space {
        return this.board.getSpace(location)
    }

    public getCurrPlayer(): Player {
        return this.getPlayer(this.currPlayer)
    }

    /**
     * @param player Player to retrieve. First player = 1.
     */
    public getPlayer(player: number): Player {
        if (player > 0 && player <= this.players.length) {
            return this.players[player]
        } else {
            return null
        }
    }

    public getPropertyInfo(location: number): Properties.FullInfo {
        let space: Space = this.getBoardSpace(location)
        if (space.spaceType != SpaceType.Property) {
            return null
        }
        let groupIndex: number = space.values[0]
        let propIndex: number = space.values[1]
        let groupInfo: Properties.GroupInfo = this.properties.info[groupIndex]
        let groupState: Properties.GroupState = this.properties.state[groupIndex]
        let propInfo: Properties.Info = groupInfo.properties[propIndex]
        let propState: Properties.State = groupState.properties[propIndex]
        let toReturn: Properties.FullInfo = {
            groupInfo: groupInfo,
            groupState: groupState,
            info: propInfo,
            state: propState,
        }
        return toReturn
    }

    public handleButton(button: ControllerButton): void {
        if (this.actionQueue.peek().action == PlayerAction.WaitingForAction) {
            this.actionMenu.handleButton(button)
        }
    }

    public hideMovementMessage(): void {
        if (this.movementSprite != null) {
            this.movementSprite.setFlag(SpriteFlag.Invisible, true)
        }
    }

    public hidePlayers(): void {
        this.players.forEach((p: Player, index: number) => {
            p.hideSprite()
            p.Dice.hide()
        })
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

        if (typeof state.boardIndex == 'number' &&
        (state.boardIndex == 0 || state.boardIndex == 1)) {
            this.boardIndex = state.boardIndex
        } else {
            this.boardIndex = 0
        }
        this.board = new Board(this.boardIndex)

        if (typeof state.gameMode == 'number') {
            this.gameMode = state.gameMode
        } else {
            this.gameMode = GameMode.NotReady
        }

        if (Array.isArray(state.players)) {
            this.players = []
            let playerList = <object[]>state.players
            for (let playerState of playerList) {
                let p: Player = new Player()
                if (!p.loadState(playerState)) {
                    return false
                } else {
                    if (p.Bank == -1) {
                        p.Bank = GameState.STARTING_BALANCES[this.boardIndex]
                    }
                    this.players.push(p)
                }
            }
        } else {
            return false
        }

        if (typeof state.currPlayer == 'number' && state.currPlayer > 0 && state.currPlayer <= this.players.length) {
            this.currPlayer = state.currPlayer
        } else {
            this.currPlayer = 1
        }

        if (typeof state.speedDie == 'boolean') {
            this.speedDie = state.speedDie
        } else if (typeof state.speedDie == 'number') {
            this.speedDie = (state.speedDie != 0)
        } else {
            this.speedDie = false
        }

        if (typeof state.depots == 'boolean') {
            this.depots = state.depots
        } else if (typeof state.depots == 'number') {
            this.depots = (state.depots != 0)
        } else {
            this.depots = false
        }

        if (typeof state.bus == 'boolean') {
            this.bus = state.bus
        } else if (typeof state.bus == 'number') {
            this.bus = (state.bus != 0)
        } else {
            this.bus = false
        }
        
        if (Array.isArray(state.properties)) {
            this.properties = {
                info: Properties.PROPERTIES[this.boardIndex],
                state: Properties.buildFromState(state.properties, this.boardIndex),
            }
        }

        this.auctionQueue = []
        if (Array.isArray(state.auctionQueue) &&
        (<number[]>state.auctionQueue).length > 0 &&
        typeof state.auctionQueue[0] == 'number') {
            for (let n of <number[]>state.auctionQueue) {
                this.auctionQueue.push(n)
            }
        }

        if (Array.isArray(state.actionQueue)) {
            this.actionQueue.buildFromState(state.actionQueue)
        }

        return true
    }

    public nextPlayer(): void {
        this.currPlayer++
        if (this.currPlayer > this.players.length) {
            this.currPlayer = 1
        }
        // If, for some reason, actions still exist in the queue,
        // + then empty it.
        if (!this.actionQueue.IsEmpty) {
            this.actionQueue.purge()
        }
    }

    /**
     * Destroy resources that are not automatically released by the garbage collector.
     */
    public release(): void {
        this.players.forEach((value: Player, index: number) =>
            value.release())
    }

    public static remove(filename: string): void {
        if (filename.indexOf(GameState.KEY_PREFIX) != 0) {
            filename = GameState.KEY_PREFIX + filename
        }
        if (settings.exists(filename)) {
            settings.remove(filename)
        }
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

    public showMenu(menu: ActionMenuType): void {
        let priorMode: GameMode = this.gameMode
        this.gameMode = GameMode.NotReady
        Background.hide()
        let p: Player = this.getCurrPlayer()

        switch (menu) {
            case ActionMenuType.InJail:
                this.actionMenu = new InJailActionMenu()
                break

            case ActionMenuType.PurchaseProperty:
                this.actionMenu = new PurchaseActionMenu()
                break

            case ActionMenuType.StartTurn:
                this.actionMenu = new StartTurnActionMenu()
                break

            case ActionMenuType.Test:
                this.actionMenu = new TestActionMenu()
                break
        }

        if (this.actionMenu != null) {
            p.Dice.hide()
            this.actionMenu.show()
        }

        this.gameMode = priorMode
    }

    public showMovementMessage(message: string): void {
        if (this.movementSprite == null) {
            this.initMovementSprite()
        }
        let i: Image = this.movementSprite.image
        i.fill(this.getCurrPlayer().Color)
        i.printCenter(message, 1, 15, image.font5)
        this.movementSprite.setFlag(SpriteFlag.Invisible, false)
    }

    public start(): void {
        if (this.actionQueue.IsEmpty) {
            this.actionQueue.startTurn()
        }
        if (this.actionQueue.peek().action == PlayerAction.WaitingForAction) {
            // Assume that we're waiting for a player to start their turn.
            // TODO: Enhance appropriately.
            this.actionQueue.purge()
            this.actionQueue.startTurn()
        }
    }

    public update(): void {
        this.actionQueue.processNext()
    }

    public updatePlayerSprites(): void {
        for (let i: number = 1; i <= this.NumPlayers; i++) {
            let p: Player = this.getPlayer(i)
            let s: Sprite = p.Sprite
            let space: Space = this.board.BoardSpaces[this.board.CurrSpace]
            if (i == this.currPlayer) {
                if (this.board.SpacesMoved > 0 &&
                        this.board.CurrSpace == this.board.Go && !p.OnGo) {
                    p.processGo(this.board.Direction, space.values[0])
                }
                let spaces: number = p.Location - this.board.CurrSpace
                if (this.board.Direction < 0) {
                    spaces = 0 - spaces
                }
                if (spaces < 0) {
                    // Move wraps around the end of the board.
                    spaces += this.board.BoardSpaces.length
                }
                s.say(spaces == 0 ? '' : spaces)
            } else {
                if (this.board.Direction >= 0) {
                    s.x += this.board.Speed
                    if (s.left > 160) {
                        p.hideSprite()
                    }
                } else {
                    s.x -= this.board.Speed
                    if (s.right < 0) {
                        p.hideSprite()
                    }
                }
            }
        }
    }

    public updatePlayerStatus(): void {
        let x: number = 0
        let y: number = 0
        this.players.filter((value: Player, index: number) => index > 0)
            .forEach((value: Player, index: number) => {
                value.initStats(index == this.currPlayer)
                value.showStats(x, y)
                x += 40
        })
        this.properties.info.forEach((pgi: Properties.GroupInfo, pgIndex: number) => {
            pgi.properties.forEach((prop: Properties.Info, propIndex: number) => {
                this.players.forEach((p: Player, playerIndex: number) => {
                    let ps: Properties.State = this.properties.state[pgIndex].properties[propIndex]
                    if (ps.owner == playerIndex) {
                        p.drawStatus(pgIndex, propIndex, pgi.color, ps.isMortgaged)
                    } else {
                        p.drawStatus(pgIndex, propIndex, Properties.COLOR_UNOWNED, false)
                    }
                })
            })
        })
        if (g_state.Bus) {
            this.players.forEach((p: Player, playerIndex: number) => {
                let pgIndex: number = this.properties.info.length - 1
                let pgi: Properties.GroupInfo = this.properties.info[pgIndex]
                let propIndex: number = this.properties.info[pgIndex].properties.length
                if (p.BusTickets > 0) {
                    p.drawStatus(pgIndex, propIndex, pgi.color, false)
                } else {
                    p.drawStatus(pgIndex, propIndex, Properties.COLOR_UNOWNED, false)
                }
            })
        }
        if (this.testMode) {
            this.updateStatusSprite()
        }
    }

    /**
     * For testing only. Displays status of all monopolies.
     */
    public updateStatusSprite(): void {
        this.initStatusSprite()
        let i: Image = this.monopolyStatus.image
        this.properties.state.forEach((pgs: Properties.GroupState, pgsIndex: number) => {
            let pgi: Properties.GroupInfo = this.properties.info[pgsIndex]
            i.fillRect(pgsIndex * 4, 0, 3, 3, pgi.color)
            if (pgs.isMonopolyOwned) {
                i.fillRect(pgsIndex * 4, 4, 3, 3, Player.COLORS[pgs.owner])
            } else if (pgs.canBuild) {
                i.fillRect(pgsIndex * 4, 4, 3, 3, Player.COLORS[pgs.owner])
                i.setPixel(pgsIndex * 4 + 1, 5, Color.White)
            } else {
                i.fillRect(pgsIndex * 4, 4, 3, 3, Player.COLORS[pgs.owner])
            }
        })
    }

    /**
     * Protected methods
     */
    protected hideMenu(): void {
        Background.show()
        let _: ActionItem = this.actionQueue.peek()
        if (_.action == PlayerAction.WaitingForAction) {
            while (this.actionQueue.Length > 0 && _.action == PlayerAction.WaitingForAction) {
                _ = this.actionQueue.pop()
                if (this.actionQueue.Length > 0) {
                    _ = this.actionQueue.peek()
                }
            }
            this.actionMenu.hide()
            this.actionMenu = null
        }
    }

    protected initMovementSprite(): void {
        let i: Image = image.create(160, 7)
        this.movementSprite = sprites.create(i, SpriteKind.PlayerMessage)
        this.movementSprite.top = GameState.MESSAGE_TOP
        this.movementSprite.z = Player.Z - 1
    }

    protected initPlayers(numPlayers: number): void {
        this.players = []
        for (let i: number = 0; i <= numPlayers; i++) {
            let p: Player = new Player(i)
            if (i > 0 && (this.speedDie || this.boardIndex > 0)) {
                p.Bank = GameState.STARTING_BALANCES[1]
            } else {
                p.Bank = GameState.STARTING_BALANCES[0]
            }
            this.players.push(p)
        }
    }

    protected initStatusSprite(): void {
        if (this.monopolyStatus == null) {
            this.monopolyStatus = sprites.create(image.create(44, 8), SpriteKind.Player)
        }
        this.monopolyStatus.left = 0
        this.monopolyStatus.bottom = 80
        this.monopolyStatus.z = Player.Z
        let i: Image = this.monopolyStatus.image
        i.fill(Color.Black)
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
                    GameState.remove(selection)
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
    export function getTestState(): object {
        return {
            players: [
                {
                    name: 'Robo',
                    controllerId: 1,
                    avatar: 10,
                }, {
                    name: 'Xander',
                    controllerId: 2,
                    avatar: 7,
                }, {
                    name: 'Lex',
                    controllerId: 3,
                    avatar: 3,
                }, {
                    name: 'Solar',
                    controllerId: 4,
                    avatar: 2,
                },
            ],
        }
    }

    export function loadTestState(): void {
        g_state.loadState(getTestState())
    }
    
    export function start(): void {
        /*
        let n: number = 0
        game.splash('n is a ' + typeof n)
        let a: number[] = [2, 6, 19]
        game.splash('a is a ' + typeof a)
        let gm: GameMode = GameMode.Attract
        game.splash('gm is a ' + typeof gm)
        */
        // Try to initialize game state with an incomplete object.
        // let s: object = getTestState()
        /*
        game.splash('s.gameMode is a ' + typeof s.gameMode)
        // Will this throw an error?
        game.splash('s.gameMode is ' + s.gameMode)
        game.splash('s.players is a ' + typeof s.players)
        */
        // g_state.loadState(s)
        // game.showLongText(g_state.State, DialogLayout.Full)
        // game.splash(g_state.NumPlayers)
        loadTestState()
        FirstRoll.setup()
        g_state.Mode = GameMode.FirstRoll
    }
}