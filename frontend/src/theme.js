import { alpha, createTheme } from "@mui/material/styles";

const ink = "#18212f";
const teal = "#0f766e";
const coral = "#e76f51";
const mint = "#dff6ee";
const linen = "#fff8ef";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: teal,
      dark: "#0b5852",
      light: "#57b6aa",
      contrastText: "#ffffff",
    },
    secondary: {
      main: coral,
      light: "#f5a491",
      dark: "#b9462c",
      contrastText: "#ffffff",
    },
    success: {
      main: "#17b26a",
    },
    warning: {
      main: "#f79009",
    },
    error: {
      main: "#d92d20",
    },
    background: {
      default: "#fbfaf7",
      paper: "#ffffff",
    },
    text: {
      primary: ink,
      secondary: "#5f6b7a",
    },
    divider: alpha(ink, 0.08),
  },
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: '"ITC Avant Garde Gothic Std", "Avenir Next", "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Secular One", "ITC Avant Garde Gothic Std", sans-serif',
      fontSize: "3.4rem",
      lineHeight: 1,
    },
    h2: {
      fontFamily: '"Secular One", "ITC Avant Garde Gothic Std", sans-serif',
      fontSize: "2.7rem",
      lineHeight: 1.04,
    },
    h3: {
      fontWeight: 700,
      fontSize: "2rem",
    },
    h4: {
      fontWeight: 700,
      fontSize: "1.6rem",
    },
    h5: {
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { scrollbarWidth: "thin" },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#ffffff", 0.78),
          backdropFilter: "blur(16px)",
          color: ink,
          borderBottom: `1px solid ${alpha(ink, 0.06)}`,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingInline: 18,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "0 14px 34px rgba(24, 33, 47, 0.08)",
          border: `1px solid ${alpha(ink, 0.06)}`,
          backgroundImage: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: `linear-gradient(180deg, ${ink} 0%, #26364b 100%)`,
          color: "#ffffff",
        },
      },
    },
  },
  custom: {
    ink,
    mint,
    linen,
  },
});
