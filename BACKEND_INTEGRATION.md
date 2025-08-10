# Backend Integration Documentation

## Overview

This application includes TypeScript/JS placeholders for backend integration with Firebase. All integrations are mock implementations that log to console for development purposes.

## Firebase Integration

### Configuration (`src/lib/firebase.ts`)

**Mock Firebase Setup:**
- Mock Firebase configuration with placeholder credentials
- Real-time listener simulation for diamond data updates
- Image upload functionality for diamond photos
- Automatic data synchronization

**Key Features:**
- `initializeFirebase()`: Sets up mock Firebase app
- `uploadImage()`: Simulates image upload to Firebase Storage
- `useDiamondsListener()`: Real-time listener for diamond updates

**Usage Example:**
```typescript
import { useDiamondsListener } from '@/lib/firebase';

// CORRECT PATTERN: Attach listener only once on mount
useEffect(() => {
  console.log('Setting up Firebase listener');
  
  // Attach the listener and store the cleanup function
  const unsubscribe = useDiamondsListener((diamonds) => {
    console.log('Real-time diamond updates:', diamonds);
    setDiamonds(diamonds);
  });
  
  // CRUCIAL: Return cleanup function to prevent memory leaks
  return () => {
    console.log('Cleaning up Firebase listener');
    unsubscribe(); // This prevents memory leaks
  };
}, []); // Empty dependency array = attach only once
```

**Important Notes:**
- **Empty dependency array `[]`** ensures listener is attached only once
- **Always return cleanup function** to prevent memory leaks
- **Never attach listeners outside useEffect** - this causes duplicates

### Real-time Updates

The Firebase integration provides:
- **Real-time diamond data updates** every 3-5 seconds
- **Automatic state synchronization** across components
- **Image upload capabilities** for new diamonds
- **Error handling and fallbacks** for development

## OTP Data Storage

### Firebase Firestore Integration (`src/components/OTPModal.tsx`)

**OTP Verification Storage:**
- Stores OTP verification data in Firebase Firestore
- Includes user metadata (name, phone, timestamp)
- Data validation before storage
- Error handling with console fallback

**Key Functions:**
- `storeOTPData()`: Stores verification data in "leads" collection
- Automatic data validation
- Error handling with graceful fallbacks

**Data Structure:**
```typescript
interface LeadData {
  name: string;
  phone: string;
  verifiedAt: string;
  timestamp: string;
}
```

### Integration with OTP Modal

The OTPModal component now:
- Validates OTP data before storage
- Stores verification data in Firebase Firestore
- Continues verification even if storage fails
- Logs all operations to console

## Diamond Upload Service

### New Diamond Upload (`src/lib/diamondUpload.ts`)

**Upload Functionality:**
- Upload new diamond data and images
- Data validation (file size, type, required fields)
- Progress tracking for uploads
- Integration with Firebase Storage

**Key Features:**
- `uploadNewDiamond()`: Uploads complete diamond data
- `validateDiamondData()`: Validates diamond data
- `uploadWithProgress()`: Upload with progress tracking

**Data Validation:**
- Required fields validation
- Carat value validation (0-100)
- Image file type validation (JPEG, PNG, WebP)
- File size validation (max 5MB)

## API Endpoints (Mock)

### Diamond Management
- `POST /api/diamonds` - Upload new diamond
- `GET /api/diamonds` - Fetch diamonds from Firebase
- `POST /api/diamonds/sync` - Sync diamonds with Firebase

### OTP Storage
- `POST /api/leads` - Store OTP data in Firebase Firestore
- `GET /api/leads` - Get lead history from Firebase

## Real-time Features

### Firebase Listeners
- **Diamond Updates**: Real-time diamond data updates
- **Image Uploads**: Progress tracking for image uploads
- **State Synchronization**: Automatic UI updates

### Data Flow
1. **User Action** → Component State Update
2. **Firebase Listener** → Real-time Data Sync
3. **UI Update** → Automatic Component Re-render
4. **Error Handling** → Fallback to Local Data

## Development Notes

### Console Logging
All backend operations log to console for development:
- Firebase operations: `console.log('Firebase: ...')`
- Upload operations: `console.log('Upload: ...')`
- OTP operations: `console.log('OTP: ...')`

### Error Handling
- **Network Errors**: Fallback to local data
- **Validation Errors**: User-friendly error messages
- **Storage Errors**: Continue with core functionality

### Mock Data
- **Firebase**: Simulated real-time updates
- **Uploads**: Simulated progress and success

## Common Firebase Listener Mistakes

### ❌ Incorrect Patterns (Avoid These)

```typescript
// WRONG: Attaching listener outside useEffect
const unsubscribe = useDiamondsListener(callback);

// WRONG: No cleanup function
useEffect(() => {
  useDiamondsListener(callback);
}, []); // Missing return statement!

// WRONG: Dependencies that cause re-attachment
useEffect(() => {
  const unsubscribe = useDiamondsListener(callback);
  return unsubscribe;
}, [someState]); // This re-attaches on every state change!
```

### ✅ Correct Pattern

```typescript
// CORRECT: Attach once, clean up properly
useEffect(() => {
  const unsubscribe = useDiamondsListener(callback);
  return () => unsubscribe();
}, []); // Empty array = attach only once
```

## Production Implementation

### Firebase Setup
1. Replace mock config with real Firebase credentials
2. Set up Firestore collections for diamonds and leads
3. Configure Firebase Storage for images
4. Set up security rules

### API Endpoints
1. Replace mock endpoints with real backend
2. Set up proper authentication
3. Configure CORS and security headers
4. Implement proper error handling

## Security Considerations

### Data Validation
- All user inputs are validated
- File uploads are type and size checked
- OTP data is validated before storage

### Error Handling
- Sensitive data is not logged in production
- Network errors are handled gracefully
- User experience is maintained during failures

### Privacy
- User data is handled according to privacy policies
- OTP data includes minimal required information
- Lead data is stored securely in Firebase Firestore 