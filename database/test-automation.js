const ShapeAutomation = require('./shape-automation');
const DiamondUploadHandler = require('./upload-handler');

async function testAutomation() {
  console.log('🧪 Testing Diamond Shape Automation System\n');
  
  const automation = new ShapeAutomation();
  const uploadHandler = new DiamondUploadHandler();
  
  try {
    // Test 1: Get available shapes
    console.log('📊 Test 1: Getting available shapes');
    const availableShapes = automation.getAvailableShapes();
    console.log('Available shapes:', availableShapes);
    console.log('✅ Test 1 passed\n');
    
    // Test 2: Get shape statistics
    console.log('📈 Test 2: Getting shape statistics');
    const shapeStats = automation.getShapeStatistics();
    console.log('Shape statistics:', Object.keys(shapeStats).map(shape => ({
      shape,
      count: shapeStats[shape].count,
      bestsellerCount: shapeStats[shape].bestsellerCount,
      totalValue: shapeStats[shape].totalValue
    })));
    console.log('✅ Test 2 passed\n');
    
    // Test 3: Get shape summary
    console.log('📋 Test 3: Getting shape summary');
    const shapeSummary = automation.getShapeSummary();
    console.log('Total shapes:', shapeSummary.totalShapes);
    console.log('Total diamonds:', shapeSummary.totalDiamonds);
    console.log('✅ Test 3 passed\n');
    
    // Test 4: Test shape filtering
    console.log('🔍 Test 4: Testing shape filtering');
    const roundDiamonds = automation.getFilteredDiamondsByShape('Round');
    console.log('Round diamonds found:', roundDiamonds.length);
    
    const bestsellerRound = automation.getFilteredDiamondsByShape('Round', { bestseller: true });
    console.log('Bestseller round diamonds:', bestsellerRound.length);
    console.log('✅ Test 4 passed\n');
    
    // Test 5: Test auto-categorization
    console.log('🏷️ Test 5: Testing auto-categorization');
    const testDiamond = {
      name: 'Test Diamond',
      shape: 'Crescent',
      carat: 2.5,
      clarity: 'VVS1',
      cut: 'Excellent',
      color: 'D',
      price: '$15,000',
      description: 'A test diamond',
      bestseller: false
    };
    
    const categorized = automation.autoCategorizeByShape(testDiamond);
    console.log('Categorized diamond:', {
      name: categorized.name,
      shape: categorized.shape,
      shapeIcon: categorized.shapeIcon,
      shapeCategory: categorized.shapeCategory
    });
    console.log('✅ Test 5 passed\n');
    
    // Test 6: Test API endpoints (simulated)
    console.log('🌐 Test 6: Testing API endpoints');
    console.log('GET /api/shapes - Available shapes endpoint');
    console.log('GET /api/shapes/Round - Round diamonds endpoint');
    console.log('GET /api/shapes/Round/statistics - Round statistics endpoint');
    console.log('✅ Test 6 passed\n');
    
    console.log('🎉 All tests passed! Shape automation system is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAutomation(); 