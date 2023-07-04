/**
 * IMAGES
 * Board Sides
 *  0 = Mediterranean Avenue
 *  1 = Baltic Avenue
 *  2 = Arctic Avenue
 *  3 = Massachusettes Avenue
 *  4 = Oriental Avenue
 *  5 = Vermont Avenue
 *  6 = Connecticut Avenue
 *  7 = Maryland Avenue
 *  8 = Saint Charles Place
 *  9 = States Avenue
 * 10 = Virgina Avenue
 * 11 = Saint James Place
 * 12 = Tennessee Avenue
 * 13 = New York Avenue
 * 14 = New Jersey Avenue
 * 15 = Kentucky Avenue
 * 16 = Indiana Avenue
 * 17 = Illinois Avenue
 * 18 = Michigan Avenue
 * 19 = Atlantic Avenue
 * 20 = Ventnor Avenue
 * 21 = Marvin Gardens
 * 22 = California Avenue
 * 23 = Pacific Avenue
 * 24 = South Carolina Avenue
 * 25 = North Carolina Avenue
 * 26 = Pennsylvania Avenue
 * 27 = Florida Avenue
 * 28 = Park Place
 * 29 = Boardwalk
 * 30 = Reading Railroad
 * 31 = Pennsylvania Railroad
 * 32 = B&O Railroad
 * 33 = Short Line Railroad
 * 34 = Electric Company
 * 35 = Water Works
 * 36 = Gas Company
 * 37 = Chance
 * 38 = Community Chest
 * 39 = Bus Ticket
 * 40 = Income Tax
 * 41 = Luxury Tax
 * 42 = Birthday Gift
 * 43 = Auction
 *
 * Board Corners
 *  0 = Go
 *  1 = Jail
 *  2 = Free Parking
 *  3 = Go to Jail
 */

namespace SpriteKind {
    export const BoardSpace = SpriteKind.create()
}

enum SpaceType {
    Property,
    Go,
    Card,
    Tax,
    Jail,
    Free,
    GoToJail,
    BusTicket,
    Auction,
    Gift,
}

interface Space {
    image: Image
    spaceType: SpaceType
    values: number[]
}

class Board {
    /**
     * Public constants
     */
    public static readonly DICE_BEGIN_X: number = 10
    public static readonly DICE_BEGIN_Y: number = 40
    public static readonly DICE_END_X: number = 150
    public static readonly DICE_END_Y: number = 40

    /**
     * Protected constants
     */
    protected static readonly BOARDS: Space[][] = [
    [
    // Standard board
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
            image: assets.animation`boardSides`[38],
            spaceType: SpaceType.Card,
            values: [1,],
        }, {
            image: assets.animation`boardSides`[1],
            spaceType: SpaceType.Property,
            values: [0, 1,],
        }, {
            image: assets.animation`boardSides`[40],
            spaceType: SpaceType.Tax,
            values: [0,],
        }, /* [5] */ {
            image: assets.animation`boardSides`[30],
            spaceType: SpaceType.Property,
            values: [8, 0,],
        }, {
            image: assets.animation`boardSides`[4],
            spaceType: SpaceType.Property,
            values: [1, 0,],
        }, {
            image: assets.animation`boardSides`[37],
            spaceType: SpaceType.Card,
            values: [0,],
        }, {
            image: assets.animation`boardSides`[5],
            spaceType: SpaceType.Property,
            values: [1, 1,],
        }, {
            image: assets.animation`boardSides`[6],
            spaceType: SpaceType.Property,
            values: [1, 2,],
        }, /* [10] */ {
            image: assets.animation`boardCorners`[1],
            spaceType: SpaceType.Jail,
            values: [50,],
        }, {
            image: assets.animation`boardSides`[8],
            spaceType: SpaceType.Property,
            values: [2, 0,],
        }, {
            image: assets.animation`boardSides`[34],
            spaceType: SpaceType.Property,
            values: [9, 0,],
        }, {
            image: assets.animation`boardSides`[9],
            spaceType: SpaceType.Property,
            values: [2, 1,],
        }, {
            image: assets.animation`boardSides`[10],
            spaceType: SpaceType.Property,
            values: [2, 2,],
        }, /* [15] */ {
            image: assets.animation`boardSides`[31],
            spaceType: SpaceType.Property,
            values: [8, 1,],
        }, {
            image: assets.animation`boardSides`[11],
            spaceType: SpaceType.Property,
            values: [3, 0,],
        }, {
            image: assets.animation`boardSides`[38],
            spaceType: SpaceType.Card,
            values: [1,],
        }, {
            image: assets.animation`boardSides`[12],
            spaceType: SpaceType.Property,
            values: [3, 1,],
        }, {
            image: assets.animation`boardSides`[13],
            spaceType: SpaceType.Property,
            values: [3, 2,],
        }, /* [20] */ {
            image: assets.animation`boardCorners`[2],
            spaceType: SpaceType.Free,
            values: [],
        }, {
            image: assets.animation`boardSides`[15],
            spaceType: SpaceType.Property,
            values: [4, 0,],
        }, {
            image: assets.animation`boardSides`[37],
            spaceType: SpaceType.Card,
            values: [0,],
        }, {
            image: assets.animation`boardSides`[16],
            spaceType: SpaceType.Property,
            values: [4, 1,],
        }, {
            image: assets.animation`boardSides`[17],
            spaceType: SpaceType.Property,
            values: [4, 2,],
        }, /* [25] */ {
            image: assets.animation`boardSides`[32],
            spaceType: SpaceType.Property,
            values: [8, 2,],
        }, {
            image: assets.animation`boardSides`[19],
            spaceType: SpaceType.Property,
            values: [5, 0,],
        }, {
            image: assets.animation`boardSides`[20],
            spaceType: SpaceType.Property,
            values: [5, 1,],
        }, {
            image: assets.animation`boardSides`[35],
            spaceType: SpaceType.Property,
            values: [9, 1,],
        }, {
            image: assets.animation`boardSides`[21],
            spaceType: SpaceType.Property,
            values: [5, 2,],
        }, /* [30] */ {
            image: assets.animation`boardCorners`[3],
            spaceType: SpaceType.GoToJail,
            values: [],
        }, {
            image: assets.animation`boardSides`[23],
            spaceType: SpaceType.Property,
            values: [6, 0,],
        }, {
            image: assets.animation`boardSides`[25],
            spaceType: SpaceType.Property,
            values: [6, 1,],
        }, {
            image: assets.animation`boardSides`[38],
            spaceType: SpaceType.Card,
            values: [1,],
        }, {
            image: assets.animation`boardSides`[26],
            spaceType: SpaceType.Property,
            values: [6, 2,],
        }, /* [35] */ {
            image: assets.animation`boardSides`[33],
            spaceType: SpaceType.Property,
            values: [8, 3,],
        }, {
            image: assets.animation`boardSides`[37],
            spaceType: SpaceType.Card,
            values: [0,],
        }, {
            image: assets.animation`boardSides`[28],
            spaceType: SpaceType.Property,
            values: [7, 0,],
        }, {
            image: assets.animation`boardSides`[41],
            spaceType: SpaceType.Tax,
            values: [1,],
        }, {
            image: assets.animation`boardSides`[29],
            spaceType: SpaceType.Property,
            values: [7, 1,],
        },
    ], [
    // Mega board
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
            image: assets.animation`boardSides`[38],
            spaceType: SpaceType.Card,
            values: [1,],
        }, {
            image: assets.animation`boardSides`[1],
            spaceType: SpaceType.Property,
            values: [0, 1,],
        }, {
            image: assets.animation`boardSides`[2],
            spaceType: SpaceType.Property,
            values: [0, 2,],
        }, /* [5] */ {
            image: assets.animation`boardSides`[40],
            spaceType: SpaceType.Tax,
            values: [0,],
        }, {
            image: assets.animation`boardSides`[30],
            spaceType: SpaceType.Property,
            values: [8, 0,],
        }, {
            image: assets.animation`boardSides`[3],
            spaceType: SpaceType.Property,
            values: [1, 0,],
        }, {
            image: assets.animation`boardSides`[4],
            spaceType: SpaceType.Property,
            values: [1, 1,],
        }, {
            image: assets.animation`boardSides`[37],
            spaceType: SpaceType.Card,
            values: [0,],
        }, /* [10] */ {
            image: assets.animation`boardSides`[36],
            spaceType: SpaceType.Property,
            values: [9, 0,],
        }, {
            image: assets.animation`boardSides`[5],
            spaceType: SpaceType.Property,
            values: [1, 2,],
        }, {
            image: assets.animation`boardSides`[6],
            spaceType: SpaceType.Property,
            values: [1, 3,],
        }, {
            image: assets.animation`boardCorners`[1],
            spaceType: SpaceType.Jail,
            values: [50,],
        }, {
            image: assets.animation`boardSides`[43],
            spaceType: SpaceType.Auction,
            values: [],
        }, /* [15] */ {
            image: assets.animation`boardSides`[7],
            spaceType: SpaceType.Property,
            values: [2, 0,],
        }, {
            image: assets.animation`boardSides`[8],
            spaceType: SpaceType.Property,
            values: [2, 1,],
        }, {
            image: assets.animation`boardSides`[34],
            spaceType: SpaceType.Property,
            values: [9, 1,],
        }, {
            image: assets.animation`boardSides`[9],
            spaceType: SpaceType.Property,
            values: [2, 2,],
        }, {
            image: assets.animation`boardSides`[10],
            spaceType: SpaceType.Property,
            values: [2, 3,],
        }, /* [20] */ {
            image: assets.animation`boardSides`[31],
            spaceType: SpaceType.Property,
            values: [8, 1,],
        }, {
            image: assets.animation`boardSides`[11],
            spaceType: SpaceType.Property,
            values: [3, 0,],
        }, {
            image: assets.animation`boardSides`[38],
            spaceType: SpaceType.Card,
            values: [1,],
        }, {
            image: assets.animation`boardSides`[12],
            spaceType: SpaceType.Property,
            values: [3, 1,],
        }, {
            image: assets.animation`boardSides`[13],
            spaceType: SpaceType.Property,
            values: [3, 2,],
        }, /* [25] */ {
            image: assets.animation`boardSides`[14],
            spaceType: SpaceType.Property,
            values: [3, 3,],
        }, {
            image: assets.animation`boardCorners`[2],
            spaceType: SpaceType.Free,
            values: [],
        }, {
            image: assets.animation`boardSides`[15],
            spaceType: SpaceType.Property,
            values: [4, 0,],
        }, {
            image: assets.animation`boardSides`[37],
            spaceType: SpaceType.Card,
            values: [0,],
        }, {
            image: assets.animation`boardSides`[16],
            spaceType: SpaceType.Property,
            values: [4, 1,],
        }, /* [30] */ {
            image: assets.animation`boardSides`[17],
            spaceType: SpaceType.Property,
            values: [4, 2,],
        }, {
            image: assets.animation`boardSides`[18],
            spaceType: SpaceType.Property,
            values: [4, 3,],
        }, {
            image: assets.animation`boardSides`[39],
            spaceType: SpaceType.BusTicket,
            values: [],
        }, {
            image: assets.animation`boardSides`[32],
            spaceType: SpaceType.Property,
            values: [8, 2,],
        }, {
            image: assets.animation`boardSides`[19],
            spaceType: SpaceType.Property,
            values: [5, 0,],
        }, /* [35] */ {
            image: assets.animation`boardSides`[20],
            spaceType: SpaceType.Property,
            values: [5, 1,],
        }, {
            image: assets.animation`boardSides`[35],
            spaceType: SpaceType.Property,
            values: [9, 2,],
        }, {
            image: assets.animation`boardSides`[21],
            spaceType: SpaceType.Property,
            values: [5, 2,],
        }, {
            image: assets.animation`boardSides`[22],
            spaceType: SpaceType.Property,
            values: [5, 3,],
        }, {
            image: assets.animation`boardCorners`[3],
            spaceType: SpaceType.GoToJail,
            values: [],
        }, /* [40] */ {
            image: assets.animation`boardSides`[23],
            spaceType: SpaceType.Property,
            values: [6, 0,],
        }, {
            image: assets.animation`boardSides`[24],
            spaceType: SpaceType.Property,
            values: [6, 1,],
        }, {
            image: assets.animation`boardSides`[25],
            spaceType: SpaceType.Property,
            values: [6, 2,],
        }, {
            image: assets.animation`boardSides`[38],
            spaceType: SpaceType.Card,
            values: [1,],
        }, {
            image: assets.animation`boardSides`[26],
            spaceType: SpaceType.Property,
            values: [6, 3,],
        }, /* [45] */ {
            image: assets.animation`boardSides`[33],
            spaceType: SpaceType.Property,
            values: [8, 3,],
        }, {
            image: assets.animation`boardSides`[37],
            spaceType: SpaceType.Card,
            values: [0,],
        }, {
            image: assets.animation`boardSides`[42],
            spaceType: SpaceType.Gift,
            values: [100,],
        }, {
            image: assets.animation`boardSides`[27],
            spaceType: SpaceType.Property,
            values: [7, 0,],
        }, {
            image: assets.animation`boardSides`[28],
            spaceType: SpaceType.Property,
            values: [7, 1,],
        }, /* [50] */ {
            image: assets.animation`boardSides`[41],
            spaceType: SpaceType.Tax,
            values: [1,],
        }, {
            image: assets.animation`boardSides`[29],
            spaceType: SpaceType.Property,
            values: [7, 2,],
        },
    ],
    ]
    protected static readonly BOARD_TOP: number = 80
    protected static readonly MARGIN: number = 2
    protected static readonly PLAYER_BOTTOM: number = 78
    protected static readonly PLAYER_IN_JAIL_TOP: number = 0
    protected static readonly PLAYER_IN_JAIL_X_DELTA: number = 0
    protected static readonly SPEED: number = 1
    protected static readonly Z: number = 10

    protected board: Space[]
    protected currSpace: number
    protected direction: number
    protected go: number
    protected index: number
    protected jail: number
    protected spacesMoved: number

    constructor(board: number = 0) {
        this.index = board
        this.board = Board.BOARDS[board]
        // Find the special spaces later.
        this.go = -1
        this.jail = -1
        this.currSpace = -1
        this.direction = 1
        this.spacesMoved = 0
    }

    /**
     * Public properties
     */
    public get BoardSpaces(): Space[] {
        return this.board
    }

    public get CurrSpace(): number {
        return this.currSpace
    }

    public get Direction(): number {
        return this.direction
    }

    public set Direction(value: number) {
        this.direction = value
    }

    public get Go(): number {
        if (this.go == -1) {
            this.board.forEach((value: Space, index: number) => {
                if (value.spaceType == SpaceType.Go) {
                    this.go = index
                }
            })
        }
        if (this.go == -1) {
            throw 'get Go: Go! space has not been defined in this board.'
        }
        return this.go
    }

    public get Jail(): number {
        if (this.jail == -1) {
            this.board.forEach((value: Space, index: number) => {
                if (value.spaceType == SpaceType.Jail) {
                    this.jail = index
                }
            })
        }
        if (this.jail == -1) {
            throw 'get Jail: Jail space has not been defined in this board.'
        }
        return this.jail
    }

    public get SpacesMoved(): number {
        return this.spacesMoved
    }

    /**
     * Public methods
     */
    public draw(location: number): void {
        this.spacesMoved = 0
        if (location >= this.board.length) {
            location -= this.board.length
        }
        if (location < 0) {
            location += this.board.length
        }

        this.currSpace = location
        // Remove all existing board sprites.
        for (let s of sprites.allOfKind(SpriteKind.BoardSpace)) {
            s.destroy()
        }

        // Place current location in center of moving board.
        let x: number = 80
        let currSprite: Sprite = this.drawSprite(location, x)
        let s: Sprite = null

        // Draw current player.
        let p: Player = g_state.getCurrPlayer()
        if (p != null) {
            s = p.Sprite
            s.x = x
            s.bottom = Board.PLAYER_BOTTOM
            s.z = Player.Z_CURRENT
            p.showSprite()
        }

        // Previous board locations to the right.
        s = currSprite
        let index: number = location
        let left: number = s.left
        while (left < 160) {
            x = s.right + Board.MARGIN
            index--
            if (index < 0) {
                index = this.board.length - 1
            }
            x += Math.floor(this.board[index].image.width / 2)
            s = this.drawSprite(index, x)
            left = s.left
        }

        // Subsequent board locations to the left.
        s = currSprite
        index = location
        let right: number = s.right
        while (right > 0) {
            x = s.left - Board.MARGIN
            index++
            if (index >= this.board.length) {
                index = 0
            }
            x -= Math.floor(this.board[index].image.width / 2)
            s = this.drawSprite(index, x)
            right = s.right
        }
    }

    public getCardLocation(location: Cards.CardLocations): number {
        let toReturn: number = -1
        switch (location) {
            case Cards.CardLocations.Boardwalk:
                toReturn = this.board.length - 1
                break

            case Cards.CardLocations.Illinois:
                switch (this.index) {
                    case 0:
                        toReturn = 24
                        break

                    case 1:
                        toReturn = 30
                        break
                }
                break

            case Cards.CardLocations.Jail:
                switch (this.index) {
                    case 0:
                        toReturn = 10
                        break

                    case 1:
                        toReturn = 13
                        break
                }
                break

            case Cards.CardLocations.Go:
                toReturn = 0
                break

            case Cards.CardLocations.Reading:
                switch (this.index) {
                    case 0:
                        toReturn = 5
                        break

                    case 1:
                        toReturn = 6
                        break
                }
                break

            case Cards.CardLocations.SaintCharles:
                switch (this.index) {
                    case 0:
                        toReturn = 11
                        break

                    case 1:
                        toReturn = 16
                        break
                }
                break
        }
        return toReturn
    }

    public getSpace(location: number): Space {
        if (location >= 0 && location < this.board.length) {
            return this.board[location]
        } else {
            return null
        }
    }

    public getXCoordinate(location: number): number {
        let s: Sprite[] = sprites.allOfKind(SpriteKind.BoardSpace).filter(
            (value: Sprite, index: number) => value.data['boardIndex'] == location
        )
        if (s.length > 0) {
            return s[0].x
        } else {
            return -1
        }
    }

    public locationVisible(location: number): boolean {
        return sprites.allOfKind(SpriteKind.BoardSpace).filter(
            (value: Sprite, index: number) => value.data['boardIndex'] == location
        ).length > 0
    }

    public move(): void {
        if (this.direction >= 0) {
            this.moveForward()
        } else {
            this.moveBackward()
        }
        this.updateLocation()
    }

    /**
     * Protected methods
     */
    protected drawSprite(location: number, x: number): Sprite {
        let s: Sprite = sprites.create(this.board[location].image,
            SpriteKind.BoardSpace
        )
        s.data['boardIndex'] = location
        s.setFlag(SpriteFlag.Ghost, true)
        s.x = x
        s.top = Board.BOARD_TOP
        s.z = Board.Z
        if (g_state.CurrPlayer > 0) {
            this.showPlayer(location, x)
        }

        return s
    }

    protected moveBackward(): void {
        for (let boardSprite of sprites.allOfKind(SpriteKind.BoardSpace)) {
            boardSprite.x -= Board.SPEED
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
                    boardIndex = this.board.length - 1
                }
                boardSprite.setImage(this.board[boardIndex].image)
                boardSprite.data['boardIndex'] = boardIndex
                boardSprite.left = rightX + Board.MARGIN
                if (g_state.CurrPlayer > 0) {
                    this.showPlayer(boardIndex, boardSprite.x)
                }
            }
        }
    }

    protected moveForward(): void {
        for (let boardSprite of sprites.allOfKind(SpriteKind.BoardSpace)) {
            boardSprite.x += Board.SPEED
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
                if (boardIndex >= this.board.length) {
                    boardIndex = 0
                }
                boardSprite.setImage(this.board[boardIndex].image)
                boardSprite.data['boardIndex'] = boardIndex
                boardSprite.right = leftX - Board.MARGIN
                if (g_state.CurrPlayer > 0) {
                    this.showPlayer(boardIndex, boardSprite.x)
                }
            }
        }
    }

    protected showPlayer(location: number, x: number): void {
        // Draw player if at this location.
        g_state.Players.forEach((p: Player, index: number) => {
            if (index + 1 != g_state.CurrPlayer && p.Location == location) {
                let s: Sprite = p.Sprite
                s.x = x
                s.bottom = Board.PLAYER_BOTTOM
                s.z = Player.Z
                p.showSprite()
            }
        })
    }

    protected updateLocation(): void {
        // Find the current space sprite.
        let currSprite: Sprite =
            sprites.allOfKind(SpriteKind.BoardSpace).find(
                (value: Sprite, index: number) =>
                    value.data['boardIndex'] == this.currSpace
            )
        if (currSprite == null) {
            // Current location was not found among sprites.
            // Bail.
            return
        }
        if (
            (this.direction >= 0 && currSprite.left + Board.MARGIN >= 80) ||
            (this.direction < 0 && currSprite.right + Board.MARGIN <= 80)
        ) {
            if (this.direction >= 0) {
                this.currSpace++
                if (this.currSpace >= this.board.length) {
                    this.currSpace = 0
                }
            } else {
                this.currSpace--
                if (this.currSpace < 0) {
                    this.currSpace = this.board.length - 1
                }
            }
            this.spacesMoved++
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
        g_state.Board.draw(0)
        currSpace = textsprite.create('0')
        currSpace.left = 0
        currSpace.top = 0
        g_state.Mode = GameMode.BoardTest
    }

    export function update(): void {
        Background.move()
        g_state.Board.move()
        currSpace.text = g_state.Board.CurrSpace.toString()
        currSpace.update()
    }
}
