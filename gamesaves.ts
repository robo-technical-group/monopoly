/**
 * Manage saved games
 */
namespace GameSaves {
    const FILE_PREFIX: string = 'mpy_'

    /**
     * Returns whether any saved games are available.
     */
    export function found(): boolean {
        return settings.list(FILE_PREFIX).length > 0
    }
}