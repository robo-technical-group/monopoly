/**
 * Avatars
 */
namespace SpriteKind {
    export const Avatar = SpriteKind.create()
}

interface Avatar {
    name: string
    frontImage: Image
    backImage: Image
    leftImage: Image
    rightImage: Image // If null, then flip leftImage.
    leftAnim: Image[]
    rightAnim: Image[] // If empty, then flip images in leftAnim.
}

interface AvatarSelection {
    currPlayer: number
    selectedAvatar: number
    header: TextSprite
    footer1: TextSprite
    footer2: TextSprite
    left: Sprite
    front: Sprite
    right: Sprite
}

const AVATARS: Avatar[] = [
    {
        name: 'Castle warrior',
        frontImage: sprites.castle.heroWalkFront1,
        backImage: sprites.castle.heroWalkBack1,
        leftImage: sprites.castle.heroWalkSideLeft1,
        rightImage: sprites.castle.heroWalkSideRight1,
        leftAnim: [sprites.castle.heroWalkSideLeft1,
            sprites.castle.heroWalkSideLeft2,
            sprites.castle.heroWalkSideLeft3,
            sprites.castle.heroWalkSideLeft4,],
        rightAnim: [sprites.castle.heroWalkSideRight1,
            sprites.castle.heroWalkSideRight2,
            sprites.castle.heroWalkSideRight3,
            sprites.castle.heroWalkSideRight4,],
    },
    {
        name: 'Castle princess',
        frontImage: sprites.castle.princess2Front,
        backImage: sprites.castle.princess2Back,
        leftImage: sprites.castle.princess2Left1,
        rightImage: sprites.castle.princess2Right1,
        leftAnim: [sprites.castle.princess2Left1,
            sprites.castle.princess2Left2,],
        rightAnim: [sprites.castle.princess2Right1,
            sprites.castle.princess2Right2,],
    },
    {
        name: 'Angel fish',
        frontImage: sprites.builtin.angelFish0,
        backImage: sprites.builtin.angelFish0,
        leftImage: sprites.builtin.angelFish0,
        rightImage: null,
        leftAnim: [sprites.builtin.angelFish0,
            sprites.builtin.angelFish1,
            sprites.builtin.angelFish2,
            sprites.builtin.angelFish3,],
        rightAnim: [],
    },
    {
        name: 'Cat',
        frontImage: sprites.builtin.cat0,
        backImage: sprites.builtin.cat0,
        leftImage: sprites.builtin.cat0,
        rightImage: null,
        leftAnim: [sprites.builtin.cat0,
            sprites.builtin.cat1,
            sprites.builtin.cat2],
        rightAnim: [],
    },
    {
        name: 'Dog',
        frontImage: sprites.builtin.dog0,
        backImage: sprites.builtin.dog0,
        leftImage: sprites.builtin.dog0,
        rightImage: null,
        leftAnim: [sprites.builtin.dog0,
            sprites.builtin.dog1,
            sprites.builtin.dog2,],
        rightAnim: [],
    },
    {
        name: 'Blue car',
        frontImage: sprites.vehicle.carBlueFront,
        backImage: sprites.vehicle.carBlueBack,
        leftImage: sprites.vehicle.carBlueLeft,
        rightImage: sprites.vehicle.carBlueRight,
        leftAnim: [sprites.vehicle.car20,
            sprites.vehicle.car21,
            sprites.vehicle.car22,
            sprites.vehicle.car23,],
        rightAnim: [],
    },
    {
        name: 'Red car',
        frontImage: sprites.vehicle.carRedFront,
        backImage: sprites.vehicle.carRedBack,
        leftImage: sprites.vehicle.carRedLeft,
        rightImage: sprites.vehicle.carRedRight,
        leftAnim: [sprites.vehicle.car30,
            sprites.vehicle.car31,
            sprites.vehicle.car32,
            sprites.vehicle.car33,],
        rightAnim: [],
    },
    {
        name: 'Airplane',
        frontImage: sprites.vehicle.plane0,
        backImage: sprites.vehicle.plane0,
        leftImage: sprites.vehicle.plane0,
        rightImage: null,
        leftAnim: [sprites.vehicle.plane0,
            sprites.vehicle.plane1,
            sprites.vehicle.plane2,
            sprites.vehicle.plane3,
            sprites.vehicle.plane4,
            sprites.vehicle.plane5,],
        rightAnim: [],
    },
    {
        name: 'Baby kaiju',
        frontImage: sprites.kaiju.kaijuBabyWalk0,
        backImage: sprites.kaiju.kaijuBabyWalk0,
        leftImage: sprites.kaiju.kaijuBabyWalk0,
        rightImage: null,
        leftAnim: [sprites.kaiju.kaijuBabyWalk0,
            sprites.kaiju.kaijuBabyWalk1,
            sprites.kaiju.kaijuBabyWalk2,
            sprites.kaiju.kaijuBabyWalk3,
            sprites.kaiju.kaijuBabyWalk4,
            sprites.kaiju.kaijuBabyWalk5,],
        rightAnim: [],
    }
]

/**
 * Avatar selection
 */

let g_avatarSelection: AvatarSelection = {
    currPlayer: -1,
    selectedAvatar: -1,
    header: null,
    footer1: null,
    footer2: null,
    left: null,
    front: null,
    right: null,
}

function fixAvatars(): void {
    for (let a of AVATARS) {
        if (a.rightImage == null) {
            a.rightImage = a.leftImage.clone()
            a.rightImage.flipX()
        }

        if (a.rightAnim.length == 0) {
            for (let i of a.leftAnim) {
                let right_i: Image = i.clone()
                right_i.flipX()
                a.rightAnim.push(right_i)
            }
        }
    }
}

function getPlayerInfo() {
    let n: string = game.askPlayerForString(g_avatarSelection.currPlayer + 1,
        'Player ' + (g_avatarSelection.currPlayer + 1) + ' enter name.')
    g_players[g_avatarSelection.currPlayer].Name = n
    updateAvatarSelection()
}

function initAvatarSelection() {
    g_avatarSelection.currPlayer = 0
    g_avatarSelection.selectedAvatar = 0
    g_avatarSelection.header = textsprite.create(' ', 0, Color.Yellow)
    g_avatarSelection.header.setPosition(80, 4)
    g_avatarSelection.footer1 = textsprite.create('Left/Right = Change image', 0, Color.White)
    g_avatarSelection.footer1.setPosition(80, 105)
    g_avatarSelection.footer2 = textsprite.create('Press A to select', 0, Color.White)
    g_avatarSelection.footer2.setPosition(80, 115)
    g_avatarSelection.left = sprites.create(img`.`, SpriteKind.Avatar)
    g_avatarSelection.left.setPosition(40, 60)
    g_avatarSelection.left.setFlag(SpriteFlag.Ghost, true)
    g_avatarSelection.front = sprites.create(img`.`, SpriteKind.Avatar)
    g_avatarSelection.front.setPosition(80, 60)
    g_avatarSelection.front.setFlag(SpriteFlag.Ghost, true)
    g_avatarSelection.right = sprites.create(img`.`, SpriteKind.Avatar)
    g_avatarSelection.right.setPosition(120, 60)
    g_avatarSelection.right.setFlag(SpriteFlag.Ghost, true)
    scene.setBackgroundColor(Color.Wine)
}

/**
 * @param direction Positive or negative number to indicate direction to move through array.
 */
function showNextAvatar(direction: number) {
    let taken: boolean = true
    while (taken) {
        if (direction > 0) {
            g_avatarSelection.selectedAvatar++
        } else {
            g_avatarSelection.selectedAvatar--
        }
        if (g_avatarSelection.selectedAvatar < 0) {
            g_avatarSelection.selectedAvatar = AVATARS.length - 1
        }
        if (g_avatarSelection.selectedAvatar >= AVATARS.length) {
            g_avatarSelection.selectedAvatar = 0
        }
        taken = false
        for (let p of g_players) {
            if (p.Avatar == g_avatarSelection.selectedAvatar) {
                taken = true
                break
            }
        }
    }
    updateAvatarImages()
}

function startAvatarSelection() {
    g_gameMode = GameMode.NotReady
    GameSettings.settingsScreens.release()
    fixAvatars()
    g_gameMode = GameMode.AvatarSelect
    initAvatarSelection()
    getPlayerInfo()
}

function selectAvatar() {
    g_players[g_avatarSelection.currPlayer].Avatar = g_avatarSelection.selectedAvatar
    if (g_avatarSelection.currPlayer + 1 <= GameSettings.settings.numPlayers - 1) {
        g_avatarSelection.currPlayer++
        getPlayerInfo()
    } else {
        g_avatarSelection.header.destroy()
        g_avatarSelection.footer1.destroy()
        g_avatarSelection.footer2.destroy()
        g_avatarSelection.left.destroy()
        g_avatarSelection.front.destroy()
        g_avatarSelection.right.destroy()
        FirstRoll.setup()
    }
}

function updateAvatarSelection() {
    g_avatarSelection.header.setText(g_players[g_avatarSelection.currPlayer].Name
        + ' select avatar.')
    g_avatarSelection.header.setPosition(80, 4)
    g_avatarSelection.selectedAvatar = -1
    showNextAvatar(1)
}

function updateAvatarImages() {
    animation.runImageAnimation(g_avatarSelection.left,
        AVATARS[g_avatarSelection.selectedAvatar].leftAnim, 100, true)
    g_avatarSelection.front.setImage(AVATARS[g_avatarSelection.selectedAvatar].frontImage)
    if (AVATARS[g_avatarSelection.selectedAvatar].rightAnim.length == 0) {
        let a: Image[] = []
        for (let i of AVATARS[g_avatarSelection.selectedAvatar].leftAnim) {
            let right_i: Image = i.clone()
            right_i.flipX()
            a.push(right_i)
            animation.runImageAnimation(g_avatarSelection.right, a, 500, true)
        }
    } else {
        animation.runImageAnimation(g_avatarSelection.right,
            AVATARS[g_avatarSelection.selectedAvatar].rightAnim, 100, true)
    }
}

/**
 * Avatar testing
 */
let g_avatarTest: Sprite = null
let g_avatarIndex: number = 0
let g_testAnimate: boolean = true

function showNextAvatarTest(): void {
    g_avatarIndex++
    if (g_avatarIndex >= AVATARS.length) {
        g_avatarIndex = 0
    }
    showTestAvatar()
}

function showTestAvatar(): void {
    animation.stopAnimation(animation.AnimationTypes.All, g_avatarTest)
    g_avatarTest.setImage(AVATARS[g_avatarIndex].frontImage)
}

function showTestAvatarBack(): void {
    animation.stopAnimation(animation.AnimationTypes.All, g_avatarTest)
    g_avatarTest.setImage(AVATARS[g_avatarIndex].backImage)
}

function showTestAvatarFront(): void {
    animation.stopAnimation(animation.AnimationTypes.All, g_avatarTest)
    g_avatarTest.setImage(AVATARS[g_avatarIndex].frontImage)
}

function showTestAvatarLeft(): void {
    animation.stopAnimation(animation.AnimationTypes.All, g_avatarTest)
    if (g_testAnimate) {
        animation.runImageAnimation(g_avatarTest, AVATARS[g_avatarIndex].leftAnim, 500, true)
    } else {
        g_avatarTest.setImage(AVATARS[g_avatarIndex].leftImage)
    }
}

function showTestAvatarRight(): void {
    animation.stopAnimation(animation.AnimationTypes.All, g_avatarTest)
    if (g_testAnimate) {
        if (AVATARS[g_avatarIndex].rightAnim.length == 0) {
            let a: Image[] = []
            for (let i of AVATARS[g_avatarIndex].leftAnim) {
                let right_i = i.clone()
                right_i.flipX()
                a.push(right_i)
            }
            animation.runImageAnimation(g_avatarTest, a, 500, true)
        } else {
            animation.runImageAnimation(g_avatarTest, AVATARS[g_avatarIndex].rightAnim, 500, true)
        }
    } else {
        if (AVATARS[g_avatarIndex].rightImage == null) {
            g_avatarTest.setImage(AVATARS[g_avatarIndex].leftImage.clone())
            g_avatarTest.image.flipX()
        } else {
            g_avatarTest.setImage(AVATARS[g_avatarIndex].rightImage)
        }
    }
}

function startAvatarTest(): void {
    g_gameMode = GameMode.NotReady
    g_avatarTest = sprites.create(img`.`, SpriteKind.Player)
    showTestAvatar()
    g_gameMode = GameMode.AvatarTest
}

function toggleAvatarTestAnims(): void {
    g_testAnimate = !g_testAnimate
    showTestAvatar()
}
