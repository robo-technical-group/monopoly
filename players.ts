/**
 * Player information
 */
/**
 * Interface that can be converted to/from JSON.
 */
interface IPlayer {
    avatar: number
    bank: number
    controllerId: number
    location: number
    name: string
    status: PlayerStatus
}

class Player {
    public static readonly ANIM_SPEED: number = 250
    public static readonly STARTING_BANK: number = 1500
    public static readonly Z: number = 20
    public static readonly Z_CURRENT: number = 21

    private static readonly TEXT_PLAYER: string = 'Player'

    private avatar: number
    private bank: number
    private controllerId: number
    private destSpace: number
    private dice: Dice
    private name: string
    private sprite: Sprite
    private status: PlayerStatus

    constructor(controllerId: number = 0) {
        this.avatar = -1
        this.bank = Player.STARTING_BANK
        this.destSpace = 0
        this.dice = new Dice(2)
        this.controllerId = controllerId
        this.name = ''
        this.sprite = null
        this.status = PlayerStatus.WaitingForTurn
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

    public get Location(): number {
        return this.destSpace
    }

    public set Location(value: number) {
        if (value >=0 && value < Board.BOARD.length) {
            this.destSpace = value
        }
    }

    public get Name(): string {
        return this.name
    }

    public set Name(value: string) {
        this.name = value
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
            location: this.destSpace,
            name: this.name,
            status: this.status
        }
    }

    public get Status(): PlayerStatus {
        return this.status
    }

    public set Status(value: PlayerStatus) {
        this.status = value
    }

    /**
     * Public methods
     */
    public changeBank(delta: number): void {
        this.bank += delta
    }

    public changeLocation(delta: number): void {
        this.destSpace += delta
        if (this.destSpace < 0) {
            this.destSpace += Board.BOARD.length
        }
        if (this.destSpace >= Board.BOARD.length) {
            this.destSpace -= Board.BOARD.length
        }
    }

    public hideSprite(): void {
        this.sprite.setFlag(SpriteFlag.Invisible, true)
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

    public showSprite(): void {
        this.sprite.setFlag(SpriteFlag.Invisible, false)
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
