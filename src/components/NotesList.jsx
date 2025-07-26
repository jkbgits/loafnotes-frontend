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
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { apiGet } from "../utils/api";

const NotesList = () => {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTopic, setFilterTopic] = useState("");
  const [filterDate, setFilterDate] = useState("");

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
    apiGet("/notes")
      .then((data) => {
        setNotes(data);
        setFilteredNotes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load notes:", err);
        setLoading(false);
      });
  }, []);

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
                <Typography fontWeight="bold" sx={{ flex: 1 }}>
                  {note.title}
                </Typography>
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
    </Paper>
  );
};

export default NotesList;
