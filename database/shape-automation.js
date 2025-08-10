const fs = require('fs');
const path = require('path');

/**
 * Diamond Shape Automation System
 * This system automatically categorizes diamonds by shape and provides filtering functionality
 */

class ShapeAutomation {
  constructor() {
    this.databasePath = path.join(__dirname, 'diamonds.json');
    this.shapesPath = path.join(__dirname, 'shapes.json');
    
    // Ensure shapes directory exists
    this.ensureShapesDirectory();
  }

  /**
   * Ensure shapes directory exists
   */
  ensureShapesDirectory() {
    const shapesDir = path.join(__dirname, 'shapes');
    if (!fs.existsSync(shapesDir)) {
      fs.mkdirSync(shapesDir, { recursive: true });
      console.log('Created shapes directory');
    }
  }

  /**
   * Get all available shapes from the database
   */
  getAvailableShapes() {
    try {
      const database = this.loadDatabase();
      const shapes = [...new Set(database.diamonds.map(d => d.shape))];
      return shapes.sort();
    } catch (error) {
      console.error('Error getting available shapes:', error);
      return [];
    }
  }

  /**
   * Get diamonds by shape
   */
  getDiamondsByShape(shape) {
    try {
      const database = this.loadDatabase();
      return database.diamonds.filter(d => d.shape === shape);
    } catch (error) {
      console.error('Error getting diamonds by shape:', error);
      return [];
    }
  }

  /**
   * Get shape statistics
   */
  getShapeStatistics() {
    try {
      const database = this.loadDatabase();
      const shapeStats = {};
      
      database.diamonds.forEach(diamond => {
        if (!shapeStats[diamond.shape]) {
          shapeStats[diamond.shape] = {
            count: 0,
            diamonds: [],
            bestsellerCount: 0,
            totalValue: 0
          };
        }
        
        shapeStats[diamond.shape].count++;
        shapeStats[diamond.shape].diamonds.push(diamond);
        
        if (diamond.bestseller) {
          shapeStats[diamond.shape].bestsellerCount++;
        }
        
        // Calculate total value (remove $ and commas, then sum)
        if (diamond.price) {
          const value = parseFloat(diamond.price.replace(/[$,]/g, ''));
          if (!isNaN(value)) {
            shapeStats[diamond.shape].totalValue += value;
          }
        }
      });
      
      return shapeStats;
    } catch (error) {
      console.error('Error getting shape statistics:', error);
      return {};
    }
  }

  /**
   * Generate shape categories file
   */
  generateShapeCategories() {
    try {
      const shapeStats = this.getShapeStatistics();
      const availableShapes = this.getAvailableShapes();
      
      const shapeCategories = {
        availableShapes: availableShapes,
        statistics: shapeStats,
        metadata: {
          lastUpdated: new Date().toISOString(),
          totalShapes: availableShapes.length,
          totalDiamonds: Object.values(shapeStats).reduce((sum, stat) => sum + stat.count, 0)
        }
      };
      
      // Save shape categories
      const shapesFilePath = path.join(__dirname, 'shapes.json');
      fs.writeFileSync(shapesFilePath, JSON.stringify(shapeCategories, null, 2));
      
      console.log('✅ Shape categories generated successfully');
      return shapeCategories;
    } catch (error) {
      console.error('❌ Error generating shape categories:', error);
      throw error;
    }
  }

  /**
   * Load database
   */
  loadDatabase() {
    try {
      if (fs.existsSync(this.databasePath)) {
        const data = fs.readFileSync(this.databasePath, 'utf8');
        return JSON.parse(data);
      } else {
        return { diamonds: [] };
      }
    } catch (error) {
      console.error('Error loading database:', error);
      throw error;
    }
  }

  /**
   * Validate diamond shape
   */
  validateShape(shape) {
    const validShapes = [
      'Round', 'Princess', 'Marquise', 'Emerald', 'Pear', 'Oval', 
      'Heart', 'Radiant', 'Asscher', 'Cushion', 'Crescent', 'Custom', 'Alphabet'
    ];
    
    return validShapes.includes(shape);
  }

  /**
   * Get shape icon
   */
  getShapeIcon(shape) {
    const shapeIcons = {
      'Round': '●',
      'Princess': '◆',
      'Marquise': '◊',
      'Emerald': '▭',
      'Pear': '◐',
      'Oval': '◯',
      'Heart': '♡',
      'Radiant': '◇',
      'Asscher': '⬟',
      'Cushion': '◘',
      'Crescent': '☾',
      'Custom': '✦',
      'Alphabet': 'A'
    };
    
    return shapeIcons[shape] || '◆';
  }

  /**
   * Get shape description
   */
  getShapeDescription(shape) {
    const shapeDescriptions = {
      'Round': 'Classic round brilliant cut with maximum fire and brilliance',
      'Princess': 'Square cut with sharp corners and exceptional sparkle',
      'Marquise': 'Elongated oval with pointed ends for elegant appearance',
      'Emerald': 'Rectangular step-cut with clean, geometric facets',
      'Pear': 'Tear-drop shape combining round and marquise characteristics',
      'Oval': 'Elongated round cut that appears larger than round',
      'Heart': 'Romantic heart shape perfect for special occasions',
      'Radiant': 'Square or rectangular cut with brilliant faceting',
      'Asscher': 'Square step-cut with cropped corners and deep pavilion',
      'Cushion': 'Square or rectangular with rounded corners and large facets',
      'Crescent': 'Unique moon-like shape with exceptional rarity',
      'Custom': 'Bespoke faceting pattern for one-of-a-kind pieces',
      'Alphabet': 'Personalized letter shapes for custom jewelry'
    };
    
    return shapeDescriptions[shape] || 'Beautiful diamond cut';
  }

  /**
   * Auto-categorize new diamond by shape
   */
  autoCategorizeByShape(diamondData) {
    try {
      // Validate shape
      if (!this.validateShape(diamondData.shape)) {
        throw new Error(`Invalid shape: ${diamondData.shape}`);
      }
      
      // Add shape metadata
      const categorizedDiamond = {
        ...diamondData,
        shapeIcon: this.getShapeIcon(diamondData.shape),
        shapeDescription: this.getShapeDescription(diamondData.shape),
        shapeCategory: this.getShapeCategory(diamondData.shape)
      };
      
      // Update shape categories
      this.generateShapeCategories();
      
      console.log(`✅ Diamond auto-categorized by shape: ${diamondData.shape}`);
      return categorizedDiamond;
    } catch (error) {
      console.error('❌ Error auto-categorizing diamond:', error.message);
      throw error;
    }
  }

  /**
   * Get shape category
   */
  getShapeCategory(shape) {
    const shapeCategories = {
      'Classic': ['Round', 'Princess', 'Emerald', 'Asscher'],
      'Fancy': ['Marquise', 'Pear', 'Oval', 'Heart', 'Radiant', 'Cushion'],
      'Unique': ['Crescent', 'Custom', 'Alphabet']
    };
    
    for (const [category, shapes] of Object.entries(shapeCategories)) {
      if (shapes.includes(shape)) {
        return category;
      }
    }
    
    return 'Other';
  }

  /**
   * Get filtered diamonds by shape
   */
  getFilteredDiamondsByShape(shape, options = {}) {
    try {
      const database = this.loadDatabase();
      let filtered = database.diamonds.filter(d => d.shape === shape);
      
      // Apply additional filters
      if (options.bestseller !== undefined) {
        filtered = filtered.filter(d => d.bestseller === options.bestseller);
      }
      
      if (options.category) {
        filtered = filtered.filter(d => d.category === options.category);
      }
      
      if (options.minCarat) {
        filtered = filtered.filter(d => d.carat >= options.minCarat);
      }
      
      if (options.maxCarat) {
        filtered = filtered.filter(d => d.carat <= options.maxCarat);
      }
      
      return filtered;
    } catch (error) {
      console.error('Error filtering diamonds by shape:', error);
      return [];
    }
  }

  /**
   * Get shape summary for API
   */
  getShapeSummary() {
    try {
      const shapeStats = this.getShapeStatistics();
      const availableShapes = this.getAvailableShapes();
      
      return {
        availableShapes: availableShapes.map(shape => ({
          name: shape,
          icon: this.getShapeIcon(shape),
          description: this.getShapeDescription(shape),
          category: this.getShapeCategory(shape),
          count: shapeStats[shape]?.count || 0,
          bestsellerCount: shapeStats[shape]?.bestsellerCount || 0,
          totalValue: shapeStats[shape]?.totalValue || 0
        })),
        totalShapes: availableShapes.length,
        totalDiamonds: Object.values(shapeStats).reduce((sum, stat) => sum + stat.count, 0)
      };
    } catch (error) {
      console.error('Error getting shape summary:', error);
      return { availableShapes: [], totalShapes: 0, totalDiamonds: 0 };
    }
  }
}

// Export for use in other modules
module.exports = ShapeAutomation;

// Example usage (if run directly)
if (require.main === module) {
  const automation = new ShapeAutomation();
  
  try {
    // Generate shape categories
    const categories = automation.generateShapeCategories();
    console.log('Shape categories:', categories);
    
    // Get shape summary
    const summary = automation.getShapeSummary();
    console.log('Shape summary:', summary);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
} 