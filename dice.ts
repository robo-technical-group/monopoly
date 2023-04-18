// Dice routines
namespace SpriteKind {
    export const Dice = SpriteKind.create()
}

enum DiceOrientation {
    None,
    Horizontal,
    Vertical,
}

enum DiceSkin {
    White = 0,
    Yellow = 1,
    Orange = 2,
}

const D6_IMAGES: Image[][] = [
    assets.animation`d6white`,
    assets.animation`d6yellow`,
    assets.animation`d6orange`,
]

class Dice {
    private static readonly MARGIN: number = 2
    private static readonly MOVES_TO_ROTATE: number = 3

    private areRolling: boolean
    private deltaX: number
    private deltaY: number
    private movesSinceLastRotate: number
    private orientation: DiceOrientation
    private skin: DiceSkin
    private sprites: Sprite[]
    private startX: number
    private startY: number
    private stopX: number
    private stopY: number
    private values: number[]

    constructor(count: number, orientation: DiceOrientation = DiceOrientation.None,
            startX: number = 5, startY: number = 5, stopX: number = 154, stopY: number = 5,
            vx: number = 5, vy: number = 0) {
        this.areRolling = false
        this.deltaX = vx
        this.deltaY = vy
        this.movesSinceLastRotate = 0
        this.skin = DiceSkin.White
        this.startX = startX
        this.startY = startY
        this.stopX = stopX
        this.stopY = stopY
        this.Count = Math.max(1, count)
        this.Orientation = orientation
    }

    /**
     * Public properties
     */

    public get AreDoubles(): boolean {
        if (this.values.length != 2) {
            return false
        }
        return this.values[0] == this.values[1]
    }

    public get AreRolling(): boolean {
        return this.areRolling
    }

    public get Count(): number {
        return this.values.length
    }

    public set Count(value: number) {
        this.sprites = []
        this.values = []
        for (let i: number = 0; i < value; i++) {
            let s: Sprite = sprites.create(img`.`, SpriteKind.Dice)
            s.setFlag(SpriteFlag.Invisible, true)
            this.sprites.push(s)
            this.values.push(1)
        }
        this.updateSprites()
    }

    public get Orientation(): DiceOrientation {
        return this.orientation
    }

    public set Orientation(value: DiceOrientation) {
        if (this.Count > 1 && value == DiceOrientation.None) {
            value = DiceOrientation.Horizontal
        }
        this.orientation = value
        this.resetSprites()
    }

    public get Roll(): number {
        let toReturn = 0
        for (let v of this.values) {
            toReturn += v
        }
        return toReturn
    }

    public get Skin(): DiceSkin {
        return this.skin
    }

    public set Skin(value: DiceSkin) {
        this.skin = value
    }

    public get Visible(): boolean {
        return (this.sprites[0].flags & SpriteFlag.Invisible) != SpriteFlag.Invisible
    }

    /**
     * Public methods
     */
    public hide(): void {
        for (let s of this.sprites) {
            s.setFlag(SpriteFlag.Invisible, true)
        }
    }

    public move(): void {
        let randomize: boolean = false
        let stop: boolean = false
        for (let i: number = 0; i < this.sprites.length; i++) {
            let s: Sprite = this.sprites[i]
            s.x += this.deltaX
            s.y += this.deltaY
            this.movesSinceLastRotate++
            if (this.movesSinceLastRotate >= Dice.MOVES_TO_ROTATE) {
                randomize = true
            }
            if ((
                    (this.deltaX >= 0 && s.x >= this.stopX) ||
                    (this.deltaX < 0 && s.x <= this.stopX)
                ) && (
                    (this.deltaY >= 0 && s.y >= this.stopY) ||
                    (this.deltaY < 0 && s.y <= this.stopY)
                )
            ) {
                stop = true
            }
        }

        if (randomize || stop) {
            this.randomize()
            if (stop) {
                this.areRolling = false
            }
        }
    }

    public setLocationChange(vx: number, vy: number) {
        this.areRolling = false
        this.deltaX = vx
        this.deltaY = vy
    }

    public setStartLocation(x: number, y: number) {
        this.areRolling = false
        this.startX = x
        this.startY = y
    }

    public setStopLocation(x: number, y: number) {
        this.areRolling = false
        this.stopX = x
        this.stopY = y
    }

    public show(): void {
        this.resetSprites()
        for (let s of this.sprites) {
            s.setFlag(SpriteFlag.Invisible, false)
        }
    }

    public startRoll(): void {
        this.resetSprites()
        this.show()
        this.areRolling = true
    }

    /**
     * Private methods
     */
    private randomize(): void {
        for (let i: number = 0; i < this.values.length; i++) {
            this.values[i] = randint(1, 6)
        }
        this.updateSprites()
    }

    private resetSprites(): void {
        let x: number = this.startX
        let y: number = this.startY
        for (let s of this.sprites) {
            s.setPosition(x, y)
            switch (this.orientation) {
                case DiceOrientation.Horizontal:
                    x += assets.animation`d6white`[0].width + Dice.MARGIN
                    break

                case DiceOrientation.Vertical:
                    y += assets.animation`d6white`[0].width + Dice.MARGIN
                    break
            }
        }
    }

    private updateSprites(): void {
        for (let i: number = 0; i < this.values.length; i++) {
            let s: Sprite = this.sprites[i]
            switch (this.skin) {
                case DiceSkin.White:
                    s.setImage(assets.animation`d6white`[this.values[i] - 1])
                    break

                case DiceSkin.Yellow:
                    s.setImage(assets.animation`d6yellow`[this.values[i] - 1])
                    break

                case DiceSkin.Orange:
                    s.setImage(assets.animation`d6orange`[this.values[i] - 1])
                    break

                default:
                    s.setImage(assets.animation`d6white`[this.values[i] - 1])
                    break
            }
        }
    }
}

/**
 * Dice test routines
 */
let g_diceTest: Dice = null
function startDiceTest() {
    g_gameMode = GameMode.NotReady
    g_diceTest = new Dice(2, DiceOrientation.Vertical)
    g_gameMode = GameMode.DiceTest
}