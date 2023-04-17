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
    private isInJail: boolean
    private location: number
    private name: string
    private statsSprite: Sprite
    private turnsInJail: number

    constructor() {
        this.avatar = -1
        this.bank = -1
        this.currSpace = -1
        this.isInJail = false
        this.location = -1
        this.name = ''
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
        if (value >= 0 && value < AVATARS.length) {
            this.avatar = value
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

    public get Name(): string {
        return this.name
    }

    public set Name(value: string) {
        this.name = value
    }
}

/**
 * Functions
 */
function initPlayers() {
    g_players = []
    for (let i: number = 0; i < g_settings.numPlayers; i++) {
        g_players.push(new Player())
    }
}
