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
import type { User } from "../types";
import type { UserData } from "../api/types/user";

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

  // Форма входа
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const [loginErrorMessage, setLoginErrorMessage] = useState<string>();

  const onLoginModalClose = () => {
    cancelLogin();
  };

  const loginFields: FormField[] = [
    { name: "email", label: "Почта", type: "text", required: true },
    { name: "password", label: "Пароль", type: "password", required: true },
  ];

  const handleLogin = async (data: Record<string, any>) => {
    const loginRequest = {
      email: data.email,
      password: data.password,
    };
    try {
      const userData = await authAPI.login(loginRequest);
      console.log("Успешный вход:", userData);
      setLoginModalOpen(false);
    } catch (error: any) {
      if (error.response?.status === 401) {
        setLoginErrorMessage("Неверная почта или пароль");
      } else {
        setLoginErrorMessage("Произошла ошибка при входе");
      }
    }
  };

  const cancelLogin = () => {
    setLoginModalOpen(false);
    setLoginErrorMessage("");
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

  const handleRegister = async (data: Record<string, any>) => {
    const registerRequest = {
      login: data.login,
      email: data.email,
      password: data.password,
    };
    await authAPI.register(registerRequest);
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
              <Button color="secondary" onClick={() => setLoginModalOpen(true)}>
                Вход
              </Button>
              <Modal open={loginModalOpen} onClose={onLoginModalClose}>
                <FormComponent
                  absolute
                  title="Вход"
                  fields={loginFields}
                  onSubmit={handleLogin}
                  onCancel={cancelLogin}
                  submitText="Войти"
                  cancelText="Отмена"
                  errorMessage={loginErrorMessage}
                />
              </Modal>
              {/* Регистрация */}
              <Button onClick={() => setRegisterModalOpen(true)}>
                Регистрация
              </Button>
              <Modal open={registerModalOpen} onClose={onRegisterModalClose}>
                <FormComponent
                  absolute
                  title="Регистрация"
                  fields={registerFields}
                  onSubmit={handleRegister}
                  onCancel={cancelRegister}
                  submitText="Зарегестрироваться"
                  cancelText="Отмена"
                />
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
