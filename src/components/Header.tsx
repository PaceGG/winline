import { AppBar, Box, Stack } from "@mui/material";
import Logo from "./Logo";
import NavBar from "./NavBar";
import type { LinkProps } from "./Link";

const navBarLinks: LinkProps[] = [
  {
    label: "О нас",
  },
  {
    label: "Live сейчас",
  },
  {
    label: "Экспресс ставки",
  },
  {
    label: "Спорт",
  },
  {
    label: "Киберспорт",
  },
];

export default function Header() {
  return (
    <AppBar
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: "#edf0f5",
        px: 30,
        py: 1,
      }}
    >
      <Stack direction={"row"} alignItems={"center"} gap={5}>
        <Logo />
        <NavBar links={navBarLinks} />
      </Stack>
    </AppBar>
  );
}
