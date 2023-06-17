/**
 * Properties
 */
namespace Properties {
    export enum PropertyType {
        JailCard,
        Standard,
        Transportation,
        Utility,
    }

    export interface Info {
        cost: number
        name: string
        rents: number[]
    }

    export interface State {
        houses: number
        isMortgaged: boolean
        owner: number
    }

    export interface GroupInfo {
        color: number
        houseCost: number
        properties: Info[]
        propertyType: PropertyType
    }

    export interface GroupState {
        canBuild: boolean
        isMonopolyOwned: boolean
        owner: number
        properties: State[]
    }

    export interface Properties {
        info: GroupInfo[]
        state: GroupState[]
    }

    export const COLOR_MORTGAGED: number = Color.White
    export const COLOR_UNOWNED: number = Color.Wine
    export const GROUP_JAIL: number = 10
    export const GROUP_RR: number = 8
    export const GROUP_UTIL: number = 9
    export const PROPERTIES: GroupInfo[][] = [
    [
    // Standard board properties
        // 0 = Property group 1 (Brown properties)
        {
            color: Color.Brown,
            houseCost: 50,
            propertyType: PropertyType.Standard,
            properties: [{
                cost: 60,
                name: 'Mediterranean Avenue',
                rents: [2, 10, 30, 90, 160, 250,],
            }, {
                cost: 60,
                name: 'Baltic Avenue',
                rents: [4, 20, 60, 180, 320, 450,],
            },],
        },
        // 1 = Property group 2 (Light blue properties)
        {
            color: Color.LightBlue,
            houseCost: 50,
            propertyType: PropertyType.Standard,
            properties: [{
                cost: 100,
                name: 'Oriental Avenue',
                rents: [6, 30, 90, 270, 400, 550,],
            }, {
                cost: 100,
                name: 'Vermont Avenue',
                rents: [6, 30, 90, 270, 400, 550,],
            }, {
                cost: 120,
                name: 'Connecticut Avenue',
                rents: [8, 40, 100, 300, 450, 600,],
            },],
        },
        // 2 = Property group 3 (Purple properties)
        {
            color: Color.Purple,
            houseCost: 100,
            propertyType: PropertyType.Standard,
            properties: [{
                cost: 140,
                name: 'Saint Charles Place',
                rents: [10, 50, 150, 450, 625, 750,],
            },  {
                cost: 140,
                name: 'States Avenue',
                rents: [10, 50, 150, 450, 625, 750,],
            }, {
                cost: 160,
                name: 'Virginia Avenue',
                rents: [12, 60, 180, 500, 700, 900,],
            },],
        },
        // 3 = Property group 4 (Orange properties)
        {
            color: Color.Orange,
            houseCost: 100,
            propertyType: PropertyType.Standard,
            properties: [{
                cost: 180,
                name: 'Saint James Avenue',
                rents: [14, 70, 200, 550, 750, 950,],
            }, {
                cost: 180,
                name: 'Tennessee Avenue',
                rents: [14, 70, 200, 550, 750, 950,],
            }, {
                cost: 200,
                name: 'New York Avenue',
                rents: [16, 80, 220, 600, 800, 1000,],
            }],
        },
        // 4 = Property group 5 (Red properties)
        {
            color: Color.Red,
            houseCost: 150,
            propertyType: PropertyType.Standard,
            properties: [{
                cost: 220,
                name: 'Kentucky Avenue',
                rents: [18, 90, 250, 700, 875, 1050,],
            }, {
                cost: 220,
                name: 'Indiana Avenue',
                rents: [18, 90, 250, 700, 875, 1050,],
            }, {
                cost: 240,
                name: 'Illinois Avenue',
                rents: [20, 100, 300, 750, 925, 1100,],
            },],
        },
        // 5 = Property group 6 (Yellow properties)
        {
            color: Color.Yellow,
            houseCost: 150,
            propertyType: PropertyType.Standard,
            properties: [{
                cost: 260,
                name: 'Atlantic Avenue',
                rents: [22, 110, 330, 800, 975, 1150,],
            }, {
                cost: 260,
                name: 'Ventnor Avenue',
                rents: [22, 110, 330, 800, 975, 1150,],
            }, {
                cost: 280,
                name: 'Marvin Gardens',
                rents: [24, 120, 360, 850, 1025, 1200,],
            },],
        },
        // 6 = Property group 7 (Green properties)
        {
            color: Color.BrightGreen,
            houseCost: 200,
            propertyType: PropertyType.Standard,
            properties: [{
                cost: 300,
                name: 'Pacific Avenue',
                rents: [26, 130, 390, 900, 1100, 1275,],
            }, {
                cost: 300,
                name: 'North Carolina Avenue',
                rents: [26, 130, 390, 900, 1100, 1275,],
            }, {
                cost: 320,
                name: 'Pennsylvania Avenue',
                rents: [28, 150, 450, 1000, 1200, 1400,],
            },],
        },
        // 7 = Property group 8 (Royal blue properties)
        {
            color: Color.Blue,
            houseCost: 200,
            propertyType: PropertyType.Standard,
            properties: [{
                cost: 350,
                name: 'Park Place',
                rents: [35, 175, 500, 1100, 1300, 1500,],
            },{
                cost: 400,
                name: 'Boardwalk',
                rents: [50, 200, 600, 1400, 1700, 2000,],
            },],
        },
        // 8 = Transportation properties
        {
            color: Color.White,
            houseCost: 0,
            propertyType: PropertyType.Transportation,
            properties: [{
                cost: 200,
                name: 'Reading Railroad',
                rents: [25, 50, 100, 200],
            }, {
                cost: 200,
                name: 'Pennsylvania Railroad',
                rents: [25, 50, 100, 200],
            }, {
                cost: 200,
                name: 'B & O Railroad',
                rents: [25, 50, 100, 200],
            }, {
                cost: 200,
                name: 'Short Line',
                rents: [25, 50, 100, 200],
            },],
        },
        // 9 = Utility properties
        {
            color: Color.Bone,
            houseCost: 0,
            propertyType: PropertyType.Utility,
            properties: [{
                cost: 150,
                name: 'Electric Company',
                rents: [4, 10],
            }, {
                cost: 150,
                name: 'Water Works',
                rents: [4, 10],
            },],
        },
        // 10 = Get out of jail cards
        {
            color: Color.Aqua,
            houseCost: 0,
            propertyType: PropertyType.JailCard,
            properties: [{
                cost: 0,
                name: 'Get out of jail free!',
                rents: []
            }, {
                cost: 0,
                name: 'Get out of jail free!',
                rents: []
            },]
        }
    ], [
    // Mega board properties
        // 0 = Property group 1 (Brown properties)
        {
            color: Color.Brown,
            houseCost: 50,
            propertyType: PropertyType.Standard,
            properties: [{
                cost: 60,
                name: 'Mediterranean Avenue',
                rents: [2, 10, 30, 90, 160, 250, 750,],
            }, {
                cost: 60,
                name: 'Baltic Avenue',
                rents: [4, 20, 60, 180, 320, 450, 950,],
            }, {
                cost: 60,
                name: 'Arctic Avenue',
                rents: [5, 30, 80, 240, 360, 500, 950,],
            },],
        },
        // 1 = Property group 2 (Light blue properties)
        {
            color: Color.LightBlue,
            houseCost: 50,
            propertyType: PropertyType.Standard,
            properties: [{
                cost: 100,
                name: 'Massachusetts Avenue',
                rents: [6, 30, 90, 270, 400, 550, 1050,],
            }, {
                cost: 100,
                name: 'Oriental Avenue',
                rents: [6, 30, 90, 270, 400, 550, 1050,],
            }, {
                cost: 100,
                name: 'Vermont Avenue',
                rents: [6, 30, 90, 270, 400, 550, 1050,],
            }, {
                cost: 120,
                name: 'Connecticut Avenue',
                rents: [8, 40, 100, 300, 450, 600, 1100,],
            },],
        },
        // 2 = Property group 3 (Purple properties)
        {
            color: Color.Purple,
            houseCost: 100,
            propertyType: PropertyType.Standard,
            properties: [{
                cost: 140,
                name: 'Maryland Avenue',
                rents: [10, 50, 150, 450, 625, 750, 1250,],
            }, {
                cost: 140,
                name: 'Saint Charles Place',
                rents: [10, 50, 150, 450, 625, 750, 1250,],
            }, {
                cost: 140,
                name: 'States Avenue',
                rents: [10, 50, 150, 450, 625, 750, 1250,],
            }, {
                cost: 160,
                name: 'Virginia Avenue',
                rents: [12, 60, 180, 500, 700, 900, 1400,],
            },],
        },
        // 3 = Property group 4 (Orange properties)
        {
            color: Color.Orange,
            houseCost: 100,
            propertyType: PropertyType.Standard,
            properties: [{
                cost: 180,
                name: 'Saint James Avenue',
                rents: [14, 70, 200, 550, 750, 950, 1450,],
            }, {
                cost: 180,
                name: 'Tennessee Avenue',
                rents: [14, 70, 200, 550, 750, 950, 1450,],
            }, {
                cost: 200,
                name: 'New York Avenue',
                rents: [16, 80, 220, 600, 800, 1000, 1500,],
            }, {
                cost: 200,
                name: 'New Jersey Avenue',
                rents: [16, 80, 220, 600, 800, 1000, 1500,],
            }],
        },
        // 4 = Property group 5 (Red properties)
        {
            color: Color.Red,
            houseCost: 150,
            propertyType: PropertyType.Standard,
            properties: [{
                cost: 220,
                name: 'Kentucky Avenue',
                rents: [18, 90, 250, 700, 875, 1050, 2050,],
            }, {
                cost: 220,
                name: 'Indiana Avenue',
                rents: [18, 90, 250, 700, 875, 1050, 2050,],
            }, {
                cost: 240,
                name: 'Illinois Avenue',
                rents: [20, 100, 300, 750, 925, 1100, 2100,],
            }, {
                cost: 240,
                name: 'Michigan Avenue',
                rents: [20, 100, 300, 750, 925, 1100, 2100,],
            },],
        },
        // 5 = Property group 6 (Yellow properties)
        {
            color: Color.Yellow,
            houseCost: 150,
            propertyType: PropertyType.Standard,
            properties: [{
                cost: 260,
                name: 'Atlantic Avenue',
                rents: [22, 110, 330, 800, 975, 1150, 2150,],
            }, {
                cost: 260,
                name: 'Ventnor Avenue',
                rents: [22, 110, 330, 800, 975, 1150, 2150,],
            }, {
                cost: 280,
                name: 'Marvin Gardens',
                rents: [24, 120, 360, 850, 1025, 1200, 2200,],
            }, {
                cost: 280,
                name: 'California Avenue',
                rents: [24, 120, 360, 850, 1025, 1200, 2200,],
            },],
        },
        // 6 = Property group 7 (Green properties)
        {
            color: Color.BrightGreen,
            houseCost: 200,
            propertyType: PropertyType.Standard,
            properties: [{
                cost: 300,
                name: 'Pacific Avenue',
                rents: [26, 130, 390, 900, 1100, 1275, 2275,],
            }, {
                cost: 300,
                name: 'South Carolina Avenue',
                rents: [26, 130, 390, 900, 1100, 1275, 2275,],
            }, {
                cost: 300,
                name: 'North Carolina Avenue',
                rents: [26, 130, 390, 900, 1100, 1275, 2275,],
            }, {
                cost: 320,
                name: 'Pennsylvania Avenue',
                rents: [28, 150, 450, 1000, 1200, 1400, 2400,],
            },],
        },
        // 7 = Property group 8 (Royal blue properties)
        {
            color: Color.Blue,
            houseCost: 200,
            propertyType: PropertyType.Standard,
            properties: [{
                cost: 350,
                name: 'Florida Avenue',
                rents: [35, 175, 500, 1100, 1300, 1500, 2500,],
            }, {
                cost: 350,
                name: 'Park Place',
                rents: [35, 175, 500, 1100, 1300, 1500, 2500,],
            }, {
                cost: 400,
                name: 'Boardwalk',
                rents: [50, 200, 600, 1400, 1700, 2000, 3000,],
            },],
        },
        // 8 = Transportation properties
        {
            color: Color.White,
            houseCost: 0,
            propertyType: PropertyType.Transportation,
            properties: [{
                cost: 200,
                name: 'Reading Railroad',
                rents: [25, 50, 100, 200,],
            }, {
                cost: 200,
                name: 'Pennsylvania Railroad',
                rents: [25, 50, 100, 200,],
            }, {
                cost: 200,
                name: 'B & O Railroad',
                rents: [25, 50, 100, 200,],
            }, {
                cost: 200,
                name: 'Short Line',
                rents: [25, 50, 100, 200,],
            },],
        },
        // 9 = Utility properties
        {
            color: Color.Bone,
            houseCost: 0,
            propertyType: PropertyType.Utility,
            properties: [{
                cost: 150,
                name: 'Gas Company',
                rents: [4, 10, 20,],
            }, {
                cost: 150,
                name: 'Electric Company',
                rents: [4, 10, 20,],
            }, {
                cost: 150,
                name: 'Water Works',
                rents: [4, 10, 20,],
            },],
        },
        // 10 = Get out of jail cards
        {
            color: Color.Aqua,
            houseCost: 0,
            propertyType: PropertyType.JailCard,
            properties: [{
                cost: 0,
                name: 'Get out of jail free! (Chance)',
                rents: []
            }, {
                cost: 0,
                name: 'Get out of jail free! (Community Chest)',
                rents: []
            },]
        }
    ],
    ]

    export function buildFromState(state: any, board: number): GroupState[] {
        let toReturn: GroupState[] = buildDefaultState(board)
        if (!Array.isArray(state)) {
            return toReturn
        }
        for (let index: number = 0; index < (<GroupState[]>state).length; index++) {
            if (index >= toReturn.length) {
                break
            }
            let pgs: GroupState = (<GroupState[]>state)[index]
            if (pgs.properties == undefined || pgs.properties == null || !Array.isArray(pgs.properties)) {
                continue
            }
            for (let propIndex: number = 0; propIndex < pgs.properties.length; propIndex++) {
                if (propIndex >= toReturn[index].properties.length) {
                    break
                }
                let ps: State = pgs.properties[propIndex]
                if (typeof ps.houses == 'number') {
                    toReturn[index].properties[propIndex].houses = ps.houses
                }
                if (typeof ps.isMortgaged == 'boolean') {
                    toReturn[index].properties[propIndex].isMortgaged = ps.isMortgaged
                }
                if (typeof ps.owner == 'number') {
                    toReturn[index].properties[propIndex].owner = ps.owner
                }
            }
        }
        updatePropertyGroups(toReturn, board)
        return toReturn
    }

    function buildDefaultState(board: number = 0): GroupState[] {
        let toReturn: GroupState[] = []
        for (let pgIndex: number = 0; pgIndex < PROPERTIES[board].length; pgIndex++) {
            let pgs: GroupState = {
                canBuild: false,
                isMonopolyOwned: false,
                owner: 0,
                properties: [],
            }
            for (let propIndex: number = 0; propIndex < PROPERTIES[board][pgIndex].properties.length; propIndex++) {
                let ps: State = {
                    houses: 0,
                    isMortgaged: false,
                    owner: 0,
                }
                pgs.properties.push(ps)
            }
            toReturn.push(pgs)
        }
        return toReturn
    }

    export function calculateRent(groupInfo: GroupInfo, groupState: GroupState,
    propInfo: Info, propState: State, board: number): number {
        let owed: number = 0
        let count: number = groupState.properties.filter((value: Properties.State, index: number) =>
            value.owner == propState.owner).length
        switch (groupInfo.propertyType) {
            case Properties.PropertyType.Transportation:
                owed = propInfo.rents[count - 1]
                if (propState.houses > 0) {
                    owed *= 2
                }
                break

            case Properties.PropertyType.Utility:
                /**
                 * Return multiplier only.
                 */
                owed = propInfo.rents[count - 1]
                break

            default:
                if (board == 0) {
                    if (groupState.isMonopolyOwned && propState.houses == 0) {
                        owed = propInfo.rents[0] * 2
                    } else {
                        owed = propInfo.rents[propState.houses]
                    }
                } else {
                    if (propState.houses == 0) {
                        if (groupState.isMonopolyOwned) {
                            owed = propInfo.rents[0] * 3
                        } else if (groupState.canBuild) {
                            owed = propInfo.rents[0] * 2
                        } else {
                            owed = propInfo.rents[0]
                        }
                    } else {
                        owed = propInfo.rents[propState.houses]
                    }
                }
        }
        return owed
    }

    export function updatePropertyGroup(state: GroupState, index: number, board: number): void {
        if (board > 0) {
            let numOwned: number[] = []
            for (let i = 0; i <= g_state.NumPlayers; i++) {
                numOwned.push(0)
            }
            state.properties.forEach((state: State, index: number) => {
                numOwned[state.owner]++
            })
            let ownerCount: number
            let owner: number
            let buildCount: number = state.properties.length - 1
            ownerCount = numOwned.filter((value: number, index: number): boolean => {
                let toReturn: boolean = (value >= buildCount)
                if (toReturn) {
                    owner = index
                }
                return toReturn
            }).length
            if (ownerCount > 0 && owner > 0) {
                state.owner = owner
                state.canBuild = true
                if (numOwned[owner] == state.properties.length) {
                    state.isMonopolyOwned = true
                }
            }
            if (index == GROUP_RR && g_state.Depots) {
                state.canBuild = true
            }
        } else {
            let firstProp: State = state.properties[0]
            if (firstProp.owner > 0) {
                let sameOwners: number = state.properties.filter(
                    (value: State, index: number) => value.owner == firstProp.owner
                ).length
                if (sameOwners == state.properties.length) {
                    state.canBuild = true
                    state.isMonopolyOwned = true
                    state.owner = firstProp.owner
                } else {
                    state.isMonopolyOwned = false
                    state.owner = 0
                }
            } else {
                state.isMonopolyOwned = false
                state.owner = 0
            }
        }
    }

    export function updatePropertyGroups(states: GroupState[], board: number): void {
        states.forEach((pgs: GroupState, index: number) =>
            updatePropertyGroup(pgs, index, board))
    }
}
