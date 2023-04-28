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
        assets.image`lowerThird`,
    ]
    const FRAME_DELAYS: number[] = [40, 20, 10, 1,]
    const TOP_VALUES: number[] = [30, 35, 45, 72,]

    export let direction: number = 1
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
                s.z = index
                left += s.width
            }
        })
    }

    export function move(): void {
        if (direction >= 0) {
            moveForward()
        } else {
            moveBackward()
        }
    }

    function moveBackward(): void {
        pixelsMoved++
        sprites.allOfKind(SpriteKind.Background).forEach((s: Sprite, index: number) => {
            if (pixelsMoved % <number>(s.data['frameDelay']) == 0) {
                s.x--
                if (s.right < 0) {
                    // Find right-most sprite in same layer.
                    let right: number = 0
                    sprites.allOfKind(SpriteKind.Background).forEach((value: Sprite, index: number) => {
                        if (value.right > right && s.data['frameDelay'] == value.data['frameDelay']) {
                            right = value.right
                        }
                    })
                    s.left = right - 1
                }
            }
        })
    }

    function moveForward(): void {
        pixelsMoved++
        sprites.allOfKind(SpriteKind.Background).forEach((s: Sprite, index: number) => {
            if (pixelsMoved % <number>(s.data['frameDelay']) == 0) {
                s.x++
                if (s.left >= 160) {
                    // Find left-most sprite in same layer.
                    let left: number = 160
                    sprites.allOfKind(SpriteKind.Background).forEach((value: Sprite, index: number) => {
                        if (value.left < left && s.data['frameDelay'] == value.data['frameDelay']) {
                            left = value.left
                        }
                    })
                    s.right = left + 1
                }
            }
        })
    }

    export function show(): void {
        if (sprites.allOfKind(SpriteKind.Background).length == 0) {
            init()
        } else {
            sprites.allOfKind(SpriteKind.Background).forEach(
                (value: Sprite, index: number) =>
                    value.setFlag(SpriteFlag.Invisible, false)
            )
            pixelsMoved = 0
        }
    }
}