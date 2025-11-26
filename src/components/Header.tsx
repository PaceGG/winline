import { AppBar, Button } from "@mui/material";
import Logo from "./Logo";
import NavBar from "./NavBar";
import type { LinkProps } from "./Link";
import RowStack from "./RowStack";

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
      <RowStack gap={6}>
        <Logo />
        <NavBar links={navBarLinks} />
      </RowStack>
      <RowStack>
        <Button color="secondary">Вход</Button>
        <Button>Регистрация</Button>
      </RowStack>
    </AppBar>
  );
}
