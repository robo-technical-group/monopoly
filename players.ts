/**
 * Player information
 */
/**
 * Interface that can be converted to/from JSON.
 */
interface IPlayer {
    avatar: number
    controllerId: number
    name: string
}

class Player {
    private static readonly TEXT_PLAYER: string = 'Player'
    private avatar: number
    private controllerId: number
    private dice: Dice
    private name: string
    private sprite: Sprite

    constructor(controllerId: number = 0) {
        this.avatar = -1
        this.dice = new Dice(2)
        this.controllerId = controllerId
        this.name = ''
        this.sprite = null
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
        } else {
            this.avatar = -1
        }
    }

    public get Dice(): Dice {
        return this.dice
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

    public get State(): IPlayer {
        return {
            avatar: this.avatar,
            controllerId: this.controllerId,
            name: this.name
        }
    }

    /**
     * Public methods
     */
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
        if (typeof state.controllerId == 'number') {
            this.controllerId = state.controllerId
        }
        if (typeof state.name == 'string') {
            this.name = state.name
        } else {
            this.setDefaultName()
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

    public showSprite(): void {
        this.sprite.setFlag(SpriteFlag.Invisible, false)
    }

    /**
     * Protected methods
     */
    protected setDefaultName(): void {
        this.name = Player.TEXT_PLAYER + ' ' + this.controllerId
    }
}
