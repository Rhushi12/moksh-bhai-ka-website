// Utility functions for data validation and testing
// This file provides basic utility functions for form validation

// Interface for basic user data
export interface UserData {
  name: string;
  phone: string;
  timestamp: string;
}

/**
 * Validate user data before processing
 * @param data - User data to validate
 * @returns boolean indicating if data is valid
 */
export const validateUserData = (data: UserData): boolean => {
  const requiredFields = ['name', 'phone', 'timestamp'];
  const hasAllFields = requiredFields.every(field => data[field as keyof UserData]);
  
  if (!hasAllFields) {
    console.error('Invalid user data: missing required fields');
    return false;
  }
  
  // Validate phone number format (basic validation)
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  if (!phoneRegex.test(data.phone)) {
    console.error('Invalid phone number format');
    return false;
  }
  
  return true;
};

/**
 * Test data validation (utility function)
 * @returns Promise with test result
 */
export const testDataValidation = async (): Promise<boolean> => {
  try {
    console.log('🧪 Testing data validation...');
    
    const testData = {
      name: 'Test User',
      phone: '+1234567890',
      timestamp: new Date().toISOString()
    };
    
    // Validate test data
    const isValid = validateUserData(testData);
    
    if (isValid) {
      console.log('✅ Data validation test successful');
      return true;
    } else {
      console.log('❌ Data validation test failed');
      return false;
    }
  } catch (error) {
    console.error('❌ Data validation test error:', error);
    return false;
  }
}; 