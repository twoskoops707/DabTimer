// Scientific calculations for dab timing (1mm thickness)
function calculateHeatTime(material, heater, concentrate) {
    const baseTimes = {
        quartz: { 
            shatter: 20, wax: 22, resin: 25, rosin: 23, 
            budder: 21, diamonds: 26, sauce: 24, crumble: 22
        },
        titanium: { 
            shatter: 15, wax: 17, resin: 20, rosin: 18,
            budder: 16, diamonds: 21, sauce: 19, crumble: 17
        },
        ceramic: { 
            shatter: 30, wax: 32, resin: 35, rosin: 33,
            budder: 31, diamonds: 36, sauce: 34, crumble: 32
        }
    };
    
    const heaterModifiers = {
        torch: 1.0,
        lighter: 1.8,    // Less efficient
        enail: 0.7,      // More efficient
        ebanger: 0.8     // More efficient
    };
    
    const baseTime = baseTimes[material]?.[concentrate] || 20;
    const modifier = heaterModifiers[heater] || 1.0;
    
    return Math.round(baseTime * modifier);
}

function calculateCoolTime(material, heatTime) {
    const coolMultipliers = {
        quartz: 1.3,     // Quartz cools faster
        titanium: 2.0,   // Titanium holds heat longer
        ceramic: 1.5     // Ceramic holds heat moderately
    };
    
    const multiplier = coolMultipliers[material] || 1.5;
    return Math.round(heatTime * multiplier);
}
