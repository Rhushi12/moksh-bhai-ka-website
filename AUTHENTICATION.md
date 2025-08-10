# Authentication System Documentation

## Overview

This application implements a dynamic greeting system in the header that displays "Welcome, [Name]" after OTP verification or "Welcome, Guest" if not logged in. The authentication state is managed centrally using React Context.

## Key Components

### 1. AuthContext (`src/contexts/AuthContext.tsx`)

**Purpose**: Central authentication state management
- Manages user authentication state globally
- Provides login/logout functionality
- Handles user information (name, phone, verification status)

**Key Features**:
- `login(name, phone)`: Updates authentication state after successful OTP verification
- `logout()`: Resets user to guest state
- `getUserName()`: Returns user name or "Guest" if not authenticated
- `user.isAuthenticated`: Boolean flag for authentication status

### 2. Header Component (`src/components/Header.tsx`)

**Purpose**: Displays dynamic greeting based on authentication state
- Shows "Welcome, [Name]" for authenticated users
- Shows "Welcome, Guest" for unauthenticated users
- Displays verification date for authenticated users
- Includes logout functionality in menu

**Dynamic Features**:
- Greeting updates automatically when authentication state changes
- Logout button only appears for authenticated users
- Verification status shown below greeting for authenticated users

### 3. OTPModal Component (`src/components/OTPModal.tsx`)

**Purpose**: Handles OTP verification and updates authentication state
- Collects user name and phone number
- Sends OTP (simulated)
- Verifies OTP and calls `login()` function
- Updates global authentication state upon success

## How It Works

1. **Initial State**: App starts with user as "Guest"
2. **OTP Process**: User enters name/phone → receives OTP → verifies OTP
3. **Authentication**: Upon successful verification, `login()` is called
4. **State Update**: Global authentication state updates automatically
5. **UI Update**: Header greeting updates to show user's name
6. **Logout**: User can logout to return to "Guest" state

## Usage Examples

### Using the Auth Context in Components

```typescript
import { useAuth } from '@/contexts/AuthContext';

const MyComponent = () => {
  const { user, login, logout, getUserName } = useAuth();
  
  // Check if user is authenticated
  if (user.isAuthenticated) {
    console.log('User is logged in:', user.name);
  }
  
  // Get display name
  const displayName = getUserName(); // Returns name or "Guest"
  
  // Login (usually called from OTP verification)
  login('John Doe', '+1234567890');
  
  // Logout
  logout();
};
```

### Header Greeting Logic

The header automatically displays the appropriate greeting:
- **Authenticated**: "Welcome, John Doe" + verification date
- **Unauthenticated**: "Welcome, Guest"

## State Management

The authentication state is managed through React Context, ensuring:
- **Global Access**: Any component can access authentication state
- **Automatic Updates**: UI updates automatically when state changes
- **Type Safety**: Full TypeScript support with proper interfaces
- **Persistence**: State persists during the session (resets on page reload)

## Developer Notes

- The OTP verification is simulated for the prototype
- Real implementation would integrate with actual OTP services
- Authentication state is session-based (not persisted to localStorage)
- All authentication logic is centralized in the AuthContext
- Header component is decoupled from authentication logic through context

## Future Enhancements

- Add localStorage persistence for authentication state
- Implement real OTP service integration
- Add session timeout functionality
- Add user profile management
- Implement role-based access control 