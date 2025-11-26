import {
  AppBar,
  Box,
  Button,
  Modal,
  Popover,
  Stack,
  Typography,
} from "@mui/material";
import Logo from "./Logo";
import NavBar from "./NavBar";
import type { LinkProps } from "./Link";
import RowStack from "./RowStack";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { useEffect, useState } from "react";
import { WithRole } from "./WithRole";
import FormComponent, { type FormField } from "./FormComponent";
import { authAPI } from "../api/endpoints/auth";
import { setUser } from "../store/userSlice";

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
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    console.log(user);
  }, [user]);

  const logout = () => {
    dispatch(setUser(null));
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
      dispatch(setUser(userData));
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

  const [registerErrorMessage, setRegisterErrorMessage] = useState<string>();

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
    try {
      const userData = await authAPI.register(registerRequest);
      console.log("Зарегестрирован новый пользователь: ", userData);
      dispatch(setUser(userData));
      setRegisterModalOpen(false);
    } catch (error: any) {
      if (error.response?.status == 409) {
        setRegisterErrorMessage("Пользователь с таким email уже существует");
      } else {
        setRegisterErrorMessage("Произошла ошибка при регистрации");
      }
    }
  };

  const cancelRegister = () => {
    setRegisterModalOpen(false);
    setRegisterErrorMessage("");
  };

  // Информация о пользователе
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>();
  const userInfoOpen = Boolean(anchorEl);

  const handleUserInfoClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserInfoClose = () => {
    setAnchorEl(null);
  };

  const userRoleMap = {
    USER: "Пользователь",
    ADMIN: "Администратор",
    SUPPORT: "Служба поддержки",
    NONE: "",
  };

  const userStatusMap = {
    ACTIVE: "Активный",
    BLOCKED: "Заблокирован",
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

          <WithRole allowedRoles="NONE">
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
                  errorMessage={registerErrorMessage}
                />
              </Modal>
            </RowStack>
          </WithRole>

          <WithRole allowedRoles="USER">
            <RowStack>
              <Box>
                <Typography>Баланс: 0 </Typography>
              </Box>
              <Box>
                <Button variant="text" onClick={handleUserInfoClick}>
                  {user?.login}
                </Button>
                {user && (
                  <Popover
                    open={userInfoOpen}
                    onClose={handleUserInfoClose}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "right",
                    }}
                  >
                    <Box sx={{ p: 2 }}>
                      <Stack>
                        <Typography>Баланс: {user.balance}</Typography>
                        <Typography>{user.email}</Typography>
                        <Typography>{userRoleMap[user.role]}</Typography>
                        <Typography>{userStatusMap[user.status]}</Typography>
                        <Typography>
                          Создан{" "}
                          {user.createdAt instanceof Date
                            ? user.createdAt.toLocaleString("ru-RU")
                            : new Date(user.createdAt).toLocaleString("ru-RU")}
                        </Typography>
                      </Stack>
                    </Box>
                  </Popover>
                )}
              </Box>
              <Button onClick={logout}>Выход</Button>
            </RowStack>
          </WithRole>
        </Box>
      </AppBar>
    </>
  );
}
