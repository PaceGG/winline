import { AppBar, Box, Button, Modal, Typography } from "@mui/material";
import Logo from "./Logo";
import NavBar from "./NavBar";
import type { LinkProps } from "./Link";
import RowStack from "./RowStack";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { setUser } from "../store/userAuthSlice";
import { useEffect, useState } from "react";
import { WithRole } from "./WithRole";
import FormComponent, { type FormField } from "./FormComponent";
import { authAPI } from "../api/endpoints/auth";

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

  // Форма регистрации
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  const onRegisterModalClose = () => {
    setRegisterModalOpen(false);
  };

  const registerFields: FormField[] = [
    { name: "login", label: "Имя", type: "text", required: true },
    {
      name: "email",
      label: "Почта",
      type: "text",
      required: true,
      // validation: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
    },
    { name: "password", label: "Пароль", type: "password", required: true },
  ];

  const handleRegister = (data: Record<string, any>) => {
    const registerRequest = {
      login: data.login,
      email: data.email,
      password: data.password,
    };
    authAPI.register(registerRequest);
    setRegisterModalOpen(false);
  };

  const cancelRegister = () => {
    setRegisterModalOpen(false);
  };

  return (
    <>
      <AppBar
        sx={{
          bgcolor: "#edf0f5",
          color: "black",
          py: 1,
        }}
      >
        <Box
          sx={{
            maxWidth: 1280,
            width: "100%",
            px: 1,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            margin: "auto",
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
              {/* Регистрация */}
              <Button onClick={() => setRegisterModalOpen(true)}>
                Регистрация
              </Button>
              <Modal open={registerModalOpen} onClose={onRegisterModalClose}>
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <FormComponent
                    title="Регистрация"
                    fields={registerFields}
                    onSubmit={handleRegister}
                    onCancel={cancelRegister}
                    submitText="Зарегестрироваться"
                    cancelText="Отмена"
                  />
                </Box>
              </Modal>
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
        </Box>
      </AppBar>
    </>
  );
}
