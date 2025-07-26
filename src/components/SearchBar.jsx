import React, { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  Chip,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { apiGet } from "../utils/api";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await apiGet(`/search?query=${encodeURIComponent(query)}`);
      setResults(data);
      setHasSearched(true);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h6" color="primary" gutterBottom>
        Search Meeting Notes
      </Typography>

      <Box display="flex" gap={2} mb={3}>
        <TextField
          label="Search topics, people, issues..."
          variant="outlined"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="e.g., 'login issues', 'Alicia', 'EMR sync'"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          disabled={!query.trim() || loading}
          startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
          sx={{ minWidth: 120 }}
        >
          {loading ? "Searching" : "Search"}
        </Button>
      </Box>

      {hasSearched && (
        <Box>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Typography variant="subtitle1" color="text.secondary">
              Search Results
            </Typography>
            <Chip
              label={`${results.length} matches`}
              size="small"
              color="secondary"
              variant="outlined"
            />
          </Box>

          {results.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No results found for "{query}". Try different keywords.
            </Typography>
          ) : (
            results.map((note) => (
              <Accordion key={note.id} sx={{ mb: 1 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Typography fontWeight="bold" sx={{ flex: 1 }}>
                      {note.title}
                    </Typography>
                    <Chip
                      label={`${(note.score * 100).toFixed(1)}% match`}
                      size="small"
                      color="primary"
                      variant="outlined"
                      sx={{ ml: 2 }}
                    />
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    variant="body2"
                    sx={{
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.6,
                      color: "text.secondary",
                    }}
                  >
                    {note.content}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))
          )}
        </Box>
      )}
    </Paper>
  );
};

export default SearchBar;
