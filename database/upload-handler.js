const fs = require('fs');
const path = require('path');
const ShapeAutomation = require('./shape-automation');

/**
 * Diamond Upload Handler
 * This script handles diamond uploads from the mobile app and updates the website database
 */

class DiamondUploadHandler {
  constructor() {
    this.databasePath = path.join(__dirname, 'diamonds.json');
    this.uploadsPath = path.join(__dirname, 'uploads');
    this.specsPath = path.join(__dirname, 'specs');
    
    // Initialize shape automation
    this.shapeAutomation = new ShapeAutomation();
    
    // Ensure directories exist
    this.ensureDirectories();
  }

  /**
   * Ensure required directories exist
   */
  ensureDirectories() {
    const dirs = [this.uploadsPath, this.specsPath];
    dirs.forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      }
    });
  }

  /**
   * Load current diamond database
   */
  loadDatabase() {
    try {
      if (fs.existsSync(this.databasePath)) {
        const data = fs.readFileSync(this.databasePath, 'utf8');
        return JSON.parse(data);
      } else {
        return {
          diamonds: [],
          metadata: {
            lastUpdated: new Date().toISOString(),
            totalDiamonds: 0,
            version: "1.0.0",
            uploadAppVersion: "1.0.0"
          }
        };
      }
    } catch (error) {
      console.error('Error loading database:', error);
      throw error;
    }
  }

  /**
   * Save diamond database
   */
  saveDatabase(data) {
    try {
      // Update metadata
      data.metadata.lastUpdated = new Date().toISOString();
      data.metadata.totalDiamonds = data.diamonds.length;
      
      fs.writeFileSync(this.databasePath, JSON.stringify(data, null, 2));
      console.log('Database saved successfully');
      return true;
    } catch (error) {
      console.error('Error saving database:', error);
      throw error;
    }
  }

  /**
   * Validate diamond data against schema
   */
  validateDiamondData(diamondData) {
    const requiredFields = ['name', 'shape', 'carat', 'clarity', 'cut', 'color', 'price'];
    const missingFields = requiredFields.filter(field => !diamondData[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate carat weight
    if (typeof diamondData.carat !== 'number' || diamondData.carat < 0.01 || diamondData.carat > 100) {
      throw new Error('Carat weight must be a number between 0.01 and 100');
    }

    // Validate price format
    if (!/^\$[0-9,]+$/.test(diamondData.price)) {
      throw new Error('Price must be in format: $XX,XXX');
    }

    return true;
  }

  /**
   * Generate unique ID for new diamond
   */
  generateId(existingDiamonds) {
    const maxId = existingDiamonds.length > 0 
      ? Math.max(...existingDiamonds.map(d => d.id))
      : 0;
    return maxId + 1;
  }

  /**
   * Process image upload
   */
  processImageUpload(imageFile, diamondName) {
    try {
      // Generate safe filename
      const timestamp = Date.now();
      const safeName = diamondName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const extension = path.extname(imageFile.name);
      const filename = `${safeName}_${timestamp}${extension}`;
      
      const uploadPath = path.join(this.uploadsPath, filename);
      
      // Copy image to uploads directory
      fs.copyFileSync(imageFile.path, uploadPath);
      
      // Return the path that will be used in the website
      return `/src/assets/${filename}`;
    } catch (error) {
      console.error('Error processing image upload:', error);
      throw error;
    }
  }

  /**
   * Add new diamond to database
   */
  addDiamond(diamondData, imageFile = null) {
    try {
      console.log('Processing diamond upload:', diamondData.name);
      
      // Validate diamond data
      this.validateDiamondData(diamondData);
      
      // Auto-categorize by shape
      const categorizedDiamond = this.shapeAutomation.autoCategorizeByShape(diamondData);
      
      // Load current database
      const database = this.loadDatabase();
      
      // Process image if provided
      let imagePath = diamondData.image;
      if (imageFile) {
        imagePath = this.processImageUpload(imageFile, diamondData.name);
      }
      
      // Create new diamond object with shape metadata
      const newDiamond = {
        id: this.generateId(database.diamonds),
        category: categorizedDiamond.category || 'Investment Diamonds',
        shape: categorizedDiamond.shape,
        image: imagePath,
        description: categorizedDiamond.description || `A beautiful ${categorizedDiamond.shape} cut diamond with exceptional quality.`,
        carat: categorizedDiamond.carat,
        clarity: categorizedDiamond.clarity,
        cut: categorizedDiamond.cut,
        color: categorizedDiamond.color,
        price: categorizedDiamond.price,
        bestseller: categorizedDiamond.bestseller || false,
        uploadedAt: new Date().toISOString(),
        uploadedBy: categorizedDiamond.uploadedBy || 'app',
        // Shape metadata
        shapeIcon: categorizedDiamond.shapeIcon,
        shapeDescription: categorizedDiamond.shapeDescription,
        shapeCategory: categorizedDiamond.shapeCategory
      };
      
      // Add to database
      database.diamonds.push(newDiamond);
      
      // Save database
      this.saveDatabase(database);
      
      console.log(`✅ Diamond "${categorizedDiamond.name}" added successfully with ID: ${newDiamond.id}`);
      console.log(`📊 Shape: ${categorizedDiamond.shape} (${categorizedDiamond.shapeCategory})`);
      return newDiamond;
      
    } catch (error) {
      console.error('❌ Error adding diamond:', error.message);
      throw error;
    }
  }

  /**
   * Update existing diamond
   */
  updateDiamond(id, updates) {
    try {
      const database = this.loadDatabase();
      const diamondIndex = database.diamonds.findIndex(d => d.id === id);
      
      if (diamondIndex === -1) {
        throw new Error(`Diamond with ID ${id} not found`);
      }
      
      // Update diamond data
      database.diamonds[diamondIndex] = {
        ...database.diamonds[diamondIndex],
        ...updates,
        uploadedAt: new Date().toISOString()
      };
      
      this.saveDatabase(database);
      console.log(`✅ Diamond ID ${id} updated successfully`);
      return database.diamonds[diamondIndex];
      
    } catch (error) {
      console.error('❌ Error updating diamond:', error.message);
      throw error;
    }
  }

  /**
   * Delete diamond from database
   */
  deleteDiamond(id) {
    try {
      const database = this.loadDatabase();
      const diamondIndex = database.diamonds.findIndex(d => d.id === id);
      
      if (diamondIndex === -1) {
        throw new Error(`Diamond with ID ${id} not found`);
      }
      
      const deletedDiamond = database.diamonds.splice(diamondIndex, 1)[0];
      this.saveDatabase(database);
      
      console.log(`✅ Diamond ID ${id} deleted successfully`);
      return deletedDiamond;
      
    } catch (error) {
      console.error('❌ Error deleting diamond:', error.message);
      throw error;
    }
  }

  /**
   * Get all diamonds
   */
  getAllDiamonds() {
    const database = this.loadDatabase();
    return database.diamonds;
  }

  /**
   * Get diamond by ID
   */
  getDiamondById(id) {
    const database = this.loadDatabase();
    return database.diamonds.find(d => d.id === id);
  }

  /**
   * Get diamonds by shape
   */
  getDiamondsByShape(shape) {
    const database = this.loadDatabase();
    return database.diamonds.filter(d => d.shape === shape);
  }

  /**
   * Get bestseller diamonds
   */
  getBestsellerDiamonds() {
    const database = this.loadDatabase();
    return database.diamonds.filter(d => d.bestseller);
  }
}

// Export for use in other modules
module.exports = DiamondUploadHandler;

// Example usage (if run directly)
if (require.main === module) {
  const handler = new DiamondUploadHandler();
  
  // Example: Add a new diamond
  const newDiamond = {
    name: "Test Diamond",
    shape: "Round",
    carat: 2.5,
    clarity: "VVS1",
    cut: "Excellent",
    color: "D",
    price: "$15,000",
    description: "A test diamond for demonstration purposes.",
    bestseller: false
  };
  
  try {
    const result = handler.addDiamond(newDiamond);
    console.log('Diamond added:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
} 