namespace SpriteKind {
    export const ActionMenu = SpriteKind.create()
}

abstract class ActionMenu {
    public static readonly PLAYER_SPRITE_X: number = 10
    public static readonly PLAYER_SPRITE_Y: number = 40
    
    protected done: boolean
    protected message: string
    protected pId: number
    protected player: Player

    constructor(msg: string) {
        this.message = msg
        this.pId = g_state.CurrPlayer
        this.player = g_state.getCurrPlayer()
    }

    /**
     * Public properties
     */
    public get Done(): boolean {
        return this.done
    }

    /**
     * Public methods
     */
    public handleButton(button: ControllerButton): void {
        switch (button) {
            case ControllerButton.A:
                this.actionA()
                break

            case ControllerButton.B:
                this.actionB()
                break

            case ControllerButton.Down:
                this.actionDown()
                break

            case ControllerButton.Left:
                this.actionLeft()
                break

            case ControllerButton.Right:
                this.actionRight()
                break

            case ControllerButton.Up:
                this.actionUp()
                break

        }
    }

    public hide(): void {
        sprites.allOfKind(SpriteKind.ActionMenu).forEach((value: Sprite, index: number) =>
            value.destroy())
    }

    public show(): void {
        let msgSprite: TextSprite = textsprite.create(this.message, Color.Transparent, Color.White)
        msgSprite.setMaxFontHeight(8)
        msgSprite.left = 0
        msgSprite.top = 32
        msgSprite.setKind(SpriteKind.ActionMenu)
    }

    public actionA(): void { }
    public actionB(): void { }
    public actionDown(): void { }
    public actionLeft(): void { }
    public actionRight(): void { }
    public actionUp(): void { }

    /**
     * Protected methods
     */
    protected showAction(button: ControllerButton, msg: string) {
        let msgSprite: TextSprite = textsprite.create(msg, Color.Transparent, Color.Yellow)
        msgSprite.setMaxFontHeight(5)
        let buttonSprite: Sprite = sprites.create(img`.`, SpriteKind.ActionMenu)
        buttonSprite.setFlag(SpriteFlag.Ghost, true)
        switch (button) {
            case ControllerButton.A:
                buttonSprite.setImage(assets.animation`actionmenubuttons`[0])
                buttonSprite.right = 158
                buttonSprite.y = 48
                msgSprite.y = 48
                msgSprite.right = 148
                break

            case ControllerButton.B:
                buttonSprite.setImage(assets.animation`actionmenubuttons`[1])
                buttonSprite.left = 98
                buttonSprite.y = 70
                msgSprite.y = 70
                msgSprite.left = 108
                break

            case ControllerButton.Down:
                buttonSprite.setImage(assets.animation`actionmenubuttons`[2])
                buttonSprite.x = 55
                buttonSprite.top = 60
                msgSprite.x = 55
                msgSprite.bottom = 75
                break

            case ControllerButton.Left:
                buttonSprite.setImage(assets.animation`actionmenubuttons`[3])
                buttonSprite.right = 55
                buttonSprite.y = 60
                msgSprite.y = 60
                msgSprite.right = 45
                break

            case ControllerButton.Right:
                buttonSprite.setImage(assets.animation`actionmenubuttons`[4])
                buttonSprite.left = 55
                buttonSprite.y = 60
                msgSprite.y = 60
                msgSprite.left = 68
                break

            case ControllerButton.Up:
                buttonSprite.setImage(assets.animation`actionmenubuttons`[5])
                buttonSprite.x = 55
                buttonSprite.bottom = 60
                msgSprite.x = 55
                msgSprite.bottom = 50
                break
        }
    }
}

class TestActionMenu extends ActionMenu {
    public show(): void {
        super.show()
        this.showAction(ControllerButton.A, 'Button A')
        this.showAction(ControllerButton.B, 'Button B')
        this.showAction(ControllerButton.Down, 'Down Button')
        this.showAction(ControllerButton.Left, 'Left Button')
        this.showAction(ControllerButton.Right, 'Right Button')
        this.showAction(ControllerButton.Up, 'Up Button')
    }

    public actionA(): void {
        let pId: number = g_state.CurrPlayer
        game.splashForPlayer(pId, 'You pressed A!')
    }

    public actionB(): void {
        let pId: number = g_state.CurrPlayer
        game.splashForPlayer(pId, 'You pressed B!')
    }

    public actionDown(): void {
        let pId: number = g_state.CurrPlayer
        game.splashForPlayer(pId, 'You pressed Down!')
    }

    public actionLeft(): void {
        let pId: number = g_state.CurrPlayer
        game.splashForPlayer(pId, 'You pressed Left!')
    }

    public actionRight(): void {
        let pId: number = g_state.CurrPlayer
        game.splashForPlayer(pId, 'You pressed Right!')
    }

    public actionUp(): void {
        let pId: number = g_state.CurrPlayer
        game.splashForPlayer(pId, 'You pressed Up!')
    }
}

class InJailActionMenu extends ActionMenu {
    public show(): void {
        super.show()
        let p: Player = g_state.getCurrPlayer()
        let pId: number = g_state.CurrPlayer
        this.showAction(ControllerButton.A, Strings.MENU_ROLL)
        if (p.Bank >= 50 /*GameSettings.JAIL_FEE*/) {
            let msg: string = Strings.ACTION_PAY + ' '
            if (GameSettings.CURRENCY_IS_PREFIX) {
                msg += GameSettings.CURRENCY_SYMBOL + 50 /*GameSettings.JAIL_FEE*/
            } else {
                msg += 50 /*GameSettings.JAIL_FEE*/ + GameSettings.CURRENCY_SYMBOL
            }
            this.showAction(ControllerButton.B, msg)
        }
        let hasJailCard: boolean = false
        g_state.Properties.state[Properties.GROUP_JAIL].properties.forEach(
            (value: Properties.State, index: number) => {
                if (value.owner == pId) {
                    hasJailCard = true
                }
            }
        )
        if (hasJailCard) {
            this.showAction(ControllerButton.Down, Strings.ACTION_USE_JAIL_CARD)
        }
    }

    public actionA(): void {
        let p: Player = g_state.getCurrPlayer()
        if (p.JailTurns < 4) {
            g_state.Board.draw(p.Location)
            g_state.Board.Direction = 1
            p.startRoll(g_state.SpeedDie ? 3 : 2)
            // p.Status = PlayerStatus.RollingInJail
        }
        this.done = true
    }

    public actionB(): void {
        let p: Player = g_state.getCurrPlayer()
        if (p.Bank >= 50 /*GameSettings.JAIL_FEE*/) {
            p.changeBank(0 - 50 /*GameSettings.JAIL_FEE*/)
            p.InJail = false
            this.done = true
        }
    }

    public actionDown(): void {
        let p: Player = g_state.getCurrPlayer()
        let pId: number = g_state.CurrPlayer
        let cards: Properties.State[] =
            g_state.Properties.state[Properties.GROUP_JAIL].properties.filter(
                (value: Properties.State, index: number) =>
                    value.owner == pId
            )
        if (cards.length > 0) {
            cards[0].owner = 0
            this.done = true
        }
    }
}

class StartTurnActionMenu extends ActionMenu {
    protected hasProperties: boolean

    public show(): void {
        super.show()
        this.showAction(ControllerButton.A, Strings.MENU_ROLL)
        this.showAction(ControllerButton.Down, Strings.MENU_BANKRUPT)
        this.hasProperties = false
        for (let gs of g_state.Properties.state) {
            for (let s of gs.properties) {
                if (s.owner == this.pId) {
                    this.hasProperties = true
                    break
                }
            }
        }
        if (this.hasProperties) {
            this.showAction(ControllerButton.B, Strings.MENU_BUILD)
        }
        if (this.hasProperties || this.player.Bank > 0) {
            this.showAction(ControllerButton.Up, Strings.MENU_TRADE)
        }
    }

    public actionA(): void {
        g_state.actionStartRoll()
    }

    public actionB(): void {
        if (this.hasProperties) {
            game.splashForPlayer(this.pId, 'Build/Mortgage not yet implemented.')
        }
    }

    public actionDown(): void {
        game.splashForPlayer(this.pId, 'Bankrupt not yet implemented.')
    }

    public actionUp(): void {
        if (this.hasProperties || this.player.Bank > 0) {
            game.splashForPlayer(this.pId, 'Trading has not yet been implemented.')
        }
    }
}

class UnownedPropertyActionMenu extends ActionMenu {
    public show(): void {
        super.show()
        this.showAction(ControllerButton.A, Strings.MENU_PROPERTY_BUY)
        this.showAction(ControllerButton.B, Strings.MENU_PROPERTY_AUCTION)
    }
}

namespace ActionMenuTests {
    export function setup() {
        Tests.startJailTest()
        g_state.testMode = false
    }
}