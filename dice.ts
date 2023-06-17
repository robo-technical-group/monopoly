/**
 * Dice routines
 */
namespace SpriteKind {
    export const Dice = SpriteKind.create()
}

const D6_IMAGES: Image[][] = [
    assets.animation`d6white`,
    assets.animation`d6yellow`,
    assets.animation`d6orange`,
]

class Dice {
    protected static readonly MARGIN: number = 2
    protected static readonly MOVES_TO_ROTATE: number = 3
    protected static readonly Z: number = 20

    protected areRolling: boolean
    protected deltaX: number
    protected deltaY: number
    protected movesSinceLastRotate: number
    protected orientation: DiceOrientation
    protected skin: DiceSkin
    protected sprites: Sprite[]
    protected startX: number
    protected startY: number
    protected stopX: number
    protected stopY: number
    protected values: number[]

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
        if (this.values.length < 2) {
            return false
        }
        return this.values[0] == this.values[1]
    }

    public get AreRolling(): boolean {
        return this.areRolling
    }

    public get AreTriples(): boolean {
        if (this.values.length < 3) {
            return false
        }
        return this.values[0] == this.values[1] &&
            this.values[1] == this.values[2] &&
            this.values[0] <= 3
    }

    public get Count(): number {
        return this.values.length
    }

    public set Count(value: number) {
        if (this.sprites == null || typeof this.sprites != 'object') {
            this.sprites = []
        }
        while (this.sprites.length != value) {
            this.sprites.forEach((value: Sprite, index: number) =>
                value.destroy())
            this.sprites = []
            let s: Sprite = sprites.create(img`.`, SpriteKind.Dice)
            s.setFlag(SpriteFlag.Invisible, true)
            s.z = Dice.Z
            this.sprites.push(s)
        }
        if (this.sprites.length > value) {
            this.sprites = this.sprites.slice(0, value - 1)
        }
        if (this.values == null || typeof this.values != 'object' || this.values.length != value) {
            this.values = []
            for (let i: number = 0; i < value; i++) {
                this.values.push(1)
            }
        }
        this.resetSprites()
        this.updateSpriteImages()
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
        let toReturn: number = 0
        if (this.values.length < 3) {
            for (let v of this.values) {
                toReturn += v
            }
        } else {
            for (let i: number = 0; i < this.values.length - 1; i++) {
                toReturn += this.values[i]
            }
            const speedDie: number = this.values[this.values.length - 1]
            if (speedDie <= 3) {
                toReturn += speedDie
            }
        }
        return toReturn
    }

    public get SpeedDie(): number {
        if (this.values.length < 3) {
            return -1
        } else {
            return this.values[this.values.length - 1]
        }
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

    /**
     * Release resources that are not automatically destroyed by the garbage collector.
     */
    public release(): void {
        this.sprites.forEach((value: Sprite, index: number) =>
            value.destroy())
    }

    public setLocationChange(vx: number, vy: number): void {
        this.areRolling = false
        this.deltaX = vx
        this.deltaY = vy
    }

    public setStartLocation(x: number, y: number): void {
        this.areRolling = false
        this.startX = x
        this.startY = y
    }

    public setStopLocation(x: number, y: number): void {
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
     * protected methods
     */
    protected randomize(): void {
        for (let i: number = 0; i < this.values.length; i++) {
            this.values[i] = randint(1, 6)
        }
        this.updateSpriteImages()
    }

    protected resetSprites(): void {
        let x: number = this.startX
        let y: number = this.startY
        const w: number = assets.animation`d6white`[0].width
        for (let s of this.sprites) {
            s.setPosition(x, y)
            switch (this.orientation) {
                case DiceOrientation.Horizontal:
                    x += w + Dice.MARGIN
                    break

                case DiceOrientation.Vertical:
                    y += w + Dice.MARGIN
                    break
            }
        }
    }

    protected updateSpriteImages(): void {
        let speedDie: number = Math.max(2, this.values.length - 1)
        for (let i: number = 0; i < this.values.length; i++) {
            let s: Sprite = this.sprites[i]
            if (i == speedDie) {
                s.setImage(assets.animation`d6speed`[this.values[i] - 1])
            } else {
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
}

/**
 * Dice test routines
 */
namespace DiceTests {
    export let diceTest: Dice = null
    
    export function start(count: number = 2) {
        g_state.Mode = GameMode.NotReady
        diceTest = new Dice(count, DiceOrientation.Vertical)
        if (count == 3) {
            g_state.Mode = GameMode.SpeedDieTest
        } else {
            g_state.Mode = GameMode.DiceTest
        }
    }

    export function update() {
        if (diceTest.Count == 2) {
            if (diceTest.AreRolling) {
                diceTest.move()
                if (!diceTest.AreRolling) {
                    game.splash('Roll: ' + diceTest.Roll +
                        ' Doubles: ' + diceTest.AreDoubles)
                }
            }
        } else {
            if (DiceTests.diceTest.AreRolling) {
                DiceTests.diceTest.move()
                if (!DiceTests.diceTest.AreRolling) {
                    game.showLongText('Roll: ' + DiceTests.diceTest.Roll +
                        '\nDoubles: ' + DiceTests.diceTest.AreDoubles +
                        '\nTriples: ' + DiceTests.diceTest.AreTriples +
                        '\nSpeed die: ' + DiceTests.diceTest.SpeedDie, DialogLayout.Center)
                }
            }
        }
    }
}
