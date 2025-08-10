const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const DiamondUploadHandler = require('./upload-handler');
const ShapeAutomation = require('./shape-automation');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize upload handler and shape automation
const uploadHandler = new DiamondUploadHandler();
const shapeAutomation = new ShapeAutomation();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'uploads'));
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = (req.body.name || 'diamond').replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    const extension = path.extname(file.originalname);
    cb(null, `${safeName}_${timestamp}${extension}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// API Routes

/**
 * GET /api/diamonds
 * Get all diamonds
 */
app.get('/api/diamonds', (req, res) => {
  try {
    const diamonds = uploadHandler.getAllDiamonds();
    res.json({
      success: true,
      data: diamonds,
      count: diamonds.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/diamonds/:id
 * Get diamond by ID
 */
app.get('/api/diamonds/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const diamond = uploadHandler.getDiamondById(id);
    
    if (!diamond) {
      return res.status(404).json({
        success: false,
        error: 'Diamond not found'
      });
    }
    
    res.json({
      success: true,
      data: diamond
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/diamonds/shape/:shape
 * Get diamonds by shape
 */
app.get('/api/diamonds/shape/:shape', (req, res) => {
  try {
    const shape = req.params.shape;
    const diamonds = uploadHandler.getDiamondsByShape(shape);
    
    res.json({
      success: true,
      data: diamonds,
      count: diamonds.length,
      shape: shape
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/diamonds/bestsellers
 * Get bestseller diamonds
 */
app.get('/api/diamonds/bestsellers', (req, res) => {
  try {
    const diamonds = uploadHandler.getBestsellerDiamonds();
    
    res.json({
      success: true,
      data: diamonds,
      count: diamonds.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/shapes
 * Get all available shapes with statistics
 */
app.get('/api/shapes', (req, res) => {
  try {
    const shapeSummary = shapeAutomation.getShapeSummary();
    
    res.json({
      success: true,
      data: shapeSummary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/shapes/:shape
 * Get diamonds filtered by specific shape
 */
app.get('/api/shapes/:shape', (req, res) => {
  try {
    const shape = req.params.shape;
    const options = {
      bestseller: req.query.bestseller === 'true' ? true : req.query.bestseller === 'false' ? false : undefined,
      category: req.query.category,
      minCarat: req.query.minCarat ? parseFloat(req.query.minCarat) : undefined,
      maxCarat: req.query.maxCarat ? parseFloat(req.query.maxCarat) : undefined
    };
    
    const diamonds = shapeAutomation.getFilteredDiamondsByShape(shape, options);
    
    res.json({
      success: true,
      data: diamonds,
      count: diamonds.length,
      shape: shape,
      filters: options
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/shapes/:shape/statistics
 * Get statistics for a specific shape
 */
app.get('/api/shapes/:shape/statistics', (req, res) => {
  try {
    const shape = req.params.shape;
    const shapeStats = shapeAutomation.getShapeStatistics();
    
    if (!shapeStats[shape]) {
      return res.status(404).json({
        success: false,
        error: `Shape '${shape}' not found`
      });
    }
    
    res.json({
      success: true,
      data: {
        shape: shape,
        icon: shapeAutomation.getShapeIcon(shape),
        description: shapeAutomation.getShapeDescription(shape),
        category: shapeAutomation.getShapeCategory(shape),
        ...shapeStats[shape]
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/diamonds/upload
 * Upload new diamond with image
 */
app.post('/api/diamonds/upload', upload.single('image'), (req, res) => {
  try {
    // Extract diamond data from request
    const diamondData = {
      name: req.body.name,
      shape: req.body.shape,
      category: req.body.category || 'Investment Diamonds',
      carat: parseFloat(req.body.carat),
      clarity: req.body.clarity,
      cut: req.body.cut,
      color: req.body.color,
      price: req.body.price,
      description: req.body.description,
      bestseller: req.body.bestseller === 'true',
      uploadedBy: 'app'
    };

    // Add diamond to database
    const newDiamond = uploadHandler.addDiamond(diamondData, req.file);
    
    res.json({
      success: true,
      message: 'Diamond uploaded successfully',
      data: newDiamond
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * POST /api/diamonds/upload-specs
 * Upload diamond specs only (no image)
 */
app.post('/api/diamonds/upload-specs', (req, res) => {
  try {
    const diamondData = {
      name: req.body.name,
      shape: req.body.shape,
      category: req.body.category || 'Investment Diamonds',
      carat: parseFloat(req.body.carat),
      clarity: req.body.clarity,
      cut: req.body.cut,
      color: req.body.color,
      price: req.body.price,
      description: req.body.description,
      bestseller: req.body.bestseller === 'true',
      image: req.body.image || '/src/assets/diamond-placeholder.jpg',
      uploadedBy: 'app'
    };

    const newDiamond = uploadHandler.addDiamond(diamondData);
    
    res.json({
      success: true,
      message: 'Diamond specs uploaded successfully',
      data: newDiamond
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * PUT /api/diamonds/:id
 * Update existing diamond
 */
app.put('/api/diamonds/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = req.body;
    
    const updatedDiamond = uploadHandler.updateDiamond(id, updates);
    
    res.json({
      success: true,
      message: 'Diamond updated successfully',
      data: updatedDiamond
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * DELETE /api/diamonds/:id
 * Delete diamond
 */
app.delete('/api/diamonds/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deletedDiamond = uploadHandler.deleteDiamond(id);
    
    res.json({
      success: true,
      message: 'Diamond deleted successfully',
      data: deletedDiamond
    });
    
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/schema
 * Get upload schema for app validation
 */
app.get('/api/schema', (req, res) => {
  try {
    const schemaPath = path.join(__dirname, 'upload-schema.json');
    const schema = require(schemaPath);
    
    res.json({
      success: true,
      data: schema
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Diamond Upload API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  res.status(500).json({
    success: false,
    error: error.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Diamond Upload API Server running on port ${PORT}`);
  console.log(`📱 Mobile app can connect to: http://localhost:${PORT}`);
  console.log(`📊 API Documentation: http://localhost:${PORT}/api/schema`);
  console.log(`💎 Database location: ${path.join(__dirname, 'diamonds.json')}`);
});

module.exports = app; 