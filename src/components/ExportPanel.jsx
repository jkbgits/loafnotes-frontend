import React, { useState } from "react";
import {
  Paper,
  Typography,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { Download as DownloadIcon } from "@mui/icons-material";
import { useData } from "../context/DataContext";

const ExportPanel = () => {
  const { notes, sops } = useData();
  const [exportFormat, setExportFormat] = useState("json");
  const [exportType, setExportType] = useState("all");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleExport = async () => {
    try {
      let data, filename;

      switch (exportType) {
        case "all":
          data = notes;
          filename = `meeting-notes-${new Date().toISOString().split("T")[0]}`;
          break;
        case "sops":
          data = sops;
          filename = `sop-drafts-${new Date().toISOString().split("T")[0]}`;
          break;
        default:
          data = notes;
          filename = "export";
      }

      let content = "";
      let mimeType = "";

      if (exportFormat === "json") {
        content = JSON.stringify(data, null, 2);
        mimeType = "application/json";
        filename += ".json";
      } else if (exportFormat === "csv") {
        // Convert to CSV
        if (data.length === 0) {
          content = "No data to export";
        } else {
          const headers = Object.keys(data[0]).join(",");
          const rows = data.map((item) =>
            Object.values(item)
              .map((val) =>
                typeof val === "string" ? `"${val.replace(/"/g, '""')}"` : val
              )
              .join(",")
          );
          content = [headers, ...rows].join("\n");
        }
        mimeType = "text/csv";
        filename += ".csv";
      } else if (exportFormat === "txt") {
        // Convert to readable text
        content = data
          .map((item) => {
            let text = `Title: ${item.title}\n`;
            text += `Content: ${item.content}\n`;
            if (item.sop_draft) {
              text += `SOP Draft: ${item.sop_draft}\n`;
            }
            text += "\n" + "=".repeat(80) + "\n\n";
            return text;
          })
          .join("");
        mimeType = "text/plain";
        filename += ".txt";
      }

      // Create and download file
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: `Successfully exported ${
          data.length
        } items as ${exportFormat.toUpperCase()}`,
        severity: "success",
      });
    } catch (err) {
      console.error("Export failed:", err);
      setSnackbar({
        open: true,
        message: "Export failed. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h6" color="primary" gutterBottom>
          Export Data
        </Typography>

        <Box display="flex" gap={2} mb={3}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Export Type</InputLabel>
            <Select
              value={exportType}
              label="Export Type"
              onChange={(e) => setExportType(e.target.value)}
            >
              <MenuItem value="all">All Notes</MenuItem>
              <MenuItem value="sops">SOP Drafts Only</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Format</InputLabel>
            <Select
              value={exportFormat}
              label="Format"
              onChange={(e) => setExportFormat(e.target.value)}
            >
              <MenuItem value="json">JSON</MenuItem>
              <MenuItem value="csv">CSV</MenuItem>
              <MenuItem value="txt">Text</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            color="primary"
            onClick={handleExport}
            startIcon={<DownloadIcon />}
          >
            Export
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary">
          Export your meeting notes and SOPs in various formats for backup or
          sharing.
        </Typography>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ExportPanel;
