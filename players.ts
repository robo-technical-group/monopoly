/**
 * Player information
 */
namespace SpriteKind {
    export const BankBump = SpriteKind.create()
}

/**
 * Interface that can be converted to/from JSON.
 */
interface IPlayer {
    actions: number[]
    avatar: number
    bank: number
    bankrupt: boolean
    controllerId: number
    card: number[]
    inJail: boolean
    jailTurns: number
    location: number
    name: string
    skip: boolean
    turnCount: number
    waiting: boolean
}

class Player {
    public static readonly ANIM_SPEED: number = 250
    public static readonly COLORS: number[] =
        [Color.Wine, Color.Red, Color.Blue, Color.Orange, Color.BrightGreen,]
    public static readonly Z: number = 20
    public static readonly Z_CURRENT: number = 21

    protected static readonly TEXT_PLAYER: string = 'Player'

    protected actions: number[]
    protected avatar: number
    protected bank: number
    protected bankrupt: boolean
    protected card: number[]
    protected controllerId: number
    protected destSpace: number
    protected dice: Dice
    protected doublesRolled: boolean
    protected inJail: boolean
    protected jailTurns: number
    protected name: string
    protected passedGo: boolean
    protected speedDieValue: number
    protected skip: boolean
    protected sprite: Sprite
    protected stats: Sprite
    protected turnCount: number
    protected waiting: boolean

    constructor(controllerId: number = 0) {
        this.actions = []
        this.avatar = -1
        this.bank = -1
        this.bankrupt = false
        this.card = []
        this.controllerId = controllerId
        this.destSpace = 0
        this.dice = new Dice(2)
        this.doublesRolled = false
        this.inJail = false
        this.jailTurns = 0
        this.name = ''
        this.passedGo = false
        this.skip = false
        this.speedDieValue = 0
        this.sprite = null
        this.stats = null
        this.turnCount = 0
        this.waiting = true
    }

    /**
     * Public properties
     */
    public get Avatar(): number {
        return this.avatar
    }

    public set Avatar(value: number) {
        if (value >= 0 && value < Avatar.AVATARS.length) {
            this.avatar = value
            this.sprite = sprites.create(Avatar.AVATARS[value].frontImage, SpriteKind.Player)
            this.sprite.setFlag(SpriteFlag.Invisible, true)
            this.sprite.z = Player.Z
        } else {
            this.avatar = -1
        }
    }

    public get Bank(): number {
        return this.bank
    }

    public set Bank(value: number) {
        this.bank = value
        this.printBank()
    }

    public get Dice(): Dice {
        return this.dice
    }

    public get DoublesRolled(): boolean {
        return this.doublesRolled
    }

    public set DoublesRolled(value: boolean) {
        this.doublesRolled = value
    }

    public get Location(): number {
        return this.destSpace
    }

    public set Location(value: number) {
        if (value >= 0 && value < g_state.Board.BoardSpaces.length) {
            this.destSpace = value
        }
    }

    public get InJail(): boolean {
        return this.inJail
    }

    public set InJail(value: boolean) {
        this.inJail = value
    }

    public get JailTurns(): number {
        return this.jailTurns
    }

    public set JailTurns(value: number) {
        this.jailTurns = Math.max(0, value)
    }

    public get Name(): string {
        return this.name
    }

    public set Name(value: string) {
        this.name = value
    }

    public get PassedGo(): boolean {
        return this.passedGo
    }

    public set PassedGo(value: boolean) {
        this.passedGo = value
    }

    public get Sprite(): Sprite {
        return this.sprite
    }

    public get SpriteVisible(): boolean {
        return (this.sprite.flags & SpriteFlag.Invisible) != SpriteFlag.Invisible
    }

    public get State(): IPlayer {
        return {
            actions: this.actions,
            avatar: this.avatar,
            bank: this.bank,
            bankrupt: this.bankrupt,
            card: this.card,
            controllerId: this.controllerId,
            inJail: this.inJail,
            jailTurns: this.jailTurns,
            location: this.destSpace,
            name: this.name,
            skip: this.skip,
            turnCount: this.turnCount,
            waiting: this.waiting,
        }
    }

    public get TurnCount(): number {
        return this.turnCount
    }

    public set TurnCount(value: number) {
        this.turnCount = value
        switch (value) {
            case 3:
                this.Dice.Skin = DiceSkin.Orange
                break

            case 2:
                this.Dice.Skin = DiceSkin.Yellow
                break

            default:
                this.Dice.Skin = DiceSkin.White
                break
        }
    }

    public get Waiting(): boolean {
        return this.waiting
    }

    public set Waiting(value: boolean) {
        this.waiting = value
    }

    /**
     * Public methods
     */
    public changeBank(delta: number): void {
        this.bank += delta
        this.printBank()
        if (this.stats != null) {
            let text: string =
                (delta < 0 ? '' : '+') + delta.toString()
            let bump: TextSprite = textsprite.create(
                text,
                delta < 0 ? Color.Red : Color.Aqua,
                Color.White
            )
            bump.setMaxFontHeight(5)
            bump.setKind(SpriteKind.BankBump)
            bump.data['created'] = game.runtime()
            bump.setBorder(1, Color.White, 2)
            bump.top = this.stats.bottom + 1
            bump.left = this.stats.left
            bump.z = Player.Z - 1
        }
    }

    public changeLocation(delta: number): void {
        this.destSpace += delta
        if (this.destSpace < 0) {
            this.destSpace += g_state.Board.BoardSpaces.length
        }
        if (this.destSpace >= g_state.Board.BoardSpaces.length) {
            this.destSpace -= g_state.Board.BoardSpaces.length
        }
    }

    public drawStatus(group: number, property: number, color: number, mortgaged: boolean): void {
        let x: number = Math.min(group * 4, 36)
        let y: number = property * 4 + 6
        if (group == 10) {
            // Jail card indicators go in the last column beneath utilities.
            y += 4 * g_state.Properties.info[Properties.GROUP_UTIL].properties.length
        }
        let i: Image = this.stats.image
        if (mortgaged) {
            i.drawLine(x, y, x + 2, y, color)
            i.drawLine(x, y + 1, x + 2, y + 1, Properties.COLOR_MORTGAGED)
            i.drawLine(x, y + 2, x + 2, y + 2, Properties.COLOR_MORTGAGED)
        } else {
            i.drawRect(x, y, 3, 3, color)
            i.setPixel(x + 1, y + 1, color)
        }
    }

    public goToJail(): void {
        game.splashForPlayer(this.controllerId, Strings.PLAYER_TO_JAIL)
        this.destSpace = g_state.Board.Jail
        this.inJail = true
        this.jailTurns = 0
        this.doublesRolled = false
        this.finishTurn()
    }

    public hide(): void {
        let sprites: Sprite[] = [this.sprite, this.stats,]
        sprites.forEach((value: Sprite, index: number) => {
            if (value != null) {
                value.setFlag(SpriteFlag.Invisible, true)
            }
        })
        this.dice.hide()
    }

    public hideSprite(): void {
        if (this.sprite != null) {
            this.sprite.setFlag(SpriteFlag.Invisible, true)
        }
    }

    public hideStats(): void {
        if (this.stats != null) {
            this.stats.setFlag(SpriteFlag.Invisible, true)
        }
    }

    public initStats(): void {
        if (this.stats == null) {
            this.stats = sprites.create(image.create(40, 30), SpriteKind.Player)
        }
        let i: Image = this.stats.image
        i.fill(Color.Black)
        i.print(this.name, 0, 0, Color.Yellow, image.font5)
        this.printBank()
    }

    public loadState(state: any): boolean {
        if (typeof state != 'object') {
            return false
        }

        if (typeof state.avatar == 'number' &&
                state.avatar > 0 &&
                state.avatar < Avatar.AVATARS.length) {
            this.Avatar = state.avatar
        } else {
            return false
        }

        if (typeof state.bank == 'number') {
            this.bank = state.bank
        } else {
            this.bank = -1
        }

        if (typeof state.controllerId == 'number') {
            this.controllerId = state.controllerId
        }

        if (typeof state.location == 'number') {
            this.Location = state.location
        }

        if (typeof state.name == 'string') {
            this.name = state.name
        } else {
            this.setDefaultName()
        }

        if (typeof state.waiting == 'boolean') {
            this.waiting = state.waiting
        } else if (typeof state.waiting == 'number') {
            this.waiting = (state.waiting != 0)
        }

        if (typeof state.inJail == 'boolean') {
            this.inJail = state.inJail
        } else if (typeof state.inJail == 'number') {
            this.inJail = (state.inJail != 0)
        }

        if (typeof state.jailTurns == 'number') {
            this.JailTurns = state.jailTurns
        }

        if (typeof state.skip == 'boolean') {
            this.skip = state.skip
        } else if (typeof state.skip == 'number') {
            this.skip = (state.skip != 0)
        }

        if (typeof state.bankrupt == 'boolean') {
            this.bankrupt = state.bankrupt
        } else if (typeof state.bankrupt == 'number') {
            this.bankrupt = (state.bankrupt != 0)
        }

        this.card = []
        if (Array.isArray(state.card) &&
        (<number[]>state.card).length > 0 &&
        typeof state.card[0] == 'number') {
            for (let n of <number[]>state.card) {
                this.card.push(n)
            }
        }
        
        return true
    }

    public moveSprite(x: number, y: number): void {
        this.sprite.setPosition(x, y)
    }

    public promptForName(): void {
        let prompt: string = `Player ${this.controllerId} enter name.`
        let n: string | undefined = undefined
        if (GameSettings.controllers == ControllerSetting.Multiple &&
            this.controllerId >= 1 && this.controllerId <= 4) {
            n = game.askPlayerForString(this.controllerId, prompt)
        } else {
            n = game.askForString(prompt)
        }
        if (n == undefined) {
            this.setDefaultName()
        } else {
            this.name = n
        }
    }

    /**
     * Destroy resources that are not automatically released by the garbage collector.
     */
    public release(): void {
        this.sprite.destroy()
        this.Dice.release()
    }

    public showStats(left: number, top: number): void {
        if (this.stats != null) {
            this.stats.left = left
            this.stats.top = top
            this.stats.setFlag(SpriteFlag.Invisible, false)
        }
    }

    public showSprite(x: number = 999, y: number = 999): void {
        this.sprite.setFlag(SpriteFlag.Invisible, false)
        if (x < 999) {
            this.sprite.x = x
        }
        if (y < 999) {
            this.sprite.y = y
        }
    }

    public skipNextTurn(): void {
        this.skip = true
    }

    public startAnimation(direction: number): void {
        if (direction >= 0) {
            animation.runImageAnimation(this.sprite, Avatar.AVATARS[this.avatar].leftAnim,
                Player.ANIM_SPEED, true)
        } else {
            animation.runImageAnimation(this.sprite, Avatar.AVATARS[this.avatar].rightAnim,
                Player.ANIM_SPEED, true)
        }
    }

    public startRoll(): void {
        this.passedGo = false
        this.TurnCount++
        let d: Dice = this.dice
        d.Orientation = DiceOrientation.Vertical
        d.setStartLocation(Board.DICE_BEGIN_X, Board.DICE_BEGIN_Y)
        d.setStopLocation(Board.DICE_END_X, Board.DICE_END_Y)
        if (g_state.SpeedDie) {
            d.Count = 3
        } else {
            d.Count = 2
        }
        d.startRoll()
        this.waiting = false
        this.actions.push(PlayerActions.Rolling)
        this.actions.push(PlayerActions.MoveForRoll)
        if (g_state.SpeedDie) {
            this.actions.push(PlayerActions.ProcessSpeedDie)
        }
    }

    public stopAnimation(): void {
        animation.stopAnimation(animation.AnimationTypes.All, this.sprite)
        this.sprite.setImage(Avatar.AVATARS[this.avatar].frontImage)
    }

    public update(): void {
        if (this.waiting) {
            this.startTurn()
            return
        }

        if (this.actions.length == 0) {
            this.finishTurn()
            return
        }

        switch (this.actions[0]) {
            case PlayerActions.GoToJail:
                this.goToJail()
                break

            case PlayerActions.MoveForRoll:
                this.moveForRoll()
                break

            case PlayerActions.Moving:
                this.move()
                break

            case PlayerActions.NeedMoney:
                this.findMoney()
                break

            case PlayerActions.Rolling:
                this.moveDice()
                break

            case PlayerActions.PayMoney:
                this.processPayment()
                break
        }
    }

    /**
     * Protected methods
     */
    protected buyProperty(): void {
        let space: Space = g_state.Board.BoardSpaces[this.destSpace]
        let groupInfo: Properties.GroupInfo = g_state.Properties.info[space.values[0]]
        let groupState: Properties.GroupState = g_state.Properties.state[space.values[0]]
        let propertyInfo: Properties.Info = groupInfo.properties[space.values[1]]
        let propertyState: Properties.State = groupState.properties[space.values[1]]
        // Force purchase even if bank goes negative.
        // TODO: Auction property if bank is too low.
        game.splashForPlayer(this.controllerId,
            Strings.PLAYER_BUY_PROPERTY.replace('%PLAYERNAME%', this.name).replace(
            '%PROPERTY%', propertyInfo.name).replace('%VALUE%', propertyInfo.cost.toString()))
        this.changeBank(0 - propertyInfo.cost)
        propertyState.owner = this.controllerId
        let numOwned: number = groupState.properties.filter(
            (value: Properties.State, index: number) => value.owner == this.controllerId
        ).length
        if (numOwned == groupState.properties.length) {
            groupState.isMonopolyOwned = true
            groupState.canBuild = true
            groupState.owner = this.controllerId
        } else if (g_state.BoardIndex > 0 && numOwned == groupState.properties.length - 1) {
            groupState.isMonopolyOwned = false
            groupState.canBuild = true
            groupState.owner = this.controllerId
        } else {
            groupState.isMonopolyOwned = false
            groupState.canBuild = false
            groupState.owner = 0
        }
    }

    protected drawCard(deck: number): void {
        let card: Cards.Card = Cards.drawCard(deck)
        game.splashForPlayer(this.controllerId, Cards.deckName(deck), card.text)
        switch (card.action) {
            case Cards.Action.BankPays:
                this.changeBank(card.values[0])
                break

            case Cards.Action.CollectFromEachPlayer:

        }
    }

    protected findMoney(): void {
        // For now, let bank go negative
        let payee: number = this.actions[2]
        let owed: number = this.actions[3]
        this.changeBank(0 - owed)
        if (payee > 0) {
            g_state.getPlayer(payee).changeBank(owed)
        }
        for (let i: number = 0; i < 4; i++) {
            let _: number = this.actions.pop()
        }
        g_state.updatePlayerStatus()
    }

    protected finishTurn(): void {
        this.actions = []
        this.waiting = true
        g_state.nextPlayer()
    }

    protected move(): void {
        if (this.destSpace != g_state.Board.CurrSpace ||
                (g_state.Board.Direction >= 0 && g_state.Board.getXCoordinate(this.destSpace) < this.sprite.x) ||
                (g_state.Board.Direction < 0 && g_state.Board.getXCoordinate(this.destSpace) > this.sprite.x)) {
            g_state.Board.move()
            Background.move()
            updatePlayers()
        } else {
            this.stopAnimation()
            let _: number = this.actions.pop()
            if (this.actions.length == 0) {
                // No actions are left in the queue; not sure why we are moving.
                // Bail.
                this.finishTurn()
                return
            }
            let action: PlayerActions = this.actions[0]
            switch (action) {
                case PlayerActions.MoveForCard:
                case PlayerActions.MoveForRoll:
                    this.processSpace()
                    break
            }
            action = this.actions.pop()
        }
    }

    protected moveDice(): void {
        let d: Dice = this.dice
        if (d.AreRolling) {
            d.move()
            if (!d.AreRolling) {
                let _: number = this.actions.pop()
                if (g_state.SpeedDie && this.actions.length > 0 &&
                        this.actions[0] == PlayerActions.MoveForRoll) {
                    this.speedDieValue = d.SpeedDie
                }
            }
        }
    }

    protected moveForRoll(): void {
        let d: Dice = this.dice
        if (g_state.SpeedDie && d.AreTriples) {
            this.actions = [PlayerActions.MoveForTriples,]
            return
        }
        this.doublesRolled = d.AreDoubles
        if (this.doublesRolled && this.turnCount == 3) {
            this.actions = [PlayerActions.GoToJail,]
            return
        }
        this.changeLocation(d.Roll)
        this.startAnimation(g_state.Board.Direction)
        this.actions.insertAt(0, PlayerActions.Moving)
    }

    /**
     * Pay a player or the bank.
     * @param player PlayerID to pay (0 = bank)
     * @param amount Amount owed
     */
    protected payPlayer(player: number, amount: number): void {
        this.actions = [
            PlayerActions.PayMoney, player, amount,
        ].concat(this.actions)
    }

    protected payTax(tax: number) {
        let t: Tax = TAXES[tax]
        game.splashForPlayer(this.controllerId,
            Strings.PLAYER_PAY_TAX.replace('%PLAYERNAME%', this.name).replace(
            '%TAXNAME%', t.name).replace('%TAXAMOUNT%', t.value.toString()))
        this.actions = [
            PlayerActions.PayMoney, 0, TAXES[tax].value,
        ].concat(this.actions)
    }
    
    protected printBank(): void {
        if (this.stats == null) {
            return
        }
        let i: Image = this.stats.image
        i.fillRect(0, 25, i.width, 6, Color.Black)
        if (GameSettings.CURRENCY_IS_PREFIX) {
            i.print(GameSettings.CURRENCY_SYMBOL, 0, 25, Color.BrightGreen, image.font5)
            i.print(this.bank.toString(), 6, 25, Color.White, image.font5)
        } else {
            i.print(this.bank.toString(), 0, 25, Color.White, image.font5)
            i.print(GameSettings.CURRENCY_SYMBOL, this.bank.toString().length * 6, 25,
                Color.BrightGreen, image.font5)
        }
    }

    protected processPayment(): void {
        if (this.actions.length < 3) {
            // The queue does not contain the correct information.
            // Bail.
            this.finishTurn()
            return
        }

        let payee: number = this.actions[1]
        let owed: number = this.actions[2]
        if (this.bank >= owed) {
            this.changeBank(0 - owed)
            if (payee > 0) {
                g_state.getPlayer(payee).changeBank(owed)
            }
            for (let i: number = 0; i < 3; i++) {
                let _: number = this.actions.pop()
            }
            g_state.updatePlayerStatus()
        } else {
            this.actions.insertAt(0, PlayerActions.NeedMoney)
        }
    }

    protected processProperty(): void {
        let space: Space = g_state.Board.BoardSpaces[this.destSpace]
        let groupInfo: Properties.GroupInfo = g_state.Properties.info[space.values[0]]
        let groupState: Properties.GroupState = g_state.Properties.state[space.values[0]]
        let propertyInfo: Properties.Info = groupInfo.properties[space.values[1]]
        let propertyState: Properties.State = groupState.properties[space.values[1]]
        if (propertyState.owner <= 0) {
            if (g_state.testMode) {
                this.buyProperty()
            }
            return
        }
        if (propertyState.owner == this.controllerId) {
            game.splashForPlayer(this.controllerId, Strings.PLAYER_PROPERTY_OWNED)
            return
        }
        // Property is owned by another player.
        let owed: number = 0
        switch (groupInfo.propertyType) {
            case Properties.PropertyType.Transportation:
                let count: number = groupState.properties.filter((value: Properties.State, index: number) =>
                    value.owner == propertyState.owner).length
                owed = propertyInfo.rents[count - 1]
                if (this.actions[0] == PlayerActions.MoveForCard) {
                    // Player owes double.
                    owed *= 2
                }
                break

            case Properties.PropertyType.Utility:
                if (this.actions[0] == PlayerActions.MoveForCard) {
                    // Player needs to re-roll and owes ten times amount rolled.
                } else {
                    let count: number = groupState.properties.filter((value: Properties.State, index: number) =>
                        value.owner == propertyState.owner).length
                    owed = propertyInfo.rents[count - 1]
                }
                break

            default:
                if (g_state.BoardIndex == 0) {
                    if (groupState.isMonopolyOwned && propertyState.houses == 0) {
                        owed = propertyInfo.rents[0] * 2
                    } else {
                        owed = propertyInfo.rents[propertyState.houses]
                    }
                } else {
                    if (propertyState.houses == 0) {
                        if (groupState.isMonopolyOwned) {
                            owed = propertyInfo.rents[0] * 3
                        } else if (groupState.canBuild) {
                            owed = propertyInfo.rents[0] * 2
                        } else {
                            owed = propertyInfo.rents[0]
                        }
                    } else {
                        owed = propertyInfo.rents[propertyState.houses]
                    }
                }
        }
        let owner: Player = g_state.getPlayer(propertyState.owner)
        this.payPlayer(propertyState.owner, owed)
        game.splashForPlayer(this.controllerId,
            Strings.PLAYER_OWES_PLAYER.replace('%PLAYERNAME%', this.name).replace(
            '%OTHERPLAYER%', owner.name).replace('%AMOUNT%', owed.toString()))
    }

    protected processSpace(): void {
        let space: Space = g_state.Board.BoardSpaces[this.destSpace]
        switch (space.spaceType) {
            case SpaceType.Card:
                this.drawCard(space.values[0])
                break

            case SpaceType.Free:
                game.splashForPlayer(this.controllerId, Strings.BOARD_FREE_PARKING,
                    Strings.BOARD_FREE_SPACE)
                break
            
            case SpaceType.Go:
                game.splashForPlayer(this.controllerId, Strings.BOARD_GO,
                    Strings.BOARD_FREE_SPACE)
                break

            case SpaceType.GoToJail:
                this.actions = [PlayerActions.GoToJail,]
                break

            case SpaceType.Jail:
                game.splashForPlayer(this.controllerId, Strings.BOARD_JAIL,
                    Strings.BOARD_FREE_SPACE)
                break

            case SpaceType.Property:
                this.processProperty()
                break

            case SpaceType.Tax:
                this.payTax(space.values[0])
                break
        }
    }

    protected setDefaultName(): void {
        this.name = Player.TEXT_PLAYER + ' ' + this.controllerId
    }

    protected startTurn(): void {
        if (this.skip) {
            this.skip = false
            game.splashForPlayer(this.controllerId,
                Strings.PLAYER_SKIPPED.replace('%PLAYERNAME%', this.name))
            this.finishTurn()
            return
        }
        this.actions = []
        this.turnCount = 0
        this.doublesRolled = false
        g_state.hidePlayers()
        Background.show()
        g_state.Board.draw(this.destSpace)
        g_state.Board.Direction = 1
        g_state.updatePlayerStatus()
        if (g_state.testMode) {
            this.startRoll()
        }
    }
}
