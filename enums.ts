/**
 * Enumerations
 */
// Standard palette
enum Color {
    Transparent, // 0
    White, // 1 = RGB(255, 255, 255)
    Red, // 2 = RGB(255, 33, 33)
    Pink, // 3 = RGB(255, 147, 196)
    Orange, // 4 = RGB(255, 129, 53)
    Yellow, // 5 = RGB(255, 246, 9)
    Aqua, // 6 = RGB(36, 156, 163)
    BrightGreen, // 7 = RGB(120, 220, 82)
    Blue, // 8 = RGB(0, 63, 173)
    LightBlue, // 9 = RGB(135, 242, 255)
    Purple, // 10 = RGB(142, 46, 196)
    RoseBouquet, // 11 = RGB(164, 131, 159)
    Wine, // 12 = RGB(92, 64, 108)
    Bone, // 13 = RGB(229, 205, 196)
    Brown, // 14 = RGB(145, 70, 61)
    Black // 15 = RGB(0, 0, 0)
}   // enum Color

enum ControllerSetting {
    Single,
    Multiple
}

enum DiceOrientation {
    None,
    Horizontal,
    Vertical,
}

enum DiceSkin {
    White = 0,
    Yellow = 1,
    Orange = 2,
}

enum GameMode {
    NotReady,
    PauseMenu,
    Attract,
    Settings,
    AvatarSelect,
    FirstRoll,
    Main,
    TurnEnded,
    AvatarTest,
    DiceTest,
    SpeedDieTest,
    BoardTest,
}   // GameMode

enum PlayerAction {
    StartTurn,
    
    DrawCard,
    GoToJail,
    MoveForCard,
    MoveForRoll,
    MoveForTriples,
    MoveToLocation,
    Moving,
    NeedMoney,
    PayMoney,
    ProcessCard,
    ProcessMove,
    ProcessRoll,
    ProcessRollInJail,
    ProcessSpeedDie,
    ReceiveMoney,
    Rolling,
    WaitingForAction,
}
