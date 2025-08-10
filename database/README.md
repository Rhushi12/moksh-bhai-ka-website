# 💎 Diamond Upload Database System

This database system allows your mobile app to automatically upload diamond data and images to your website. It provides both API endpoints for automatic uploads and manual tools for direct database management.

## 📁 Directory Structure

```
database/
├── diamonds.json          # Main diamond database
├── upload-schema.json     # Data validation schema
├── upload-handler.js      # Database management class
├── api-server.js          # Express API server
├── package.json           # Dependencies
├── uploads/               # Uploaded images
├── specs/                 # Diamond specifications
└── README.md             # This file
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd database
npm install
```

### 2. Start the API Server
```bash
npm start
# or for development with auto-restart:
npm run dev
```

The API server will run on `http://localhost:3001`

## 📱 Mobile App Integration

### API Endpoints

#### Upload Diamond with Image
```http
POST /api/diamonds/upload
Content-Type: multipart/form-data

Form Data:
- name: "Crescent Cut Diamond"
- shape: "Crescent"
- carat: "2.10"
- clarity: "VVS2"
- cut: "Excellent"
- color: "E"
- price: "$28,000"
- description: "A rare crescent cut diamond..."
- bestseller: "true"
- image: [file upload]
```

#### Upload Diamond Specs Only
```http
POST /api/diamonds/upload-specs
Content-Type: application/json

{
  "name": "Custom Diamond",
  "shape": "Custom",
  "carat": 1.50,
  "clarity": "VVS1",
  "cut": "Excellent",
  "color": "D",
  "price": "$22,500",
  "description": "Unique custom cut diamond...",
  "bestseller": true,
  "image": "/src/assets/diamond-custom.jpg"
}
```

#### Get All Diamonds
```http
GET /api/diamonds
```

#### Get Diamond by ID
```http
GET /api/diamonds/1
```

#### Get Diamonds by Shape
```http
GET /api/diamonds/shape/Round
```

#### Get Bestseller Diamonds
```http
GET /api/diamonds/bestsellers
```

#### Get Upload Schema
```http
GET /api/schema
```

## 🛠️ Manual Database Management

### Using the Upload Handler

```javascript
const DiamondUploadHandler = require('./upload-handler');

const handler = new DiamondUploadHandler();

// Add new diamond
const newDiamond = {
  name: "Test Diamond",
  shape: "Round",
  carat: 2.5,
  clarity: "VVS1",
  cut: "Excellent",
  color: "D",
  price: "$15,000",
  description: "A beautiful test diamond",
  bestseller: false
};

try {
  const result = handler.addDiamond(newDiamond);
  console.log('Diamond added:', result);
} catch (error) {
  console.error('Error:', error.message);
}
```

### Direct Database Access

```javascript
// Load database
const fs = require('fs');
const database = JSON.parse(fs.readFileSync('./diamonds.json', 'utf8'));

// Add diamond manually
const newDiamond = {
  id: database.diamonds.length + 1,
  category: "Investment Diamonds",
  shape: "Crescent",
  image: "/src/assets/diamond-crescent.jpg",
  description: "A rare crescent cut diamond...",
  carat: 2.10,
  clarity: "VVS2",
  cut: "Excellent",
  color: "E",
  price: "$28,000",
  bestseller: true,
  uploadedAt: new Date().toISOString(),
  uploadedBy: "manual"
};

database.diamonds.push(newDiamond);
fs.writeFileSync('./diamonds.json', JSON.stringify(database, null, 2));
```

## 📊 Data Schema

### Required Fields
- `name`: Diamond name/identifier
- `shape`: Diamond shape (Round, Princess, etc.)
- `carat`: Carat weight (0.01-100)
- `clarity`: Clarity grade (FL, VVS1, etc.)
- `cut`: Cut quality (Excellent, Very Good, etc.)
- `color`: Color grade (D-Z or Fancy colors)
- `price`: Price in USD format ($XX,XXX)

### Optional Fields
- `category`: Diamond category (default: "Investment Diamonds")
- `description`: Diamond description
- `bestseller`: Boolean flag
- `image`: Image path (auto-generated if not provided)

### Auto-Generated Fields
- `id`: Unique diamond ID
- `uploadedAt`: Upload timestamp
- `uploadedBy`: Upload source ("app" or "manual")

## 🔧 Configuration

### Supported Image Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

### File Size Limits
- Maximum image size: 5MB

### API Configuration
- Port: 3001 (configurable via PORT environment variable)
- CORS: Enabled for cross-origin requests
- File uploads: Supported via multipart/form-data

## 🔄 Website Integration

The website automatically reads from `database/diamonds.json`. When you add diamonds through the API or manually, they will appear on your website after the next page refresh.

### Update Website Data Source

To use the database instead of hardcoded data, update your website's diamond data source:

```javascript
// In your website code
import diamondData from '../database/diamonds.json';

// Use diamondData.diamonds instead of hardcoded array
const diamonds = diamondData.diamonds;
```

## 🧪 Testing

### Test the Upload Handler
```bash
npm test
```

### Test API Endpoints
```bash
# Health check
curl http://localhost:3001/api/health

# Get all diamonds
curl http://localhost:3001/api/diamonds

# Get schema
curl http://localhost:3001/api/schema
```

## 📝 Example Mobile App Request

```javascript
// Example: Upload diamond from mobile app
const formData = new FormData();
formData.append('name', 'Crescent Cut Diamond');
formData.append('shape', 'Crescent');
formData.append('carat', '2.10');
formData.append('clarity', 'VVS2');
formData.append('cut', 'Excellent');
formData.append('color', 'E');
formData.append('price', '$28,000');
formData.append('description', 'A rare crescent cut diamond...');
formData.append('bestseller', 'true');
formData.append('image', imageFile);

fetch('http://localhost:3001/api/diamonds/upload', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  console.log('Diamond uploaded:', data);
})
.catch(error => {
  console.error('Upload failed:', error);
});
```

## 🔒 Security Notes

- The API server includes CORS for cross-origin requests
- File uploads are validated for type and size
- Input data is validated against the schema
- Consider adding authentication for production use

## 📞 Support

For questions or issues with the database system, contact:
- **Email:** moksh.mehta121@gmail.com
- **Phone:** +91 9106338340

---

**Version:** 1.0.0  
**Last Updated:** August 2024  
**Author:** Moksh P Mehta 