import React, { useEffect, useState } from "react";
import {
  Paper,
  Typography,
  Button,
  Box,
  CircularProgress,
  Chip,
  Alert,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  IconButton,
  Collapse,
  TextField,
} from "@mui/material";
import {
  AutoFixHigh as MagicIcon,
  CheckCircle as ApproveIcon,
  Cancel as DenyIcon,
  Refresh as RegenerateIcon,
  Visibility as PreviewIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Edit as EditIcon,
  Save as SaveIcon,
} from "@mui/icons-material";

const SopPanel = () => {
  const [sops, setSops] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState({});
  const [previewing, setPreviewing] = useState({});
  const [previewDialog, setPreviewDialog] = useState({
    open: false,
    sop: null,
  });
  const [expandedSuggestions, setExpandedSuggestions] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

  const loadData = async () => {
    try {
      const [sopsRes, notesRes] = await Promise.all([
        fetch("http://localhost:8000/sops"),
        fetch("http://localhost:8000/notes"),
      ]);

      const [sopsData, notesData] = await Promise.all([
        sopsRes.json(),
        notesRes.json(),
      ]);

      setSops(sopsData);
      setNotes(notesData);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const generateSOPPreview = async (noteId) => {
    setPreviewing((prev) => ({ ...prev, [noteId]: true }));

    try {
      const note = notes.find((n) => n.id === noteId);
      // Simulate SOP generation for preview
      const mockSopData = {
        note_id: noteId,
        title: note.title,
        content: note.content,
        sop_draft: `# Standard Operating Procedure: ${
          note.title.split("–")[2]?.trim() || "Process"
        }

## Purpose
Based on the meeting discussion, this SOP provides clear steps to handle similar situations.

## Scope
This procedure applies to all team members involved in ${
          note.title.split("–")[2]?.trim() || "this process"
        }.

## Procedure Steps
1. **Initial Assessment**: Review the situation and gather relevant information
2. **Team Communication**: Notify relevant stakeholders immediately
3. **Implementation**: Follow the established protocol for resolution
4. **Documentation**: Record all actions taken and outcomes
5. **Follow-up**: Schedule review meetings to ensure resolution effectiveness

## Responsibilities
- Team Lead: Overall coordination and decision making
- Technical Team: Implementation and troubleshooting
- Documentation: Recording and updating procedures

## Related Documents
- Meeting notes: ${note.title}
- Contact information for escalation procedures

---
*Generated from meeting notes on ${new Date().toLocaleDateString()}*`,
      };

      setPreviewDialog({ open: true, sop: mockSopData });
      // Initialize edit fields
      setEditedTitle(mockSopData.title);
      setEditedContent(mockSopData.sop_draft);
      setEditMode(false);
    } catch (err) {
      console.error("Failed to generate SOP preview:", err);
    } finally {
      setPreviewing((prev) => ({ ...prev, [noteId]: false }));
    }
  };

  const approveSOP = async (sopData) => {
    setGenerating((prev) => ({ ...prev, [sopData.note_id]: true }));

    try {
      // Use edited content if in edit mode
      const finalSopData = {
        ...sopData,
        title: editedTitle,
        sop_draft: editedContent,
      };

      const res = await fetch(
        `http://localhost:8000/generate-sop/${sopData.note_id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalSopData),
        }
      );

      if (res.ok) {
        await loadData();
        setPreviewDialog({ open: false, sop: null });
      } else {
        console.error("Failed to approve SOP");
      }
    } catch (err) {
      console.error("Failed to approve SOP:", err);
    } finally {
      setGenerating((prev) => ({ ...prev, [sopData.note_id]: false }));
    }
  };

  const denySOP = () => {
    setPreviewDialog({ open: false, sop: null });
    setEditMode(false);
    setEditedTitle("");
    setEditedContent("");
  };

  const regenerateSOP = async () => {
    if (!previewDialog.sop) return;

    // Close current dialog and regenerate
    const noteId = previewDialog.sop.note_id;
    setPreviewDialog({ open: false, sop: null });
    setEditMode(false);
    setEditedTitle("");
    setEditedContent("");

    // Trigger regeneration
    await generateSOPPreview(noteId);
  };

  const toggleEditMode = () => {
    if (editMode) {
      // Save changes to the preview
      setPreviewDialog((prev) => ({
        ...prev,
        sop: {
          ...prev.sop,
          title: editedTitle,
          sop_draft: editedContent,
        },
      }));
    } else {
      // Initialize edit fields with current values
      setEditedTitle(previewDialog.sop?.title || "");
      setEditedContent(previewDialog.sop?.sop_draft || "");
    }
    setEditMode(!editMode);
  };

  // Get notes that don't have SOPs yet
  const notesWithoutSOPs = notes.filter(
    (note) => !sops.some((sop) => sop.id === note.id)
  );

  const toggleExpanded = (noteId) => {
    setExpandedSuggestions((prev) => ({
      ...prev,
      [noteId]: !prev[noteId],
    }));
  };

  if (loading) {
    return (
      <Paper sx={{ p: 4, height: "100%" }}>
        <Typography>Loading SOPs...</Typography>
      </Paper>
    );
  }

  return (
    <>
      <Paper
        sx={{ p: 4, height: "100%", display: "flex", flexDirection: "column" }}
      >
        <Box display="flex" alignItems="center" gap={2} mb={3}>
          <Typography variant="h6" color="primary">
            SOP Management
          </Typography>
          <Chip
            label={`${sops.length} SOPs created`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>

        {/* Scrollable Content */}
        <Box sx={{ flex: 1, overflow: "auto", pr: 1 }}>
          {/* AI Suggestions for SOP Generation */}
          {notesWithoutSOPs.length > 0 && (
            <Box mb={3}>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                AI Suggestions
              </Typography>
              <Alert severity="info" sx={{ mb: 2, fontSize: "0.875rem" }}>
                AI has identified meeting notes that could benefit from SOPs.
                Click "Preview SOP" to see suggestions.
              </Alert>

              {notesWithoutSOPs.slice(0, 3).map((note) => (
                <Card
                  key={note.id}
                  sx={{
                    mb: 2,
                    border: "1px solid",
                    borderColor: "primary.light",
                  }}
                >
                  <CardContent sx={{ pb: 1 }}>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <MagicIcon color="primary" fontSize="small" />
                      <Typography
                        variant="subtitle2"
                        color="primary"
                        sx={{ fontWeight: 600 }}
                      >
                        Suggested SOP for:
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ fontWeight: 500, mb: 1 }}>
                      {note.title}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={1}>
                      <IconButton
                        size="small"
                        onClick={() => toggleExpanded(note.id)}
                        aria-label="expand"
                      >
                        {expandedSuggestions[note.id] ? (
                          <ExpandLessIcon />
                        ) : (
                          <ExpandMoreIcon />
                        )}
                      </IconButton>
                      <Typography variant="caption" color="text.secondary">
                        {expandedSuggestions[note.id] ? "Hide" : "Show"} note
                        content
                      </Typography>
                    </Box>

                    <Collapse in={expandedSuggestions[note.id]}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          mt: 1,
                          p: 2,
                          bgcolor: "grey.50",
                          borderRadius: 1,
                        }}
                      >
                        {note.content.substring(0, 200)}...
                      </Typography>
                    </Collapse>
                  </CardContent>
                  <CardActions sx={{ pt: 0 }}>
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      startIcon={
                        previewing[note.id] ? (
                          <CircularProgress size={16} />
                        ) : (
                          <PreviewIcon />
                        )
                      }
                      onClick={() => generateSOPPreview(note.id)}
                      disabled={previewing[note.id]}
                    >
                      {previewing[note.id] ? "Generating..." : "Preview SOP"}
                    </Button>
                  </CardActions>
                </Card>
              ))}

              {notesWithoutSOPs.length > 3 && (
                <Typography variant="caption" color="text.secondary">
                  ... and {notesWithoutSOPs.length - 3} more notes available for
                  SOP generation
                </Typography>
              )}
            </Box>
          )}

          <Divider sx={{ my: 3 }} />

          {/* Approved SOPs */}
          {sops.length > 0 && (
            <Box>
              <Typography
                variant="subtitle1"
                gutterBottom
                sx={{ fontWeight: 600 }}
              >
                ✅ Approved SOPs ({sops.length})
              </Typography>
              {sops.map((sop) => (
                <Card key={sop.id} sx={{ mb: 2, bgcolor: "success.50" }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <ApproveIcon color="success" fontSize="small" />
                      <Typography
                        variant="subtitle2"
                        color="success.main"
                        sx={{ fontWeight: 600 }}
                      >
                        {sop.title}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {sop.sop_draft.substring(0, 150)}...
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          {sops.length === 0 && notesWithoutSOPs.length === 0 && (
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
              sx={{ mt: 4 }}
            >
              No meeting notes available for SOP generation.
            </Typography>
          )}
        </Box>
      </Paper>

      {/* SOP Preview Dialog */}
      <Dialog
        open={previewDialog.open}
        onClose={denySOP}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            minHeight: "70vh",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(40px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#ffffff",
            borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
          }}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center" gap={2}>
              <MagicIcon color="primary" />
              <Typography variant="h6" sx={{ color: "#ffffff" }}>
                SOP Preview
              </Typography>
            </Box>
            <Button
              onClick={toggleEditMode}
              variant="outlined"
              size="small"
              startIcon={editMode ? <SaveIcon /> : <EditIcon />}
              sx={{
                borderColor: "rgba(255, 255, 255, 0.3)",
                color: "#ffffff",
                "&:hover": {
                  borderColor: "#ffffff",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              {editMode ? "Save Changes" : "Edit"}
            </Button>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ color: "#ffffff" }}>
          {previewDialog.sop && (
            <>
              <Typography
                variant="subtitle2"
                sx={{ color: "rgba(255, 255, 255, 0.8)", mb: 1, mt: 2 }}
              >
                Original Meeting Note:
              </Typography>
              <Paper
                elevation={0}
                sx={{
                  mb: 3,
                  p: 2,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  borderRadius: 2,
                  backdropFilter: "blur(10px)",
                }}
              >
                <Typography variant="body2" sx={{ color: "#ffffff" }}>
                  {previewDialog.sop.title}
                </Typography>
              </Paper>

              <Typography
                variant="subtitle2"
                sx={{ color: "rgba(255, 255, 255, 0.8)", mb: 2 }}
              >
                Generated SOP:
              </Typography>

              {editMode ? (
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="SOP Title"
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    sx={{ mb: 2 }}
                    InputLabelProps={{
                      style: { color: "rgba(255, 255, 255, 0.7)" },
                    }}
                    InputProps={{
                      style: { color: "#ffffff" },
                    }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    rows={12}
                    label="SOP Content"
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    InputLabelProps={{
                      style: { color: "rgba(255, 255, 255, 0.7)" },
                    }}
                    InputProps={{
                      style: { color: "#ffffff" },
                    }}
                  />
                </Box>
              ) : (
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.3)",
                    borderRadius: 2,
                    backdropFilter: "blur(15px)",
                  }}
                >
                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: "pre-wrap",
                      lineHeight: 1.6,
                      color: "#ffffff",
                      fontSize: "0.95rem",
                    }}
                  >
                    {previewDialog.sop.sop_draft}
                  </Typography>
                </Paper>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions
          sx={{ p: 3, gap: 2, borderTop: "1px solid rgba(255, 255, 255, 0.2)" }}
        >
          <Button
            onClick={denySOP}
            variant="outlined"
            color="error"
            startIcon={<DenyIcon />}
            sx={{
              borderColor: "rgba(255, 99, 71, 0.5)",
              color: "#ff6347",
              "&:hover": {
                borderColor: "#ff6347",
                backgroundColor: "rgba(255, 99, 71, 0.1)",
              },
            }}
          >
            Deny
          </Button>
          <Button
            onClick={regenerateSOP}
            variant="outlined"
            startIcon={<RegenerateIcon />}
            sx={{
              borderColor: "rgba(255, 193, 7, 0.5)",
              color: "#ffc107",
              "&:hover": {
                borderColor: "#ffc107",
                backgroundColor: "rgba(255, 193, 7, 0.1)",
              },
            }}
          >
            Regenerate
          </Button>
          <Button
            onClick={() => approveSOP(previewDialog.sop)}
            variant="contained"
            color="success"
            startIcon={
              generating[previewDialog.sop?.note_id] ? (
                <CircularProgress size={16} />
              ) : (
                <ApproveIcon />
              )
            }
            disabled={generating[previewDialog.sop?.note_id]}
            sx={{
              backgroundColor: "rgba(76, 175, 80, 0.8)",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "rgba(76, 175, 80, 0.9)",
              },
            }}
          >
            {generating[previewDialog.sop?.note_id]
              ? "Approving..."
              : "Approve & Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default SopPanel;
