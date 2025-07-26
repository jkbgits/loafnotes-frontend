// Example usage of the fetchFromApi utility
// This file shows how to replace existing fetch calls with the new utility

import { fetchFromApi, apiGet, apiPost } from "../utils/api";

// Example 1: Basic GET request (replaces existing fetch calls)
const loadNotes = async () => {
  try {
    const notes = await apiGet("/notes");
    console.log("Notes loaded:", notes);
    return notes;
  } catch (error) {
    console.error("Failed to load notes:", error.message);
    throw error;
  }
};

// Example 2: POST request with data
const createNote = async (noteData) => {
  try {
    const result = await apiPost("/notes", noteData);
    console.log("Note created:", result);
    return result;
  } catch (error) {
    console.error("Failed to create note:", error.message);
    throw error;
  }
};

// Example 3: Search with query parameters
const searchNotes = async (query) => {
  try {
    const results = await apiGet(`/search?query=${encodeURIComponent(query)}`);
    console.log("Search results:", results);
    return results;
  } catch (error) {
    console.error("Search failed:", error.message);
    throw error;
  }
};

// Example 4: Generate SOP with custom options
const generateSOP = async (noteId) => {
  try {
    const result = await fetchFromApi(`/generate-sop/${noteId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Custom-Header": "value", // Custom headers can be added
      },
    });
    console.log("SOP generated:", result);
    return result;
  } catch (error) {
    console.error("SOP generation failed:", error.message);
    throw error;
  }
};

// Example 5: Error handling with user feedback
const handleApiCall = async (
  apiFunction,
  errorMessage = "Operation failed"
) => {
  try {
    return await apiFunction();
  } catch (error) {
    // You can integrate this with your notification system
    console.error(errorMessage, error.message);

    // Example of how to handle specific error types
    if (error.message.includes("Network error")) {
      alert(
        "Unable to connect to server. Please check your internet connection."
      );
    } else if (error.message.includes("404")) {
      alert("Requested resource not found.");
    } else {
      alert(`${errorMessage}: ${error.message}`);
    }

    throw error;
  }
};

export { loadNotes, createNote, searchNotes, generateSOP, handleApiCall };
