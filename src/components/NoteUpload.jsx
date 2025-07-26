import React, { useState } from "react";
import { Paper, TextField, Button, Typography, Box } from "@mui/material";

const NoteUpload = ({ onSubmit }) => {
  const [note, setNote] = useState("");
  const [title, setTitle] = useState("");

  const handleSubmit = () => {
    if (!note.trim()) return;
    onSubmit({ title, content: note });
    setNote("");
    setTitle("");
  };

  return (
    <Paper elevation={3} sx={{ p: 4 }}>
      <Typography variant="h6" color="primary" gutterBottom>
        Upload Gemini Note
      </Typography>

      <TextField
        label="Title"
        variant="outlined"
        fullWidth
        sx={{ mb: 2 }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <TextField
        label="Paste your Gemini note"
        variant="outlined"
        fullWidth
        multiline
        minRows={6}
        value={note}
        onChange={(e) => setNote(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Box textAlign="right">
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={!note.trim()}
        >
          Save Note
        </Button>
      </Box>
    </Paper>
  );
};

export default NoteUpload;
