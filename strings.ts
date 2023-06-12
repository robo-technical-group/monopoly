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
    // Strings used in actions.ts
    export const ACTION_IN_JAIL: string = 'In jail (Turn %TURN%)'
    export const ACTION_IN_JAIL_MUST_PAY: string = 'Time to leave jail!'
    export const ACTION_PAY: string = 'Pay'
    export const ACTION_ROLL: string = 'Roll'
    export const ACTION_USE_JAIL_CARD: string = 'Get out free'

    // Strings used in avatars.ts
    export const AVATAR_CHANGE_IMAGE_TEXT: string = 'Left/Right = Change image'
    export const AVATAR_SELECT_TEXT: string = 'A = Select Avatar'

    // Strings used in firstroll.ts
    export const FIRSTROLL_HEADING_TEXT: string = 'Highest roll goes first'
    export const FIRSTROLL_FOOTER_TEXT: string = 'Players: Press A to roll!'
    export const FIRSTROLL_START: string = "%PLAYERNAME%: You're first!"
}