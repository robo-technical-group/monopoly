namespace SpriteKind {
    export const ActionMenu = SpriteKind.create()
}

abstract class ActionMenu {
    public static readonly PLAYER_SPRITE_X: number = 10
    public static readonly PLAYER_SPRITE_Y: number = 40
    
    // protected done: boolean
    protected message: string
    protected pId: number
    protected player: Player

    constructor() {
        this.message = ''
        this.pId = g_state.CurrPlayer
        this.player = g_state.getCurrPlayer()
    }

    /**
     * Public properties
     */
    /*
    public get Done(): boolean {
        return this.done
    }
    */

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
        if (this.message.length > 0) {
            let i: Image = image.create(160, 8)
            i.fill(this.player.Color)
            i.print(this.message, 1, 0, Color.Black, image.font8)
            let msgSprite: Sprite = sprites.create(i, SpriteKind.ActionMenu)
            msgSprite.left = 0
            msgSprite.top = 32
        }
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
        msgSprite.setKind(SpriteKind.ActionMenu)
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
        this.message = 'Test action menu!'
        super.show()
        this.showAction(ControllerButton.A, 'Button A')
        this.showAction(ControllerButton.B, 'Button B')
        this.showAction(ControllerButton.Down, 'Down Button')
        this.showAction(ControllerButton.Left, 'Left Button')
        this.showAction(ControllerButton.Right, 'Right Button')
        this.showAction(ControllerButton.Up, 'Up Button')
    }

    public actionA(): void {
        game.splashForPlayer(this.pId, 'You pressed A!')
    }

    public actionB(): void {
        game.splashForPlayer(this.pId, 'You pressed B!')
    }

    public actionDown(): void {
        game.splashForPlayer(this.pId, 'You pressed Down!')
    }

    public actionLeft(): void {
        game.splashForPlayer(this.pId, 'You pressed Left!')
    }

    public actionRight(): void {
        game.splashForPlayer(this.pId, 'You pressed Right!')
    }

    public actionUp(): void {
        game.splashForPlayer(this.pId, 'You pressed Up!')
    }
}

class InJailActionMenu extends ActionMenu {
    protected canPay: boolean
    protected hasJailCard: boolean

    public show(): void {
        this.message = Strings.MENU_IN_JAIL_TITLE
            .replace('%NAME%', this.player.Name)
            .replace('%TURN%', (this.player.TurnCount + 1).toString())
        super.show()
        this.showAction(ControllerButton.A, Strings.MENU_ROLL)
        if (this.player.Bank >= GameSettings.JAIL_FEE) {
            this.canPay = true
            let msg: string = Strings.ACTION_PAY + ' '
            if (GameSettings.CURRENCY_IS_PREFIX) {
                msg += GameSettings.CURRENCY_SYMBOL + GameSettings.JAIL_FEE
            } else {
                msg += GameSettings.JAIL_FEE + GameSettings.CURRENCY_SYMBOL
            }
            this.showAction(ControllerButton.B, msg)
        }
        this.hasJailCard = false
        g_state.Properties.state[Properties.GROUP_JAIL].properties.forEach(
            (value: Properties.State, index: number) => {
                if (value.owner == this.pId) {
                    this.hasJailCard = true
                }
            }
        )
        if (this.hasJailCard) {
            this.showAction(ControllerButton.Down, Strings.ACTION_USE_JAIL_CARD)
        }
    }

    public actionA(): void {
        if (this.player.JailTurns < 4) {
            g_state.actionStartRollInJail()
        }
    }

    public actionB(): void {
        if (this.player.Bank >= GameSettings.JAIL_FEE) {
            g_state.actionPayJailFee()
        }
    }

    public actionDown(): void {
        if (this.hasJailCard) {
            g_state.actionUseJailCard()
        }
    }
}

class StartTurnActionMenu extends ActionMenu {
    protected hasProperties: boolean

    public show(): void {
        if (this.player.TurnCount == 0) {
            this.message = Strings.MENU_START_TURN_TITLE
                .replace('%NAME%', this.player.Name)
        } else {
            this.message = Strings.MENU_START_TURN_TITLE_MULTI_ROLL
                .replace('%NAME%', this.player.Name)
                .replace('%TURN%', (this.player.TurnCount + 1).toString())
        }
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