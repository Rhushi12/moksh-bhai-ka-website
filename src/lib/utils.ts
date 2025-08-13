import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: string | number): string {
  if (typeof price === 'string') {
    // If it's already formatted, return as is
    if (price.includes('$')) {
      return price;
    }
    // Convert string to number
    const numPrice = parseFloat(price.replace(/[$,]/g, ''));
    return formatPrice(numPrice);
  }
  
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(1)}M`;
  } else if (price >= 1000) {
    return `$${(price / 1000).toFixed(0)}K`;
  }
  return `$${price.toLocaleString()}`;
}

/**
 * Generates dynamic filter options based on available diamonds
 * This ensures only filter options that exist in the current diamond collection are shown
 */
export function generateDynamicFilterOptions(diamonds: any[]) {
  if (!diamonds || diamonds.length === 0) {
    return {
      shapes: [],
      colors: [],
      clarities: [],
      cuts: [],
      caratRange: { min: 0, max: 50 },
      priceRange: { min: 0, max: 1000000 },
      growthTypes: [],
      locations: [],
      suppliers: []
    };
  }

  // Extract unique values from diamonds
  const shapes = [...new Set(diamonds.map(d => d.shape).filter(Boolean))].sort();
  const colors = [...new Set(diamonds.map(d => d.color).filter(Boolean))].sort();
  const clarities = [...new Set(diamonds.map(d => d.clarity).filter(Boolean))].sort();
  const cuts = [...new Set(diamonds.map(d => d.cut).filter(Boolean))].sort();
  const growthTypes = [...new Set(diamonds.map(d => d.growth_type).filter(Boolean))].sort();
  const locations = [...new Set(diamonds.map(d => d.location).filter(Boolean))].sort();
  const suppliers = [...new Set(diamonds.map(d => d.supplier).filter(Boolean))].sort();

  // Calculate carat range
  const carats = diamonds.map(d => parseFloat(d.carat)).filter(c => !isNaN(c));
  const caratRange = carats.length > 0 ? {
    min: Math.floor(Math.min(...carats) * 10) / 10,
    max: Math.ceil(Math.max(...carats) * 10) / 10
  } : { min: 0, max: 50 };

  // Calculate price range
  const prices = diamonds.map(d => {
    if (typeof d.price === 'string') {
      return parseFloat(d.price.replace(/[$,]/g, ''));
    }
    return parseFloat(d.price) || 0;
  }).filter(p => !isNaN(p) && p > 0);

  const priceRange = prices.length > 0 ? {
    min: Math.floor(Math.min(...prices) / 1000) * 1000,
    max: Math.ceil(Math.max(...prices) / 1000) * 1000
  } : { min: 0, max: 1000000 };

  return {
    shapes,
    colors,
    clarities,
    cuts,
    caratRange,
    priceRange,
    growthTypes,
    locations,
    suppliers
  };
}

/**
 * Categorizes filter options for better organization
 */
export function categorizeFilterOptions(options: any) {
  // Categorize shapes
  const shapeCategories: Record<string, string[]> = {};
  if (options.shapes.length > 0) {
    const classic = ['Round', 'Princess', 'Emerald', 'Oval'].filter(s => options.shapes.includes(s));
    const fancy = ['Marquise', 'Pear', 'Heart', 'Radiant', 'Asscher', 'Cushion'].filter(s => options.shapes.includes(s));
    const unique = ['Crescent', 'Custom', 'Alphabet'].filter(s => options.shapes.includes(s));
    
    if (classic.length > 0) shapeCategories['Classic'] = classic;
    if (fancy.length > 0) shapeCategories['Fancy'] = fancy;
    if (unique.length > 0) shapeCategories['Unique'] = unique;
    
    // Add uncategorized shapes
    const categorized = [...classic, ...fancy, ...unique];
    const uncategorized = options.shapes.filter(s => !categorized.includes(s));
    if (uncategorized.length > 0) {
      shapeCategories['Other'] = uncategorized;
    }
  }

  // Categorize colors
  const colorCategories: Record<string, string[]> = {};
  if (options.colors.length > 0) {
    const whiteColors = options.colors.filter(c => /^[A-Z]$/.test(c));
    const fancyColors = options.colors.filter(c => c.startsWith('Fancy'));
    
    if (whiteColors.length > 0) {
      const colorless = whiteColors.filter(c => ['D', 'E', 'F'].includes(c));
      const nearColorless = whiteColors.filter(c => ['G', 'H', 'I', 'J'].includes(c));
      const faint = whiteColors.filter(c => ['K', 'L', 'M'].includes(c));
      const veryLight = whiteColors.filter(c => ['N', 'O', 'P', 'Q', 'R'].includes(c));
      const light = whiteColors.filter(c => ['S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'].includes(c));
      
      if (colorless.length > 0) colorCategories['Colorless'] = colorless;
      if (nearColorless.length > 0) colorCategories['Near Colorless'] = nearColorless;
      if (faint.length > 0) colorCategories['Faint'] = faint;
      if (veryLight.length > 0) colorCategories['Very Light'] = veryLight;
      if (light.length > 0) colorCategories['Light'] = light;
    }
    
    if (fancyColors.length > 0) {
      colorCategories['Fancy'] = fancyColors;
    }
  }

  // Categorize clarities
  const clarityCategories: Record<string, string[]> = {};
  if (options.clarities.length > 0) {
    const flawless = options.clarities.filter(c => ['FL', 'IF'].includes(c));
    const vvs = options.clarities.filter(c => c.startsWith('VVS'));
    const vs = options.clarities.filter(c => c.startsWith('VS'));
    const si = options.clarities.filter(c => c.startsWith('SI'));
    const included = options.clarities.filter(c => c.startsWith('I'));
    
    if (flawless.length > 0) clarityCategories['Flawless'] = flawless;
    if (vvs.length > 0) clarityCategories['Very Slightly Included'] = vvs;
    if (vs.length > 0) clarityCategories['Slightly Included'] = vs;
    if (si.length > 0) clarityCategories['Slightly Included'] = [...(clarityCategories['Slightly Included'] || []), ...si];
    if (included.length > 0) clarityCategories['Included'] = included;
  }

  // Categorize cuts
  const cutCategories: Record<string, string[]> = {};
  if (options.cuts.length > 0) {
    const excellent = options.cuts.filter(c => ['Excellent', 'Ideal', 'Super Ideal'].includes(c));
    const veryGood = options.cuts.filter(c => ['Very Good', 'Premium'].includes(c));
    const good = options.cuts.filter(c => ['Good', 'Signature'].includes(c));
    const special = options.cuts.filter(c => ['Hearts and Arrows', '8X', '3X'].includes(c));
    
    if (excellent.length > 0) cutCategories['Excellent'] = excellent;
    if (veryGood.length > 0) cutCategories['Very Good'] = veryGood;
    if (good.length > 0) cutCategories['Good'] = good;
    if (special.length > 0) cutCategories['Special'] = special;
    
    // Add uncategorized cuts
    const categorized = [...excellent, ...veryGood, ...good, ...special];
    const uncategorized = options.cuts.filter(c => !categorized.includes(c));
    if (uncategorized.length > 0) {
      cutCategories['Other'] = uncategorized;
    }
  }

  return {
    shapeCategories,
    colorCategories,
    clarityCategories,
    cutCategories
  };
}
