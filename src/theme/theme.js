import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#12dee6", // Modern blue-purple
    },
    secondary: {
      main: "#764ba2", // Complementary purple
    },
    background: {
      default: "linear-gradient(135deg, #12dee6 0%, #764ba2 100%)",
      paper: "rgba(255, 255, 255, 0.1)", // Light transparent for components
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.8)",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
      color: "#ffffff",
    },
    h6: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
      color: "#ffffff",
    },
    subtitle1: {
      color: "#ffffff",
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 20,
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          // Default light glassmorphism for all papers
          backdropFilter: "blur(20px)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "none",
          // Only apply heavy glassmorphism to main container papers with elevation={3}
          ...(ownerState?.elevation === 3 && {
            backdropFilter: "blur(40px)",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              transform: "translateY(-2px)",
              boxShadow: "0 12px 40px 0 rgba(31, 38, 135, 0.4)",
            },
          }),
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          boxShadow: "none",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.12)",
            transform: "none",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(30px)",
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
        },
        contained: {
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          "&:hover": {
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.2) 100%)",
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(25px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "none",
          "&:before": {
            display: "none",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(20px)",
            "& fieldset": {
              borderColor: "rgba(255, 255, 255, 0.3)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(255, 255, 255, 0.5)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "rgba(255, 255, 255, 0.8)",
            },
          },
          "& .MuiInputLabel-root": {
            color: "rgba(255, 255, 255, 0.8)",
          },
          "& .MuiOutlinedInput-input": {
            color: "#ffffff",
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h4: {
          color: "#ffffff",
        },
        h6: {
          color: "#ffffff",
        },
        subtitle1: {
          color: "#ffffff",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(15px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "none",
          color: "#ffffff",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(40px)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          color: "#ffffff",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: "#ffffff",
          borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          color: "#ffffff",
          "& .MuiTypography-root": {
            color: "#ffffff",
          },
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          // Custom scrollbar styling
          "*::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "*::-webkit-scrollbar-track": {
            background: "rgba(255, 255, 255, 0.1)",
            borderRadius: "10px",
          },
          "*::-webkit-scrollbar-thumb": {
            background: "rgba(255, 255, 255, 0.3)",
            borderRadius: "10px",
            "&:hover": {
              background: "rgba(255, 255, 255, 0.5)",
            },
          },
          "*::-webkit-scrollbar-corner": {
            background: "transparent",
          },
          // Firefox scrollbar styling
          "*": {
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(255, 255, 255, 0.3) rgba(255, 255, 255, 0.1)",
          },
        },
      },
    },
  },
});

export default theme;
