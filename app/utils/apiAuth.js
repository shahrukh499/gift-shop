/**
 * API Authentication configuration
 * Handles the creation and validation of API headers with proper error handling
 */

class APIAuthError extends Error {
  constructor(message) {
    super(message);
    this.name = 'APIAuthError';
  }
}

const createHeaders = () => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    // Validate required environment variables
    if (!baseUrl) {
      throw new APIAuthError('Missing required API credentials in environment variables');
    }

    // Create and configure headers
    const headers = new Headers();
    headers.append("Content-Type", "application/json");

    // Retrieve the token from localStorage
    if (typeof window !== "undefined") {
      const storedData = localStorage.getItem("logData");
      try {
        const parsedData = storedData ? JSON.parse(storedData) : {};
        const { token } = parsedData;
        if (token) {
          headers.append("Authorization", `Bearer ${token}`);
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    }

    // Add security headers
    headers.append("X-Content-Type-Options", "nosniff");
    headers.append("X-Frame-Options", "DENY");
    headers.append("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

    return headers;
  } catch (error) {
    console.error('Error creating API headers:', error);
    // Return minimal headers for fallback
    const fallbackHeaders = new Headers();
    fallbackHeaders.append("Content-Type", "application/json");
    return fallbackHeaders;
  }
};

// Create headers once and export
const myHeaders = createHeaders();

export { myHeaders as default, APIAuthError, createHeaders };