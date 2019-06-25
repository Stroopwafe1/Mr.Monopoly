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
    cardsChance: [{
            text: 'Advance to "Go". (Collect $200)',
            type: 'TELEPORT'
        },
        {
            text: 'Advance to Illinois Ave. {Avenue}. If you pass Go, collect $200.',
            type: 'TELEPORT'
        },
        {

        }
    ]
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
            console.log(`varName: ${varName}\tString1: ${string1}\tString2: ${string2}`);
            if(varName.substr(0, 2).toUpperCase() === string1.toUpperCase() && varName.substr(2).toUpperCase() === string2.toUpperCase())
                return i[varName];
        }
    }
}