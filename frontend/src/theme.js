import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0b6e4f",
    },
    secondary: {
      main: "#f0a202",
    },
    background: {
      default: "#f4f7f1",
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: '"Trebuchet MS", "Segoe UI", sans-serif',
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 18,
  },
});
