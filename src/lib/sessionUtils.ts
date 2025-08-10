// Session Management Utilities
// Centralized session ID generation and management

/**
 * Generate or get a unique session ID for this browser session
 * This function creates a consistent session identifier that persists
 * for the duration of the browser session (until tab is closed)
 * 
 * Enhanced security: Always generates new session for guest users
 * 
 * @returns {string} Unique session identifier
 */
export const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('diamond-session-id');
  const sessionTimestamp = sessionStorage.getItem('diamond-session-timestamp');
  const currentTime = Date.now();
  
  // Check if session is expired (older than 1 hour for security)
  const SESSION_EXPIRY = 60 * 60 * 1000; // 1 hour
  const isExpired = sessionTimestamp && (currentTime - parseInt(sessionTimestamp)) > SESSION_EXPIRY;
  
  // Generate new session if: no session exists, session expired, or forced refresh
  if (!sessionId || isExpired) {
    // Generate a unique session ID with timestamp and random string
    sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('diamond-session-id', sessionId);
    sessionStorage.setItem('diamond-session-timestamp', currentTime.toString());
    console.log('🔐 Generated new session ID:', sessionId);
    
    // Clear any old authentication data for security
    const oldAuthKey = sessionStorage.getItem('diamond-auth-user-' + sessionStorage.getItem('diamond-session-id'));
    if (oldAuthKey) {
      sessionStorage.removeItem('diamond-auth-user-' + sessionStorage.getItem('diamond-session-id'));
      console.log('🔐 Cleared old authentication data for security');
    }
  }
  
  return sessionId;
};

/**
 * Clear the current session ID
 * Useful for logout or session reset scenarios
 */
export const clearSessionId = (): void => {
  sessionStorage.removeItem('diamond-session-id');
  console.log('🔐 Session ID cleared');
};

/**
 * Check if a session ID exists
 * @returns {boolean} Whether a session ID is currently stored
 */
export const hasSessionId = (): boolean => {
  return sessionStorage.getItem('diamond-session-id') !== null;
};
