/**
 * Strings used within game.
 * Additional locations for strings to customize or localize game:
 * - attract.ts
 * - cards.ts (Text of cards)
 * - pausemenu.ts
 * - properties.ts
 * - settings.ts
 * - state.ts > namespace GameStateUI
 * - taxes.ts
 */
namespace Strings {
    // Strings used in actionqueue.ts
    export const ACTION_IN_JAIL_MUST_PAY: string = 'Time to leave jail!'
    export const ACTION_IN_JAIL_DOUBLES: string = 'Doubles! Get out of jail free!'
    export const ACTION_PAY: string = 'Pay'
    export const ACTION_ROLLED: string = 'You rolled a %ROLL%!'
    export const ACTION_SPEED_DIE: string = 'Speed die'
    export const ACTION_SPEED_DIE_BUS: string = 'Speed die: Bus'
    export const ACTION_SPEED_DIE_MONOPOLY: string = 'Speed die: Monopoly'
    export const ACTION_SPEED_DIE_MONOPOLY_NO_SPACE: string =
        "No unowned properties and no unmortgaged properties. You're safe!"
    export const ACTION_USE_JAIL_CARD: string = 'Get out free'

    // Strings used in avatars.ts
    export const AVATAR_CHANGE_IMAGE_TEXT: string = 'Left/Right = Change image'
    export const AVATAR_SELECT_TEXT: string = 'A = Select Avatar'

    // Strings used in firstroll.ts
    export const FIRSTROLL_HEADING_TEXT: string = 'Highest roll goes first'
    export const FIRSTROLL_FOOTER_TEXT: string = 'Players: Press A to roll!'
    export const FIRSTROLL_START: string = "%PLAYERNAME%: You're first!"

    // Strings used in actionmenus.ts and in state.ts when displaying menus.
    export const MENU_BANKRUPT: string = 'Go bankrupt'
    export const MENU_BUILD: string = 'Build/Mortgage'
    export const MENU_IN_JAIL_TITLE: string = '%NAME%: In jail (Turn %TURN%)'
    export const MENU_PROPERTY_AUCTION: string = 'Start auction'
    export const MENU_PROPERTY_BUY: string = 'Buy for M%COST%'
    export const MENU_PROPERTY_NO_MONEY: string = "You do not have enough money to purchase %PROPERTY%. We're going to auction!"
    export const MENU_START_TURN_TITLE: string = '%NAME%: Your turn!'
    export const MENU_START_TURN_TITLE_MULTI_ROLL: string = "%NAME%: Roll again! (#%TURN%)"
    export const MENU_ROLL: string = 'Roll'
    export const MENU_TRADE: string = 'Trade'

    // Strings used in player.ts
    // Test mode automatic purchase message.
    export const PLAYER_BUY_PROPERTY: string = '%PLAYERNAME% is buying %PROPERTY% for M%VALUE%.'
    export const PLAYER_TO_JAIL: string = 'Off to jail for you!'
    export const PLAYER_SKIPPED: string = "%PLAYERNAME%: You're skipping this turn. Take a break!"
    export const PLAYER_OWES_PLAYER: string = "You owe M%AMOUNT% to %OTHERPLAYER%."
    export const PLAYER_PAY_TAX: string = 'You owe %TAXNAME% of M%TAXAMOUNT%.'
    export const PLAYER_PROPERTY_OWNED: string = "You're home!"

    // Board spaces
    export const BOARD_BUS: string = 'No bus tickets remaining.'
    export const BOARD_FREE_PARKING: string = 'Free parking'
    export const BOARD_FREE_SPACE: string = 'Free time! Take a break!'
    export const BOARD_GO: string = "It's the Go! space"
    export const BOARD_JAIL: string = 'Jail - Just visiting!'
}