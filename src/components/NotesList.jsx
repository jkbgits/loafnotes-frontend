import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useData } from "../context/DataContext";
import { apiPost } from "../utils/api";

const NotesList = () => {
  const { notes, loading, refreshData, sops } = useData();
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [filterTopic, setFilterTopic] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [generatingSOPs, setGeneratingSOPs] = useState(new Set());
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Check if a note has an existing SOP
  const hasExistingSOP = (noteId) => {
    return sops.some((sop) => sop.id === noteId && sop.sop_draft);
  };

  // Handle SOP regeneration
  const handleRegenerateSOP = async (noteId, noteTitle) => {
    try {
      setGeneratingSOPs((prev) => new Set(prev).add(noteId));

      const response = await apiPost(`/generate-sop/${noteId}`);

      setSnackbar({
        open: true,
        message: `SOP regenerated successfully for "${noteTitle}"`,
        severity: "success",
      });

      // Refresh data to update the SOP panel
      refreshData();
    } catch (error) {
      console.error("Failed to regenerate SOP:", error);
      setSnackbar({
        open: true,
        message: `Failed to regenerate SOP: ${error.message}`,
        severity: "error",
      });
    } finally {
      setGeneratingSOPs((prev) => {
        const newSet = new Set(prev);
        newSet.delete(noteId);
        return newSet;
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Extract unique topics from note titles
  const getTopics = (notesList) => {
    const topics = notesList.map((note) => {
      // Extract the actual topic after the second dash
      // "Morning Sync – July 25 – Platform Login Issues + Token Expiry"
      const parts = note.title.split("–");
      if (parts.length >= 3) {
        return parts[2].trim();
      }
      return "Other";
    });
    return [...new Set(topics)].sort();
  };

  // Extract dates from note titles
  const getDates = (notesList) => {
    const dates = notesList.map((note) => {
      const match = note.title.match(/July\s+\d+/);
      return match ? match[0] : "Unknown";
    });
    return [...new Set(dates)].sort();
  };

  useEffect(() => {
    setFilteredNotes(notes);
  }, [notes]);

  // Filter notes when filters change
  useEffect(() => {
    let filtered = notes;

    if (filterTopic) {
      filtered = filtered.filter((note) =>
        note.title.toLowerCase().includes(filterTopic.toLowerCase())
      );
    }

    if (filterDate) {
      filtered = filtered.filter((note) => note.title.includes(filterDate));
    }

    setFilteredNotes(filtered);
  }, [notes, filterTopic, filterDate]);

  if (loading) {
    return (
      <Paper
        sx={{ p: 4, height: "100%", display: "flex", flexDirection: "column" }}
      >
        <Typography>Loading meeting notes...</Typography>
      </Paper>
    );
  }

  return (
    <Paper
      sx={{ p: 4, height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Typography variant="h6" color="primary">
          Meeting Notes
        </Typography>
        <Chip
          label={`${filteredNotes.length} of ${notes.length} notes`}
          size="small"
          color="primary"
          variant="outlined"
        />
      </Box>

      {/* Filters */}
      <Box display="flex" gap={2} mb={3}>
        <FormControl size="small" sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Topic</InputLabel>
          <Select
            value={filterTopic}
            label="Filter by Topic"
            onChange={(e) => setFilterTopic(e.target.value)}
          >
            <MenuItem value="">All Topics</MenuItem>
            {getTopics(notes).map((topic) => (
              <MenuItem key={topic} value={topic}>
                {topic}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Filter by Date</InputLabel>
          <Select
            value={filterDate}
            label="Filter by Date"
            onChange={(e) => setFilterDate(e.target.value)}
          >
            <MenuItem value="">All Dates</MenuItem>
            {getDates(notes).map((date) => (
              <MenuItem key={date} value={date}>
                {date}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Scrollable Notes Container */}
      <Box sx={{ flex: 1, overflow: "auto", pr: 1 }}>
        {filteredNotes.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            {notes.length === 0
              ? "No meeting notes found."
              : "No notes match the current filters."}
          </Typography>
        ) : (
          filteredNotes.map((note) => (
            <Accordion key={note.id} sx={{ mb: 1 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flex: 1,
                    gap: 1,
                  }}
                >
                  <Typography fontWeight="bold" sx={{ flex: 1 }}>
                    {note.title}
                  </Typography>
                  {hasExistingSOP(note.id) && (
                    <Chip
                      label="Has SOP"
                      size="small"
                      color="success"
                      sx={{ fontSize: "0.7rem" }}
                    />
                  )}
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: "pre-wrap",
                    lineHeight: 1.6,
                    color: "text.secondary",
                    mb: 2,
                  }}
                >
                  {note.content}
                </Typography>

                {/* Regenerate SOP Button */}
                <Box
                  sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    startIcon={
                      generatingSOPs.has(note.id) ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <RefreshIcon />
                      )
                    }
                    onClick={() => handleRegenerateSOP(note.id, note.title)}
                    disabled={generatingSOPs.has(note.id)}
                    sx={{
                      background: hasExistingSOP(note.id)
                        ? "linear-gradient(45deg, #ff9800 30%, #f57c00 90%)"
                        : "linear-gradient(45deg, #12dee6 30%, #764ba2 90%)",
                      "&:hover": {
                        background: hasExistingSOP(note.id)
                          ? "linear-gradient(45deg, #e65100 30%, #ef6c00 90%)"
                          : "linear-gradient(45deg, #0fa8af 30%, #5a3a7a 90%)",
                      },
                    }}
                  >
                    {generatingSOPs.has(note.id)
                      ? "Generating..."
                      : hasExistingSOP(note.id)
                      ? "Regenerate SOP"
                      : "Generate SOP"}
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))
        )}
      </Box>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default NotesList;
