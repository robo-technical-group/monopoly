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
    avatar: number
    bank: number
    controllerId: number
    inJail: boolean
    jailTurns: number
    location: number
    name: string
    status: PlayerStatus
    turnCount: number
}

class Player {
    public static readonly ANIM_SPEED: number = 250
    public static readonly COLORS: number[] =
        [Color.Wine, Color.Red, Color.Blue, Color.Orange, Color.BrightGreen,]
    public static readonly STARTING_BANK: number = 1500
    public static readonly Z: number = 20
    public static readonly Z_CURRENT: number = 21

    private static readonly TEXT_PLAYER: string = 'Player'

    private avatar: number
    private bank: number
    private controllerId: number
    private destSpace: number
    private dice: Dice
    private doublesRolled: boolean
    private inJail: boolean
    private jailTurns: number
    private name: string
    private passedGo: boolean
    private sprite: Sprite
    private status: PlayerStatus
    private stats: Sprite
    private turnCount: number

    constructor(controllerId: number = 0) {
        this.avatar = -1
        this.bank = Player.STARTING_BANK
        this.destSpace = 0
        this.dice = new Dice(2)
        this.doublesRolled = false
        this.controllerId = controllerId
        this.name = ''
        this.sprite = null
        this.status = PlayerStatus.WaitingForTurn
        this.stats = null
        this.turnCount = 0
        this.passedGo = false
        this.inJail = false
        this.jailTurns = 0
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
            avatar: this.avatar,
            bank: this.bank,
            controllerId: this.controllerId,
            inJail: this.inJail,
            jailTurns: this.jailTurns,
            location: this.destSpace,
            name: this.name,
            status: this.status,
            turnCount: this.turnCount,
        }
    }

    public get Status(): PlayerStatus {
        return this.status
    }

    public set Status(value: PlayerStatus) {
        this.status = value
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

    /**
     * Public methods
     */
    public changeBank(delta: number): void {
        this.bank += delta
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
        this.destSpace = g_state.Board.Jail
        this.inJail = true
        this.jailTurns = 0
        this.doublesRolled = false
        this.status = PlayerStatus.WaitingForTurn
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
        if (GameSettings.CURRENCY_IS_PREFIX) {
            i.print(GameSettings.CURRENCY_SYMBOL, 0, 25, Color.BrightGreen, image.font5)
            i.print(this.bank.toString(), 6, 25, Color.White, image.font5)
        } else {
            i.print(this.bank.toString(), 0, 25, Color.White, image.font5)
            i.print(GameSettings.CURRENCY_SYMBOL, this.bank.toString().length * 6, 25, Color.BrightGreen, image.font5)
        }
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
            this.bank = Player.STARTING_BANK
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
        if (typeof state.status == 'number') {
            this.status = state.status
        }
        if (typeof state.inJail == 'boolean') {
            this.inJail = state.inJail
        } else if (typeof state.inJail == 'number') {
            this.inJail = (state.inJail != 0)
        }
        if (typeof state.jailTurns == 'number') {
            this.JailTurns = state.jailTurns
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
        this.dice.Orientation = DiceOrientation.Vertical
        this.dice.setStartLocation(Board.DICE_BEGIN_X, Board.DICE_BEGIN_Y)
        this.dice.setStopLocation(Board.DICE_END_X, Board.DICE_END_Y)
        this.dice.startRoll()
        this.status = PlayerStatus.Moving
    }

    public startTurn(): void {
        this.turnCount = 0
        this.doublesRolled = false
    }

    public stopAnimation(): void {
        animation.stopAnimation(animation.AnimationTypes.All, this.sprite)
        this.sprite.setImage(Avatar.AVATARS[this.avatar].frontImage)
    }

    /**
     * Protected methods
     */
    protected setDefaultName(): void {
        this.name = Player.TEXT_PLAYER + ' ' + this.controllerId
    }
}
