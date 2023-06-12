namespace SpriteKind {
    export const ActionMenu = SpriteKind.create()
}

abstract class ActionMenu {
    protected done: boolean
    protected message: string

    constructor(msg: string) {
        this.message = msg
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
        let priorMode: GameMode = g_state.Mode
        g_state.Mode = GameMode.NotReady
        g_state.hidePlayers()
        Background.hide()
        let p: Player = g_state.getCurrPlayer()
        p.showSprite(10, 40)
        let msgSprite: TextSprite = textsprite.create(this.message, Color.Transparent, Color.White)
        msgSprite.setMaxFontHeight(8)
        msgSprite.left = 30
        msgSprite.top = 32
        msgSprite.setKind(SpriteKind.ActionMenu)
        p.Status = PlayerStatus.ActionMenu
        g_state.Mode = priorMode
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
}

class InJailActionMenu extends ActionMenu {
    public show(): void {
        super.show()
        let p: Player = g_state.getCurrPlayer()
        let pId: number = g_state.CurrPlayer
        this.showAction(ControllerButton.A, Strings.ACTION_ROLL)
        if (p.Bank >= GameSettings.JAIL_FEE) {
            let msg: string = Strings.ACTION_PAY + ' '
            if (GameSettings.CURRENCY_IS_PREFIX) {
                msg += GameSettings.CURRENCY_SYMBOL + GameSettings.JAIL_FEE
            } else {
                msg += GameSettings.JAIL_FEE + GameSettings.CURRENCY_SYMBOL
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
            p.startRoll()
            p.Status = PlayerStatus.RollingInJail
        }
        this.done = true
    }

    public actionB(): void {
        let p: Player = g_state.getCurrPlayer()
        if (p.Bank >= GameSettings.JAIL_FEE) {
            p.changeBank(0 - GameSettings.JAIL_FEE)
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