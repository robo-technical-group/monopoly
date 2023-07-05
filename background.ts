/**
 * Background animations
 */
namespace SpriteKind {
    export const Background = SpriteKind.create()
}

namespace Background {
    const LAYERS: Image[] = [
        assets.image`clouds`,
        assets.image`frontBldgs`,
        assets.image`backBldgs`,
        assets.image`grass`,
    ]
    const FRAME_DELAYS: number[] = [40, 20, 10, 1,]
    const TOP_VALUES: number[] = [30, 35, 45, 72,]

    let pixelsMoved: number = 0

    export function hide(): void {
        sprites.allOfKind(SpriteKind.Background).forEach(
            (value: Sprite, index: number) =>
                value.setFlag(SpriteFlag.Invisible, true)
        )
    }

    function init(): void {
        LAYERS.forEach((value: Image, index: number) => {
            let left: number = -40
            while (left <= 160) {
                let s: Sprite = sprites.create(value, SpriteKind.Background)
                s.setFlag(SpriteFlag.Ghost, true)
                s.left = left
                s.top = TOP_VALUES[index]
                s.data['frameDelay'] = FRAME_DELAYS[index]
                s.data['lastMoved'] = 0
                s.z = index
                left += s.width
            }
        })
    }

    export function move(speed: number): void {
        if (g_state.Board.Direction >= 0) {
            moveForward(speed)
        } else {
            moveBackward(speed)
        }
    }

    function moveBackward(speed: number): void {
        pixelsMoved += speed
        sprites.allOfKind(SpriteKind.Background).forEach((s: Sprite, index: number) => {
            if (pixelsMoved >= <number>(s.data['lastMoved']) + <number>(s.data['frameDelay'])) {
                s.left -= speed
                s.data['lastMoved'] = pixelsMoved
            }
        })
        sprites.allOfKind(SpriteKind.Background).forEach((s: Sprite, index: number) => {
            if (s.right < 0) {
                // Find right-most sprite in same layer.
                let right: number = 0
                sprites.allOfKind(SpriteKind.Background).forEach((value: Sprite, index: number) => {
                    if (value.right > right && s.data['frameDelay'] == value.data['frameDelay']) {
                        right = value.right
                    }
                })
                s.left = right
            }
        })
    }

    function moveForward(speed: number): void {
        pixelsMoved += speed
        sprites.allOfKind(SpriteKind.Background).forEach((s: Sprite, index: number) => {
            if (pixelsMoved >= <number>(s.data['lastMoved']) + <number>(s.data['frameDelay'])) {
                s.left += speed
                s.data['lastMoved'] = pixelsMoved
            }
        })
        sprites.allOfKind(SpriteKind.Background).forEach((s: Sprite, index: number) => {
            if (s.left >= 160) {
                // Find left-most sprite in same layer.
                let left: number = 160
                sprites.allOfKind(SpriteKind.Background).forEach((value: Sprite, index: number) => {
                    if (value.left < left && s.data['frameDelay'] == value.data['frameDelay']) {
                        left = value.left
                    }
                })
                s.right = left
            }
        })
    }

    export function show(): void {
        if (sprites.allOfKind(SpriteKind.Background).length == 0) {
            init()
        } else {
            sprites.allOfKind(SpriteKind.Background).forEach(
                (value: Sprite, index: number) => {
                    value.setFlag(SpriteFlag.Invisible, false)
                    value.data['lastMoved'] = 0
                }
            )
            pixelsMoved = 0
        }
    }
}

namespace BackgroundTests {
    export let currSpace: TextSprite = null
    let running: boolean = false

    export function setup(): void {
        g_state.Mode = GameMode.NotReady
        let bg: Image = image.create(160, 120)
        bg.drawLine(80, 0, 80, 120, Color.Yellow)
        scene.setBackgroundImage(bg)
        Background.show()
        g_state.Board.draw(0)
        currSpace = textsprite.create('0')
        currSpace.left = 0
        currSpace.top = 0
        g_state.Mode = GameMode.BackgroundTest
        running = true
    }

    export function toggleRunning(): void {
        running = !running
    }

    export function update(): void {
        if (running) {
            Background.move(g_state.Board.Speed)
            g_state.Board.move()
            currSpace.text = g_state.Board.CurrSpace.toString()
            currSpace.update()
        }
    }
}