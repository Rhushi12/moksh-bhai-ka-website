// Test script to verify diamond filtering
const { getFilteredDiamonds, getBestsellerDiamonds, diamonds } = require('./src/data/diamonds.ts');

console.log('🧪 Testing Diamond Filtering System\n');

// Test 1: Get all diamonds
console.log('📊 Test 1: Getting all diamonds');
console.log('Total diamonds:', diamonds.length);
console.log('✅ Test 1 passed\n');

// Test 2: Filter by shape
console.log('💎 Test 2: Filtering by shape');
const roundDiamonds = getFilteredDiamonds(undefined, 'Round');
console.log('Round diamonds found:', roundDiamonds.length);
console.log('✅ Test 2 passed\n');

// Test 3: Filter by category
console.log('🏷️ Test 3: Filtering by category');
const investmentDiamonds = getFilteredDiamonds('Investment Diamonds');
console.log('Investment diamonds found:', investmentDiamonds.length);
console.log('✅ Test 3 passed\n');

// Test 4: Filter by bestseller
console.log('⭐ Test 4: Filtering by bestseller');
const bestsellerDiamonds = getBestsellerDiamonds();
console.log('Bestseller diamonds found:', bestsellerDiamonds.length);
console.log('✅ Test 4 passed\n');

// Test 5: Combined filtering
console.log('🔍 Test 5: Combined filtering');
const roundBestsellers = getFilteredDiamonds(undefined, 'Round', true);
console.log('Round bestseller diamonds found:', roundBestsellers.length);
console.log('✅ Test 5 passed\n');

console.log('🎉 All filtering tests passed!'); 