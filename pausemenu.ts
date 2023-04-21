// Refer to pxt-common-packages/libs/game/systemmenu.ts
namespace PauseMenu {
    enum Items {
        SaveGame = 0,
        VolumeDown,
        VolumeUp,
        BrightnessDown,
        BrightnessUp,
        Stats,
        Console,
        Sleep,
        Close,
    }

    const FILENAME_PROMPT: string = 'Enter filename.'
    const GAME_SAVE_CONFIRM = 'Game saved!'

    const MENU_TEXT: string[] = [
        'Save game',
        'Volume down',
        'Volume up',
        'Brightness up',
        'Brightness down',
        'Show stats',
        'Show console',
        'Sleep',
        'Close',
    ]

    const MENU_TEXT_ALTERNATE: string[] = [
        '',
        '',
        '',
        '',
        '',
        'Hide stats',
        'Hide console',
        '',
        'Close',
    ]

    const MENU_TITLE: string = 'Pause Menu'
    const VOLUMES: number[] = [0, 32, 64, 96, 128, 160, 192, 224, 255]

    export let isMenuShowing: boolean = false
    let isShowingStats: boolean = false
    let isShowingConsole: boolean = false
    let pauseMenu: miniMenu.MenuSprite = null
    let previousMode: GameMode = GameMode.NotReady
    let volume: number = 4

    function changeBrightness(delta: number): void {
        if ((delta < 0 && screen.brightness() > 0) ||
            (delta > 0 && screen.brightness() < 100)) {
            screen.setBrightness(screen.brightness() + delta)
            updateBrightness()
        }
    }

    function changeVolume(delta: number): void {
        if (delta < 0 && volume > 0) {
            volume--
            updateVolume()
            playVolume()
        }
        if (delta > 0 && volume < VOLUMES.length - 1) {
            volume++
            updateVolume()
            playVolume()
        }
    }

    function playVolume(): void {
        music.playTone(440, 500)
    }

    function processSelection(selection: string, selectedIndex: number): void {
        switch (selectedIndex) {
            case Items.VolumeDown:
                changeVolume(-1)
                break

            case Items.VolumeUp:
                changeVolume(1)
                break

            case Items.Stats:
                toggleStats()
                break

            case Items.Console:
                toggleConsole()
                break

            case Items.Sleep:
                sleep()
                break

            case Items.Close:
                release()
                break

            case Items.SaveGame:
                saveGame()
                break
        }
    }

    export function release(): void {
        pauseMenu.close()
        isMenuShowing = false
        g_state.Mode = previousMode
    }

    function saveGame(): void {
        let filename: string = game.askForString(FILENAME_PROMPT)
        g_state.save(filename)
        game.splash(GAME_SAVE_CONFIRM)
    }

    export function show(): void {
        previousMode = g_state.Mode
        g_state.Mode = GameMode.PauseMenu
        let menuItems: miniMenu.MenuItem[] = []
        for (let t of MENU_TEXT) {
            menuItems.push(miniMenu.createMenuItem(t))
        }
        pauseMenu = miniMenu.createMenuFromArray(menuItems)
        pauseMenu.setTitle(MENU_TITLE)
        pauseMenu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Width, 140)
        pauseMenu.setMenuStyleProperty(miniMenu.MenuStyleProperty.Height, 100)
        pauseMenu.setStyleProperty(miniMenu.StyleKind.Title,
            miniMenu.StyleProperty.Foreground, Color.White)
        pauseMenu.setStyleProperty(miniMenu.StyleKind.Title,
            miniMenu.StyleProperty.Background, Color.Wine)
        pauseMenu.top = 10
        pauseMenu.left = 10
        isShowingConsole = game.consoleOverlay.isVisible()
        isShowingStats = game.stats
        updateBrightness()
        updateConsole()
        updateStats()
        updateVolume()
        pauseMenu.onButtonPressed(controller.A, processSelection)
        isMenuShowing = true
    }

    function sleep(): void {
        power.deepSleep()
    }

    function toggleConsole(): void {
        isShowingConsole = !isShowingConsole
        game.consoleOverlay.setVisible(isShowingConsole)
        updateConsole()
    }

    function toggleStats(): void {
        isShowingStats = !isShowingStats
        game.stats = isShowingStats
        updateStats()
    }

    function updateBrightness(): void {
        pauseMenu.items[Items.BrightnessDown].text = MENU_TEXT[Items.BrightnessDown] +
            ' (' + screen.brightness() + ')'
        pauseMenu.items[Items.BrightnessUp].text = MENU_TEXT[Items.BrightnessUp] +
            ' (' + screen.brightness() + ')'
    }

    function updateConsole(): void {
        pauseMenu.items[Items.Console].text = isShowingConsole ?
            MENU_TEXT_ALTERNATE[Items.Console] :
            MENU_TEXT[Items.Console]
    }

    function updateStats(): void {
        pauseMenu.items[Items.Stats].text = isShowingStats ?
            MENU_TEXT_ALTERNATE[Items.Stats] :
            MENU_TEXT[Items.Stats]
        if (!isShowingStats && control.EventContext.onStats) {
            control.EventContext.onStats('');
        }
    }

    function updateVolume(): void {
        let v: number = VOLUMES[volume]
        music.setVolume(v)
        pauseMenu.items[Items.VolumeDown].text = MENU_TEXT[Items.VolumeDown] +
            ' (' + v + ')'
        pauseMenu.items[Items.VolumeUp].text = MENU_TEXT[Items.VolumeUp] +
            ' (' + v + ')'
    }
}
