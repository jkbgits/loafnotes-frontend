import React from "react";
import { Container, Paper, Typography, Box } from "@mui/material";
import NoteUpload from "./components/NoteUpload";
import NotesList from "./components/NotesList";
import SearchBar from "./components/SearchBar";
import ExportPanel from "./components/ExportPanel";
import SopPanel from "./components/SopPanel";

const App = () => {
  const handleNoteSubmit = async (note) => {
    try {
      const res = await fetch("http://localhost:8000/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      });
      const data = await res.json();
      console.log("Note ingested:", data);
    } catch (err) {
      console.error("Failed to ingest note:", err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #12dee6 0%, #764ba2 100%)",
        position: "relative",
        py: 4,
      }}
    >
      {/* Dark overlay for better contrast */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.3)",
          zIndex: 0,
        }}
      />
      <Container
        maxWidth="xl"
        sx={{
          px: { xs: 2, sm: 3, md: 4 },
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            mb: 4,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" gutterBottom>
            Notes
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            AI-powered note organization and SOP generation.
          </Typography>
        </Paper>

        {/* Upload Note Row */}
        <Box sx={{ mb: 3 }}>
          <NoteUpload onSubmit={handleNoteSubmit} />
        </Box>

        {/* Search and Export Row */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "1fr 1fr",
            },
            gap: 3,
            mb: 3,
          }}
        >
          <Box>
            <SearchBar />
          </Box>
          <Box>
            <ExportPanel />
          </Box>
        </Box>

        {/* Notes and SOP Row */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "1fr 1fr",
            },
            gap: 3,
            alignItems: "start",
            minHeight: "60vh",
          }}
        >
          <Box sx={{ height: "60vh", overflow: "hidden" }}>
            <NotesList />
          </Box>
          <Box sx={{ height: "60vh", overflow: "hidden" }}>
            <SopPanel />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default App;
