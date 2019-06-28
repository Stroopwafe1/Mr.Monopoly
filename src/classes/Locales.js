const USDefault = {
    start: 'Start',
    brown1: 'Mediterranian Avenue',
    brown2: 'Baltic Avenue',
    cyan1: 'Oriental Avenue',
    cyan2: 'Vermont Avenue',
    cyan3: 'Connecticut Avenue',
    purple1: 'St. Charles Place',
    purple2: 'States Avenue',
    purple3: 'Virginia Avenue',
    orange1: 'St. James Place',
    orange2: 'Tennessee Avenue',
    orange3: 'New York Avenue',
    red1: 'Kentucky Avenue',
    red2: 'Indiana Avenue',
    red3: 'Illinois Avenue',
    yellow1: 'Atlantic Avenue',
    yellow2: 'Vermont Avenue',
    yellow3: 'Marvin Gardens',
    green1: 'Pacific Avenue',
    green2: 'North Carolina Avenue',
    green3: 'Pennsylvania Avenue',
    blue1: 'Park Place',
    blue2: 'Boardwalk',
    railroad1: 'Reading Railroad',
    railroad2: 'Pennsylvania Railroad',
    railroad3: 'B. & O. Railroad',
    railroad4: 'Short Line',
    communityChest: 'Community Chest',
    chance: 'Chance',
    taxIncome: 'Income Tax',
    taxLuxury: 'Luxury Tax',
    jail: 'Jail',
    jailForced: 'Go To Jail',
    utility1: 'Electric Company',
    utility2: 'Waterworks',
    freeParking: 'Free Parking',

    //Chance Cards
    cardsChanceStart: 'Advance to "Go", (Collect 200)',
    cardsChanceRed3: 'Advance to Illinois Avenue',
    cardsChancePurple1: 'Advance to St. Charles Place',
    cardsChanceUtility: 'Advance token to nearest Utility. If unowned, you may buy it from the Bank. If owned, throw dice and pay owner a total 10 times the amount thrown.',
    cardsChanceRailroadNearest: 'Advance token to the nearest Railroad and pay owner twice the rental to which he/she {he} is otherwise entitled. If Railroad is unowned, you may buy it from the Bank.',
    cardsChanceDividend: 'Bank pays you dividend of 50',
    cardsChanceJail: 'Get out of Jail Free. This card may be kept until needed, or traded/sold.',
    cardsChance3Spaces: 'Go Back 3 Spaces.',
    cardsChanceJailForce: 'Go directly to Jail. Do not pass GO, do not collect 200.',
    cardsChanceRepairs: 'Make general repairs on all your property: For each house pay 25, For each hotel 100',
    cardsChanceSpeeding: 'Speeding fine, 15',
    cardsChanceRailroad1: 'Take a trip to Reading Railroad. If you pass Go, collect 200.',
    cardsChanceBlue2: 'Take a walk on the Boardwalk. Advance token to Boardwalk.',
    cardsChanceChairman: 'You have been elected Chairman of the Board. Pay each player 50.',
    cardsChanceLoan: 'Your building and loan matures. Receive 150.',
    cardsChanceCrossword: 'You have won a crossword competition. Collect 100.',

    //Community Chest Cards
    cardsCCStart: 'Advance to "Go". (Collect 200)',
    cardsCCBankError: 'Bank error in your favor. Collect 200.',
    cardsCCDoctor: 'Doctor\'s fees. Pay 50.',
    cardsCCStock: 'From sale of stock you get 50.',
    cardsCCJail: 'Get Out of Jail Free. This card may be kept until needed or sold/traded.',
    cardsCCJailForce: 'Go to Jail. Go directly to jail. Do not pass Go, Do not collect 200.',
    cardsCCOperaNight: 'Grand Opera Night. Collect 50 from every player for opening night seats.',
    cardsCCHoliday: 'Holiday Fund matures. Receive 100.',
    cardsCCTaxRefund: 'Income tax refund. Collect 20.',
    cardsCCBirthday: 'It is your birthday. Collect 10 from every player.',
    cardsCCInsuranceLife: 'Life insurance matures – Collect 100',
    cardsCCHospital: 'Hospital Fees. Pay 100.',
    cardsCCSchool: 'School fees. Pay 50.',
    cardsCCConsultancy: 'Receive 25 consultancy fee.',
    cardsCCRepairs: 'You are assessed for street repairs: Pay 40 per house and 115 per hotel you own.',
    cardsCCBeauty: 'You have won second prize in a beauty contest. Collect 10.',
    cardsCCInherit: 'You inherit 100.'
}
module.exports = {
    locales: [{USDefault}],
    /**
     * 
     * @param {String} string1 
     * @param {String} string2
     * @returns {this} 
     */
    getLocale(string1, string2) {
        for(let i of this.locales) {
            let varName = Object.keys(i)[0];
            if(varName.substr(0, 2).toUpperCase() === string1.toUpperCase() && varName.substr(2).toUpperCase() === string2.toUpperCase())
                return i[varName];
        }
    }
}