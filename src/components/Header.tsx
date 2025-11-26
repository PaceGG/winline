import { AppBar, Box } from "@mui/material";
import Logo from "./Logo";

export default function Header() {
  return (
    <AppBar>
      <Logo />
      <Box>Header</Box>
    </AppBar>
  );
}
