/**
 * Player information
 */
class IPlayer {
    avatar: number
    controllerId: number
    name: string
}

class Player {
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

    public set State(value: IPlayer) {
        this.Avatar = value.avatar
        this.controllerId = value.controllerId
        this.name = value.name
    }

    /**
     * Public methods
     */
    public hideSprite(): void {
        this.sprite.setFlag(SpriteFlag.Invisible, true)
    }

    public moveSprite(x: number, y: number): void {
        this.sprite.setPosition(x, y)
    }

    public promptForName(): void {
        if (this.controllerId >= 1 && this.controllerId <= 4) {
            this.name = game.askPlayerForString(this.controllerId,
                'Player ' + this.controllerId + ' enter name.')
        } else {
            this.name = game.askForString('Enter your name.')
        }
    }

    public showSprite(): void {
        this.sprite.setFlag(SpriteFlag.Invisible, false)
    }
}
