namespace SpriteKind {
    export const BoardSpace = SpriteKind.create()
}

namespace Board {
    export enum SpaceType {
        Property,
        Go,
        Card,
        Tax,
        Jail,
        Free,
        GoToJail,
    }

    export interface Space {
        image: Image
        spaceType: SpaceType
        values: number[]
    }

    export const BOARD: Space[] = [
        // [0]
        {
            image: assets.animation`boardCorners`[0],
            spaceType: SpaceType.Go,
            values: [200,],
        }, {
            image: assets.animation`boardSides`[0],
            spaceType: SpaceType.Property,
            values: [0, 0,],
        }, {
            image: assets.animation`boardSides`[29],
            spaceType: SpaceType.Card,
            values: [1,],
        }, {
            image: assets.animation`boardSides`[1],
            spaceType: SpaceType.Property,
            values: [0, 1,],
        }, {
            image: assets.animation`boardSides`[30],
            spaceType: SpaceType.Tax,
            values: [0,],
        }, /* [5] */ {
            image: assets.animation`boardSides`[22],
            spaceType: SpaceType.Property,
            values: [8, 0,],
        }, {
            image: assets.animation`boardSides`[2],
            spaceType: SpaceType.Property,
            values: [1, 0,],
        }, {
            image: assets.animation`boardSides`[28],
            spaceType: SpaceType.Card,
            values: [0,],
        }, {
            image: assets.animation`boardSides`[3],
            spaceType: SpaceType.Property,
            values: [1, 1,],
        }, {
            image: assets.animation`boardSides`[4],
            spaceType: SpaceType.Property,
            values: [1, 2,],
        }, /* [10] */ {
            image: assets.animation`boardCorners`[1],
            spaceType: SpaceType.Jail,
            values: [50,],
        }, {
            image: assets.animation`boardSides`[5],
            spaceType: SpaceType.Property,
            values: [2, 0,],
        }, {
            image: assets.animation`boardSides`[26],
            spaceType: SpaceType.Property,
            values: [9, 0,],
        }, {
            image: assets.animation`boardSides`[6],
            spaceType: SpaceType.Property,
            values: [2, 1,],
        }, {
            image: assets.animation`boardSides`[7],
            spaceType: SpaceType.Property,
            values: [2, 2,],
        }, /* [15] */ {
            image: assets.animation`boardSides`[23],
            spaceType: SpaceType.Property,
            values: [8, 1,],
        }, {
            image: assets.animation`boardSides`[8],
            spaceType: SpaceType.Property,
            values: [3, 0,],
        }, {
            image: assets.animation`boardSides`[29],
            spaceType: SpaceType.Card,
            values: [1,],
        }, {
            image: assets.animation`boardSides`[9],
            spaceType: SpaceType.Property,
            values: [3, 1,],
        }, {
            image: assets.animation`boardSides`[10],
            spaceType: SpaceType.Property,
            values: [3, 2,],
        }, /* [20] */ {
            image: assets.animation`boardCorners`[2],
            spaceType: SpaceType.Free,
            values: [],
        }, {
            image: assets.animation`boardSides`[11],
            spaceType: SpaceType.Property,
            values: [4, 0,],
        }, {
            image: assets.animation`boardSides`[28],
            spaceType: SpaceType.Card,
            values: [0,],
        }, {
            image: assets.animation`boardSides`[12],
            spaceType: SpaceType.Property,
            values: [4, 1,],
        }, {
            image: assets.animation`boardSides`[13],
            spaceType: SpaceType.Property,
            values: [4, 2,],
        }, /* [25] */ {
            image: assets.animation`boardSides`[24],
            spaceType: SpaceType.Property,
            values: [8, 2,],
        }, {
            image: assets.animation`boardSides`[14],
            spaceType: SpaceType.Property,
            values: [5, 0,],
        }, {
            image: assets.animation`boardSides`[15],
            spaceType: SpaceType.Property,
            values: [5, 1,],
        }, {
            image: assets.animation`boardSides`[27],
            spaceType: SpaceType.Property,
            values: [9, 1,],
        }, {
            image: assets.animation`boardSides`[16],
            spaceType: SpaceType.Property,
            values: [5, 2,],
        }, /* [30] */ {
            image: assets.animation`boardCorners`[3],
            spaceType: SpaceType.GoToJail,
            values: [],
        }, {
            image: assets.animation`boardSides`[17],
            spaceType: SpaceType.Property,
            values: [6, 0,],
        }, {
            image: assets.animation`boardSides`[18],
            spaceType: SpaceType.Property,
            values: [6, 1,],
        }, {
            image: assets.animation`boardSides`[29],
            spaceType: SpaceType.Card,
            values: [1,],
        }, {
            image: assets.animation`boardSides`[19],
            spaceType: SpaceType.Property,
            values: [6, 2,],
        }, /* [35] */ {
            image: assets.animation`boardSides`[25],
            spaceType: SpaceType.Property,
            values: [8, 3,],
        }, {
            image: assets.animation`boardSides`[28],
            spaceType: SpaceType.Card,
            values: [0,],
        }, {
            image: assets.animation`boardSides`[20],
            spaceType: SpaceType.Property,
            values: [7, 0,],
        }, {
            image: assets.animation`boardSides`[31],
            spaceType: SpaceType.Tax,
            values: [1,],
        }, {
            image: assets.animation`boardSides`[21],
            spaceType: SpaceType.Property,
            values: [7, 1,],
        },
    ]
    export const GO_SPACE: number = 0
    export const JAIL_SPACE: number = 10
    const MARGIN: number = 2
    const SPEED: number = 1
    const Z: number = 10

    export let currSpace: number = -1
    export let direction: number = 1

    export function draw(location: number): void {
        if (location >= BOARD.length) {
            location -= BOARD.length
        }
        if (location < 0) {
            location += BOARD.length
        }

        currSpace = location
        // Remove all existing board sprites.
        for (let s of sprites.allOfKind(SpriteKind.BoardSpace)) {
            s.destroy()
        }

        // Place current location in center of moving board.
        let x: number = 80
        let y: number = 100
        let currSprite: Sprite = drawSprite(location, x, y)

        // Previous board locations to the right.
        let s: Sprite = currSprite
        let index: number = location
        let left: number = s.left
        while (left < 160) {
            x = s.right + MARGIN
            index--
            if (index < 0) {
                index = BOARD.length - 1
            }
            x += Math.floor(BOARD[index].image.width / 2)
            s = drawSprite(index, x, y)
            left = s.left
        }

        // Subsequent board locations to the left.
        s = currSprite
        index = location
        let right: number = s.right
        while (right > 0) {
            x = s.left - MARGIN
            index++
            if (index >= BOARD.length) {
                index = 0
            }
            x -= Math.floor(BOARD[index].image.width / 2)
            s = drawSprite(index, x, y)
            right = s.right
        }
    }

    function drawSprite(location: number, x: number, y: number): Sprite {
        let s: Sprite = sprites.create(BOARD[location].image,
            SpriteKind.BoardSpace
        )
        s.data['boardIndex'] = location
        s.setFlag(SpriteFlag.Ghost, true)
        s.x = x
        s.y = y
        s.z = Z
        return s
    }

    export function move(): void {
        if (direction >= 0) {
            moveForward()
        } else {
            moveBackward()
        }
        updateLocation()
    }

    function moveBackward(): void {
        for (let boardSprite of sprites.allOfKind(SpriteKind.BoardSpace)) {
            boardSprite.x -= SPEED
            if (boardSprite.right < 0) {
                // Find sprite furthest to the right.
                let rightX: number = 0
                let rightIndex: number = 0
                for (let s of sprites.allOfKind(SpriteKind.BoardSpace)) {
                    if (s.right > rightX) {
                        rightX = s.right
                        rightIndex = s.data['boardIndex']
                    }
                }
                let boardIndex: number = rightIndex - 1
                if (boardIndex < 0) {
                    boardIndex = BOARD.length - 1
                }
                boardSprite.setImage(BOARD[boardIndex].image)
                boardSprite.data['boardIndex'] = boardIndex
                boardSprite.left = rightX + MARGIN
            }
        }
    }

    function moveForward(): void {
        for (let boardSprite of sprites.allOfKind(SpriteKind.BoardSpace)) {
            boardSprite.x += SPEED
            if (boardSprite.left > 160) {
                // Find sprite furthest to the left.
                let leftX: number = 160
                let leftIndex: number = 0
                for (let s of sprites.allOfKind(SpriteKind.BoardSpace)) {
                    if (s.left < leftX) {
                        leftX = s.left
                        leftIndex = s.data['boardIndex']
                    }
                }
                let boardIndex: number = leftIndex + 1
                if (boardIndex >= BOARD.length) {
                    boardIndex = 0
                }
                boardSprite.setImage(BOARD[boardIndex].image)
                boardSprite.data['boardIndex'] = boardIndex
                boardSprite.right = leftX - MARGIN
            }
        }
    }

    function updateLocation(): void {
        // Find the current space sprite.
        let currSprite: Sprite =
            sprites.allOfKind(SpriteKind.BoardSpace).find(
                (value: Sprite, index: number) =>
                value.data['boardIndex'] == Board.currSpace
            )
        if (currSprite == null) {
            // Current location was not found among sprites.
            // Bail.
            return
        }
        if (
            (direction >= 0 && currSprite.left + MARGIN >= 80) ||
            (direction < 0 && currSprite.right + MARGIN <= 80)
        ) {
            if (direction >= 0) {
                currSpace++
                if (currSpace >= BOARD.length) {
                    currSpace = 0
                }
            } else {
                currSpace--
                if (currSpace < 0) {
                    currSpace = BOARD.length - 1
                }
            }
        }
    }
}

namespace BoardTests {
    export let currSpace: TextSprite = null
    export function setup(): void {
        g_state.Mode = GameMode.NotReady
        let bg: Image = image.create(160, 120)
        bg.drawLine(80, 0, 80, 120, Color.Yellow)
        scene.setBackgroundImage(bg)
        Board.draw(0)
        currSpace = textsprite.create('0')
        currSpace.left = 0
        currSpace.top = 0
        g_state.Mode = GameMode.BoardTest
    }
}
