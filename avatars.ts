/**
 * Avatars
 */
namespace SpriteKind {
    export const Avatar = SpriteKind.create()
}

namespace Avatar {
    export interface Avatar {
        name: string
        frontImage: Image
        backImage: Image
        leftImage: Image
        rightImage: Image // If null, then flip leftImage.
        leftAnim: Image[]
        rightAnim: Image[] // If empty, then flip images in leftAnim.
    }

    interface AvatarSelection {
        currPlayer: number // Between 1 and 4
        selectedAvatar: number
        header: TextSprite
        footer1: TextSprite
        footer2: TextSprite
        left: Sprite
        front: Sprite
        right: Sprite
    }

    export const AVATARS: Avatar[] = [
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
        }, {
            name: 'Castle princess',
            frontImage: sprites.castle.princess2Front,
            backImage: sprites.castle.princess2Back,
            leftImage: sprites.castle.princess2Left1,
            rightImage: sprites.castle.princess2Right1,
            leftAnim: [sprites.castle.princess2Left1,
                sprites.castle.princess2Left2,],
            rightAnim: [sprites.castle.princess2Right1,
                sprites.castle.princess2Right2,],
        }, {
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
        }, {
            name: 'Cat',
            frontImage: sprites.builtin.cat0,
            backImage: sprites.builtin.cat0,
            leftImage: sprites.builtin.cat0,
            rightImage: null,
            leftAnim: [sprites.builtin.cat0,
                sprites.builtin.cat1,
                sprites.builtin.cat2],
            rightAnim: [],
        }, {
            name: 'Dog',
            frontImage: sprites.builtin.dog0,
            backImage: sprites.builtin.dog0,
            leftImage: sprites.builtin.dog0,
            rightImage: null,
            leftAnim: [sprites.builtin.dog0,
                sprites.builtin.dog1,
                sprites.builtin.dog2,],
            rightAnim: [],
        }, {
            name: 'Forest monkey',
            frontImage: sprites.builtin.forestMonkey0,
            backImage: sprites.builtin.forestMonkey0,
            leftImage: sprites.builtin.forestMonkey0,
            rightImage: null,
            leftAnim: [sprites.builtin.forestMonkey0,
                sprites.builtin.forestMonkey1,
                sprites.builtin.forestMonkey2,
                sprites.builtin.forestMonkey3,
                sprites.builtin.forestMonkey4],
            rightAnim: [],
        }, {
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
        }, {
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
        }, {
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
        }, {
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

    export let selection: AvatarSelection = {
        currPlayer: 0,
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

    export function initSelection(): void {
        selection.currPlayer = 1
        selection.selectedAvatar = 0
        selection.header = textsprite.create(' ', 0, Color.Yellow)
        selection.header.setPosition(80, 4)
        selection.footer1 = textsprite.create('Left/Right = Change image', 0, Color.White)
        selection.footer1.setPosition(80, 105)
        selection.footer2 = textsprite.create('Press A to select', 0, Color.White)
        selection.footer2.setPosition(80, 115)
        selection.left = sprites.create(img`.`, SpriteKind.Avatar)
        selection.left.setPosition(40, 60)
        selection.left.setFlag(SpriteFlag.Ghost, true)
        selection.front = sprites.create(img`.`, SpriteKind.Avatar)
        selection.front.setPosition(80, 60)
        selection.front.setFlag(SpriteFlag.Ghost, true)
        selection.right = sprites.create(img`.`, SpriteKind.Avatar)
        selection.right.setPosition(120, 60)
        selection.right.setFlag(SpriteFlag.Ghost, true)
        scene.setBackgroundColor(Color.Wine)
    }

    /**
     * @param direction Positive or negative number to indicate direction to move through array.
     */
    export function showNext(direction: number): void {
        let taken: boolean = true
        while (taken) {
            if (direction > 0) {
                selection.selectedAvatar++
            } else {
                selection.selectedAvatar--
            }
            if (selection.selectedAvatar < 0) {
                selection.selectedAvatar = AVATARS.length - 1
            }
            if (selection.selectedAvatar >= AVATARS.length) {
                selection.selectedAvatar = 0
            }
            taken = false
            for (let p of g_state.Players) {
                if (p.Avatar == selection.selectedAvatar) {
                    taken = true
                    break
                }
            }
        }
        updateImages()
    }

    export function startSelection(): void {
        g_state.Mode = GameMode.NotReady
        GameSettings.settingsScreens.release()
        fixAvatars()
        g_state.Mode = GameMode.AvatarSelect
        initSelection()
        g_state.Players[selection.currPlayer - 1].promptForName()
        updateSelection()
    }

    export function select(): void {
        g_state.Players[selection.currPlayer - 1].Avatar = selection.selectedAvatar
        if (selection.currPlayer < g_state.NumPlayers) {
            selection.currPlayer++
            g_state.Players[selection.currPlayer - 1].promptForName()
            updateSelection()
        } else {
            selection.header.destroy()
            selection.footer1.destroy()
            selection.footer2.destroy()
            selection.left.destroy()
            selection.front.destroy()
            selection.right.destroy()
            FirstRoll.setup()
        }
    }

    function updateSelection(): void {
        selection.header.setText(g_state.Players[selection.currPlayer - 1].Name
            + ' select avatar.')
        selection.header.setPosition(80, 4)
        selection.selectedAvatar = -1
        showNext(1)
    }

    function updateImages(): void {
        animation.runImageAnimation(selection.left,
            AVATARS[selection.selectedAvatar].leftAnim, 100, true)
        selection.front.setImage(AVATARS[selection.selectedAvatar].frontImage)
        if (AVATARS[selection.selectedAvatar].rightAnim.length == 0) {
            let a: Image[] = []
            for (let i of AVATARS[selection.selectedAvatar].leftAnim) {
                let right_i: Image = i.clone()
                right_i.flipX()
                a.push(right_i)
                animation.runImageAnimation(selection.right, a, 500, true)
            }
        } else {
            animation.runImageAnimation(selection.right,
                AVATARS[selection.selectedAvatar].rightAnim, 100, true)
        }
    }
}

/**
 * Avatar testing
 */
namespace AvatarTest {
    let test: Sprite = null
    let index: number = 0
    let animate: boolean = true

    export function showNextAvatarTest(): void {
        index++
        if (index >= Avatar.AVATARS.length) {
            index = 0
        }
        showTestAvatar()
    }

    export function showTestAvatar(): void {
        animation.stopAnimation(animation.AnimationTypes.All, test)
        test.setImage(Avatar.AVATARS[index].frontImage)
    }

    export function showTestAvatarBack(): void {
        animation.stopAnimation(animation.AnimationTypes.All, test)
        test.setImage(Avatar.AVATARS[index].backImage)
    }

    export function showTestAvatarFront(): void {
        animation.stopAnimation(animation.AnimationTypes.All, test)
        test.setImage(Avatar.AVATARS[index].frontImage)
    }

    export function showTestAvatarLeft(): void {
        animation.stopAnimation(animation.AnimationTypes.All, test)
        if (animate) {
            animation.runImageAnimation(test, Avatar.AVATARS[index].leftAnim, 500, true)
        } else {
            test.setImage(Avatar.AVATARS[index].leftImage)
        }
    }

    export function showTestAvatarRight(): void {
        animation.stopAnimation(animation.AnimationTypes.All, test)
        if (animate) {
            if (Avatar.AVATARS[index].rightAnim.length == 0) {
                let a: Image[] = []
                for (let i of Avatar.AVATARS[index].leftAnim) {
                    let right_i = i.clone()
                    right_i.flipX()
                    a.push(right_i)
                }
                animation.runImageAnimation(test, a, 500, true)
            } else {
                animation.runImageAnimation(test, Avatar.AVATARS[index].rightAnim, 500, true)
            }
        } else {
            if (Avatar.AVATARS[index].rightImage == null) {
                test.setImage(Avatar.AVATARS[index].leftImage.clone())
                test.image.flipX()
            } else {
                test.setImage(Avatar.AVATARS[index].rightImage)
            }
        }
    }

    export function startAvatarTest(): void {
        g_state.Mode = GameMode.NotReady
        test = sprites.create(img`.`, SpriteKind.Player)
        showTestAvatar()
        g_state.Mode = GameMode.AvatarTest
    }

    export function toggleAvatarTestAnims(): void {
        animate = !animate
        showTestAvatar()
    }
}
