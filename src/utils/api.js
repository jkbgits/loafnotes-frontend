/**
 * API utility function for making HTTP requests
 * Automatically handles base URL configuration and error handling
 */

/**
 * Get the API base URL from environment variables or use default
 * @returns {string} The base API URL
 */
const getApiBaseUrl = () => {
  return process.env.REACT_APP_API_URL || "http://localhost:8000";
};

/**
 * Fetch data from API endpoint with automatic error handling
 * @param {string} path - The API endpoint path (e.g., '/notes', '/search')
 * @param {Object} options - Optional fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} Parsed JSON response
 * @throws {Error} Throws error with descriptive message if request fails
 */
export const fetchFromApi = async (path, options = {}) => {
  // Ensure path starts with forward slash
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  // Construct full URL
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${normalizedPath}`;

  // Default options
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  // Merge options
  const fetchOptions = {
    ...defaultOptions,
    ...options,
  };

  try {
    console.log(`🌐 API Request: ${fetchOptions.method || "GET"} ${url}`);

    const response = await fetch(url, fetchOptions);

    // Check if response is ok
    if (!response.ok) {
      // Try to get error message from response body
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

      try {
        const errorData = await response.json();
        if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (parseError) {
        // If we can't parse the error response, use the status text
        console.warn("Could not parse error response:", parseError);
      }

      throw new Error(errorMessage);
    }

    // Parse JSON response
    const data = await response.json();
    console.log(`✅ API Response: ${url}`, data);

    return data;
  } catch (error) {
    // Network or other errors
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      throw new Error(
        `Network error: Unable to connect to API at ${baseUrl}. Please check if the server is running.`
      );
    }

    // Re-throw other errors with context
    console.error(`❌ API Error: ${url}`, error);
    throw error;
  }
};

/**
 * Convenience method for GET requests
 * @param {string} path - The API endpoint path
 * @param {Object} options - Optional fetch options
 * @returns {Promise<any>} Parsed JSON response
 */
export const apiGet = (path, options = {}) => {
  return fetchFromApi(path, { ...options, method: "GET" });
};

/**
 * Convenience method for POST requests
 * @param {string} path - The API endpoint path
 * @param {any} data - Request body data (will be JSON stringified)
 * @param {Object} options - Optional fetch options
 * @returns {Promise<any>} Parsed JSON response
 */
export const apiPost = (path, data, options = {}) => {
  return fetchFromApi(path, {
    ...options,
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * Convenience method for PUT requests
 * @param {string} path - The API endpoint path
 * @param {any} data - Request body data (will be JSON stringified)
 * @param {Object} options - Optional fetch options
 * @returns {Promise<any>} Parsed JSON response
 */
export const apiPut = (path, data, options = {}) => {
  return fetchFromApi(path, {
    ...options,
    method: "PUT",
    body: JSON.stringify(data),
  });
};

/**
 * Convenience method for DELETE requests
 * @param {string} path - The API endpoint path
 * @param {Object} options - Optional fetch options
 * @returns {Promise<any>} Parsed JSON response
 */
export const apiDelete = (path, options = {}) => {
  return fetchFromApi(path, { ...options, method: "DELETE" });
};

export default fetchFromApi;
