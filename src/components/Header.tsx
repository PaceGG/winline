import { AppBar, Box, Button, Typography } from "@mui/material";
import Logo from "./Logo";
import NavBar from "./NavBar";
import type { LinkProps } from "./Link";
import RowStack from "./RowStack";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { setUser } from "../store/userAuthSlice";
import { useEffect } from "react";
import { WithRole } from "./WithRole";

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
  const role = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(role);
  }, [role]);

  const login = () => {
    dispatch(setUser("user"));
  };

  const logout = () => {
    dispatch(setUser("none"));
  };

  return (
    <AppBar
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        bgcolor: "#edf0f5",
        color: "black",
        px: 30,
        py: 1,
      }}
    >
      <RowStack gap={6}>
        <Logo />
        <NavBar links={navBarLinks} />
      </RowStack>

      <WithRole allowedRoles="none">
        <RowStack>
          <Button color="secondary" onClick={login}>
            Вход
          </Button>
          {/* <Button>Регистрация</Button> */}
        </RowStack>
      </WithRole>

      <WithRole allowedRoles="user">
        <RowStack>
          <Box>
            <Typography>Баланс: 0</Typography>
          </Box>
          <Button onClick={logout}>Выход</Button>
        </RowStack>
      </WithRole>
    </AppBar>
  );
}
