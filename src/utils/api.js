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
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${normalizedPath}`;

  const fetchOptions = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  return response.json();
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
