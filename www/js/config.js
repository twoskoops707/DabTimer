const CONFIG = {
    materials: {
        quartz: { 
            thermalConductivity: 1.4,
            specificHeat: 0.75,
            thickness: {
                "1mm": { baseHeat: 15, baseCool: 25 },
                "2mm": { baseHeat: 25, baseCool: 40 },
                "4mm": { baseHeat: 40, baseCool: 60 }
            }
        },
        titanium: { 
            thermalConductivity: 22,
            specificHeat: 0.52,
            baseHeat: 20,
            baseCool: 30
        },
        ceramic: { 
            thermalConductivity: 1.5,
            specificHeat: 0.85,
            baseHeat: 45,
            baseCool: 65
        }
    },
    heatingElements: {
        butane_torch: { 
            modifier: 1.0,
            maxTemp: 1430,
            efficiency: 0.85
        },
        bic_lighter: { 
            modifier: 2.2,
            maxTemp: 850,
            efficiency: 0.45
        },
        acetylene_torch: { 
            modifier: 0.6,
            maxTemp: 2530,
            efficiency: 0.95
        }
    },
    concentrates: {
        shatter: { 
            idealTemp: '315-400°F',
            heatModifier: 1.0,
            description: 'A translucent, glass-like extract that fractures easily. High THC content with preserved terpene profile.',
            thc: '70-90%',
            terpenes: 'Pinene, Myrcene, Limonene'
        },
        wax: { 
            idealTemp: '350-450°F',
            heatModifier: 1.1,
            description: 'Opaque, butter-like consistency. Rich in terpenes with balanced flavor and potency.',
            thc: '60-80%',
            terpenes: 'Caryophyllene, Linalool, Humulene'
        },
        resin: { 
            idealTemp: '400-500°F',
            heatModifier: 1.2,
            description: 'Full-spectrum extract from fresh frozen material. Exceptional terpene preservation and flavor complexity.',
            thc: '65-85%',
            terpenes: 'Terpinolene, Ocimene, Terpineol'
        },
        rosin: { 
            idealTemp: '380-450°F',
            heatModifier: 0.9,
            description: 'Solventless extract using heat and pressure. Purest form with complete cannabinoid profile.',
            thc: '60-80%',
            terpenes: 'Myrcene, Pinene, Caryophyllene'
        },
        budder: { 
            idealTemp: '375-425°F',
            heatModifier: 1.0,
            description: 'Whipped consistency with creamy texture. High terpene content and smooth vaporization.',
            thc: '70-85%',
            terpenes: 'Limonene, Pinene, Myrcene'
        }
    },
    rigTypes: {
        mini_rig: { heatModifier: 0.8, coolModifier: 0.9 },
        standard_rig: { heatModifier: 1.0, coolModifier: 1.0 },
        recycler: { heatModifier: 1.1, coolModifier: 1.2 }
    }
};
