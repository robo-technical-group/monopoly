/**
 * Player information
 */
/*
interface Player {
    anim: Image[]
    bank: number
    currSpace: number
    image: Image
    isInJail: boolean
    location: number
    name: string
    spacesMoved: number
    sprite: Sprite
    statsSprite: Sprite
    turnsInJail: number
}
*/

class Player {
    private avatar: number
    private bank: number
    private currSpace: number
    private dice: Dice
    private isInJail: boolean
    private location: number
    private name: string
    private sprite: Sprite
    private statsSprite: Sprite
    private turnsInJail: number

    constructor() {
        this.avatar = -1
        this.bank = -1
        this.currSpace = -1
        this.dice = new Dice(2)
        this.isInJail = false
        this.location = -1
        this.name = ''
        this.sprite = null
        this.statsSprite = null
        this.turnsInJail = -1
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

    public get Bank(): number {
        return this.bank
    }

    public set Bank(value: number) {
        this.bank = value
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

    /**
     * Public methods
     */
    public hideSprite(): void {
        this.sprite.setFlag(SpriteFlag.Invisible, true)
    }

    public moveSprite(x: number, y: number): void {
        this.sprite.setPosition(x, y)
    }

    public showSprite(): void {
        this.sprite.setFlag(SpriteFlag.Invisible, false)
    }
}

/**
 * Functions
 */
function initPlayers() {
    g_players = []
    for (let i: number = 0; i < GameSettings.settings.numPlayers; i++) {
        g_players.push(new Player())
    }
}
