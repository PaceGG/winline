import { blue, deepPurple, orange, red } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: blue[500],
      light: blue[300],
      dark: blue[700],
      contrastText: "#fff",
    },
    secondary: {
      main: deepPurple[500],
      light: deepPurple[300],
      dark: deepPurple[700],
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ff9800",
    },
    info: {
      main: "#2196f3",
    },
    success: {
      main: "#4caf50",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        variant: "contained",
      },
    },
  },
});
