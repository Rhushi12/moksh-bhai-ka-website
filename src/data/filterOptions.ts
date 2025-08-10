// Diamond shape options
export const DIAMOND_SHAPES = [
  'Round',
  'Princess',
  'Marquise',
  'Emerald',
  'Pear',
  'Oval',
  'Heart',
  'Radiant',
  'Asscher',
  'Cushion',
  'Crescent',
  'Custom',
  'Alphabet',
  'Trillion',
  'Baguette',
  'Bullet',
  'Cabochon',
  'Carre',
  'Colette',
  'Crown',
  'Diamond',
  'Fancy',
  'Hexagon',
  'Kite',
  'Lozenge',
  'Octagon',
  'Pentagon',
  'Rose',
  'Square',
  'Triangle',
  'Trapezoid'
];

// Color options for white diamonds
export const WHITE_COLORS = [
  'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
];

// Fancy color options
export const FANCY_COLORS = [
  'Fancy Yellow',
  'Fancy Pink',
  'Fancy Blue',
  'Fancy Green',
  'Fancy Purple',
  'Fancy Orange',
  'Fancy Brown',
  'Fancy Red',
  'Fancy Gray',
  'Fancy Black',
  'Fancy White',
  'Fancy Champagne',
  'Fancy Cognac'
];

// Clarity options
export const CLARITY_OPTIONS = [
  'FL',    // Flawless
  'IF',    // Internally Flawless
  'VVS1',  // Very Very Slightly Included 1
  'VVS2',  // Very Very Slightly Included 2
  'VS1',   // Very Slightly Included 1
  'VS2',   // Very Slightly Included 2
  'SI1',   // Slightly Included 1
  'SI2',   // Slightly Included 2
  'SI3',   // Slightly Included 3
  'I1',    // Included 1
  'I2',    // Included 2
  'I3'     // Included 3
];

// Cut options
export const CUT_OPTIONS = [
  'Excellent',
  'Very Good',
  'Good',
  'Fair',
  'Poor',
  'Hearts and Arrows',
  '8X',
  '3X',
  'Ideal',
  'Super Ideal',
  'Premium',
  'Signature'
];

// Polish options
export const POLISH_OPTIONS = [
  'Excellent',
  'Very Good',
  'Good',
  'Fair',
  'Poor'
];

// Symmetry options
export const SYMMETRY_OPTIONS = [
  'Excellent',
  'Very Good',
  'Good',
  'Fair',
  'Poor'
];

// Growth type options
export const GROWTH_TYPE_OPTIONS = [
  'Natural',
  'Lab Grown',
  'CVD',
  'HPHT',
  'Mixed'
];

// Location options
export const LOCATION_OPTIONS = [
  'Antwerp, Belgium',
  'Mumbai, India',
  'New York, USA',
  'Tel Aviv, Israel',
  'Hong Kong',
  'Dubai, UAE',
  'London, UK',
  'Zurich, Switzerland',
  'Geneva, Switzerland',
  'Amsterdam, Netherlands',
  'Bangkok, Thailand',
  'Singapore',
  'Tokyo, Japan',
  'Sydney, Australia',
  'Toronto, Canada',
  'Vancouver, Canada',
  'Los Angeles, USA',
  'Chicago, USA',
  'Miami, USA',
  'Las Vegas, USA'
];

// Supplier options
export const SUPPLIER_OPTIONS = [
  'De Beers',
  'Alrosa',
  'Rio Tinto',
  'Petra Diamonds',
  'Lucara Diamond',
  'Dominion Diamond',
  'Stornoway Diamond',
  'Mountain Province Diamonds',
  'Firestone Diamonds',
  'Gem Diamonds',
  'Diamond Corp',
  'Trans Hex',
  'Namakwa Diamonds',
  'Diamond Fields',
  'Shore Gold',
  'North Arrow Minerals',
  'Kennady Diamonds',
  'Arctic Star Exploration',
  'North Arrow Minerals',
  'Kennady Diamonds'
];

// Carat range presets
export const CARAT_RANGE_PRESETS = [
  { label: 'Under 1 carat', min: 0, max: 1 },
  { label: '1-2 carats', min: 1, max: 2 },
  { label: '2-3 carats', min: 2, max: 3 },
  { label: '3-5 carats', min: 3, max: 5 },
  { label: '5-10 carats', min: 5, max: 10 },
  { label: 'Over 10 carats', min: 10, max: 50 }
];

// Price range presets
export const PRICE_RANGE_PRESETS = [
  { label: 'Under $1,000', min: 0, max: 1000 },
  { label: '$1,000 - $5,000', min: 1000, max: 5000 },
  { label: '$5,000 - $10,000', min: 5000, max: 10000 },
  { label: '$10,000 - $25,000', min: 10000, max: 25000 },
  { label: '$25,000 - $50,000', min: 25000, max: 50000 },
  { label: '$50,000 - $100,000', min: 50000, max: 100000 },
  { label: 'Over $100,000', min: 100000, max: 1000000 }
];

// Shape categories for better organization
export const SHAPE_CATEGORIES = {
  'Classic': ['Round', 'Princess', 'Emerald', 'Oval'],
  'Fancy': ['Marquise', 'Pear', 'Heart', 'Radiant', 'Asscher', 'Cushion'],
  'Unique': ['Crescent', 'Custom', 'Alphabet', 'Trillion', 'Baguette'],
  'Modern': ['Bullet', 'Cabochon', 'Carre', 'Colette', 'Crown'],
  'Geometric': ['Diamond', 'Fancy', 'Hexagon', 'Kite', 'Lozenge', 'Octagon', 'Pentagon', 'Square', 'Triangle', 'Trapezoid']
};

// Color categories
export const COLOR_CATEGORIES = {
  'Colorless': ['D', 'E', 'F'],
  'Near Colorless': ['G', 'H', 'I', 'J'],
  'Faint': ['K', 'L', 'M'],
  'Very Light': ['N', 'O', 'P', 'Q', 'R'],
  'Light': ['S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
  'Fancy': FANCY_COLORS
};

// Clarity categories
export const CLARITY_CATEGORIES = {
  'Flawless': ['FL', 'IF'],
  'Very Slightly Included': ['VVS1', 'VVS2'],
  'Slightly Included': ['VS1', 'VS2'],
  'Included': ['SI1', 'SI2', 'SI3', 'I1', 'I2', 'I3']
};

// Cut categories
export const CUT_CATEGORIES = {
  'Excellent': ['Excellent', 'Ideal', 'Super Ideal'],
  'Very Good': ['Very Good', 'Premium'],
  'Good': ['Good', 'Signature'],
  'Fair': ['Fair'],
  'Poor': ['Poor'],
  'Special': ['Hearts and Arrows', '8X', '3X']
}; 