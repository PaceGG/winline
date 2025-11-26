import {
  AppBar,
  Box,
  Button,
  Chip,
  Fade,
  Modal,
  Popover,
  Popper,
  Stack,
  Typography,
  type ButtonProps,
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
import { userAPI } from "../api/endpoints/user";

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
  const [userInfoAnchorEl, setUserInfoAnchorEl] =
    useState<HTMLElement | null>();
  const userInfoOpen = Boolean(userInfoAnchorEl);

  const handleUserInfoClick = (event: MouseEvent<HTMLElement>) => {
    setUserInfoAnchorEl(event.currentTarget);
  };

  const handleUserInfoClose = (event: MouseEvent<HTMLElement>) => {
    setUserInfoAnchorEl(null);
  };

  // ID
  const [copyUserIdInfoAnchorEl, setCopyUserIdInfoAnchorEl] =
    useState<HTMLElement | null>();
  const copyUserIdInfoOpen = Boolean(copyUserIdInfoAnchorEl);

  const copyUserId = (event: MouseEvent<HTMLElement>) => {
    navigator.clipboard.writeText(user?.id ?? "");
    setCopyUserIdInfoAnchorEl(event.currentTarget);
    setTimeout(() => {
      setCopyUserIdInfoAnchorEl(null);
    }, 1500);
  };

  // Баланс
  const balanceFields: FormField[] = [
    {
      name: "amount",
      label: "Сумма пополнения",
      type: "number",
      required: true,
    },
  ];
  const [balanceModalOpen, setBalanceModalOpen] = useState(false);

  const onBalanceModalClose = () => {
    setBalanceModalOpen(false);
  };

  const handleBalance = async (data: Record<string, any>) => {
    if (!user) return;
    const response = await userAPI.updateBalance(user.id, Number(data.amount));
    dispatch(setUser(response.data));
    onBalanceModalClose();
  };

  const cancelBalance = () => {
    onBalanceModalClose();
  };

  // Логин
  const userLoginFields: FormField[] = [
    { name: "login", label: "Имя", type: "text", required: true },
  ];
  const [userLoginModalOpen, setUserLoginModalOpen] = useState(false);

  const onUserLoginModalClose = () => {
    setUserLoginModalOpen(false);
  };

  const handleUserLogin = async (data: Record<string, any>) => {
    if (!user) return;
    const response = await userAPI.updateLogin(user.id, data.login);
    dispatch(setUser(response.data));
    onUserLoginModalClose();
  };

  const cancelUserLogin = () => {
    onUserLoginModalClose();
  };

  // Почта
  const mailFields: FormField[] = [
    { name: "email", label: "Почта", type: "email", required: true },
  ];
  const [mailModalOpen, setMailModalOpen] = useState(false);

  const [newMailErrorMessage, setNewMailErrorMessage] = useState<string>();

  const onMailModalClose = () => {
    setMailModalOpen(false);
    setNewMailErrorMessage("");
  };

  const handleMail = async (data: Record<string, any>) => {
    if (!user) return;
    try {
      const response = await userAPI.updateEmail(user.id, data.email);
      dispatch(setUser(response.data));
      console.log(response.data);
      onMailModalClose();
    } catch (error: any) {
      if (error.response.status == 409) {
        setNewMailErrorMessage("Пользователь с таким email уже существует");
      }
    }
  };

  const cancelMail = () => {
    onMailModalClose();
  };

  // Пароль
  const passwordFields: FormField[] = [
    {
      name: "currentPassword",
      label: "Текущий пароль",
      type: "password",
      required: true,
    },
    {
      name: "newPassword",
      label: "Новый пароль",
      type: "password",
      required: true,
    },
    {
      name: "confirmPassword",
      label: "Подтвердите новый пароль",
      type: "password",
      required: true,
    },
  ];
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  const [newPasswordErrorMessage, setNewPasswordErrorMessage] =
    useState<string>();

  const onPasswordModalClose = () => {
    setPasswordModalOpen(false);
    setNewPasswordErrorMessage("");
  };

  const handlePassword = async (data: Record<string, any>) => {
    if (!user) return;

    // Проверка совпадения новых паролей
    if (data.newPassword !== data.confirmPassword) {
      setNewPasswordErrorMessage("Новые пароли не совпадают");
      return;
    }

    try {
      const response = await userAPI.updatePassword(
        user.id,
        data.currentPassword,
        data.newPassword
      );
      dispatch(setUser(response.data));
      onPasswordModalClose();
    } catch (error) {
      console.error("Ошибка при изменении пароля:", error);
      setNewPasswordErrorMessage(
        "Ошибка при изменении пароля. Проверьте текущий пароль."
      );
    }
  };

  const cancelPassword = () => {
    onPasswordModalClose();
  };

  // Роли
  const userRoleMap = {
    USER: "Пользователь",
    ADMIN: "Администратор",
    SUPPORT: "Служба поддержки",
    NONE: "",
  };

  // Статус
  const userStatusMap = {
    ACTIVE: "Активный",
    BLOCKED: "Заблокирован",
  };

  const buttonConfigs: { userInfo: ButtonProps } = {
    userInfo: {
      variant: "text",
      sx: {
        textAlign: "left",
        justifyContent: "flex-start",
        color: "black",
        "&:nth-of-type(odd)": { backgroundColor: "#f8f9fa" },
        "&:nth-of-type(even)": { backgroundColor: "#e9ecef" },
      },
    },
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
                <Typography>Баланс: {user?.balance ?? 0} </Typography>
              </Box>
              <Box>
                <Button variant="text" onClick={handleUserInfoClick}>
                  {user?.login}
                </Button>
                {user && (
                  <Popover
                    open={userInfoOpen}
                    onClose={handleUserInfoClose}
                    anchorEl={userInfoAnchorEl}
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
                      <Stack gap={1}>
                        {/* ID */}
                        <Button
                          onClick={copyUserId}
                          {...buttonConfigs.userInfo}
                          sx={{ color: "#a1a1a1ff", fontSize: 12 }}
                        >
                          ID: {user.id}
                        </Button>
                        <Popper
                          open={copyUserIdInfoOpen}
                          anchorEl={copyUserIdInfoAnchorEl}
                          sx={{ zIndex: 2000 }}
                          placement="top"
                          transition
                        >
                          {({ TransitionProps }) => (
                            <Fade {...TransitionProps} timeout={350}>
                              <Chip label="Скопировано" color="primary" />
                            </Fade>
                          )}
                        </Popper>

                        {/* БАЛАНС */}
                        <Button
                          {...buttonConfigs.userInfo}
                          onClick={() => setBalanceModalOpen(true)}
                        >
                          Баланс: {user.balance}
                        </Button>
                        <Modal
                          open={balanceModalOpen}
                          onClose={onBalanceModalClose}
                        >
                          <FormComponent
                            title="Пополнение баланса"
                            fields={balanceFields}
                            onSubmit={handleBalance}
                            onCancel={cancelBalance}
                            submitText="Пополнить"
                            absolute
                          />
                        </Modal>

                        {/* Логин */}
                        <Button
                          {...buttonConfigs.userInfo}
                          onClick={() => setUserLoginModalOpen(true)}
                        >
                          {user.login}
                        </Button>
                        <Modal
                          open={userLoginModalOpen}
                          onClose={onUserLoginModalClose}
                        >
                          <FormComponent
                            title="Изменение логина"
                            fields={userLoginFields}
                            onSubmit={handleUserLogin}
                            onCancel={cancelUserLogin}
                            submitText="Изменить"
                            absolute
                          />
                        </Modal>

                        {/* Почта */}
                        <Button
                          {...buttonConfigs.userInfo}
                          onClick={() => setMailModalOpen(true)}
                        >
                          {user.email}
                        </Button>
                        <Modal open={mailModalOpen} onClose={onMailModalClose}>
                          <FormComponent
                            title="Изменение почты"
                            fields={mailFields}
                            onSubmit={handleMail}
                            onCancel={cancelMail}
                            submitText="Изменить"
                            absolute
                            errorMessage={newMailErrorMessage}
                          />
                        </Modal>

                        {/* Пароль */}
                        <Button
                          {...buttonConfigs.userInfo}
                          onClick={() => setPasswordModalOpen(true)}
                        >
                          Изменить пароль
                        </Button>
                        <Modal
                          open={passwordModalOpen}
                          onClose={onPasswordModalClose}
                        >
                          <FormComponent
                            title="Изменение пароля"
                            fields={passwordFields}
                            onSubmit={handlePassword}
                            onCancel={cancelPassword}
                            submitText="Изменить"
                            absolute
                            errorMessage={newPasswordErrorMessage}
                          />
                        </Modal>

                        {/* Роль и статус*/}
                        <Button {...buttonConfigs.userInfo}>
                          {userRoleMap[user.role]} /{" "}
                          {userStatusMap[user.status]}
                        </Button>

                        {/* Дата создания */}
                        <Button {...buttonConfigs.userInfo}>
                          Создан{" "}
                          {user.createdAt instanceof Date
                            ? user.createdAt.toLocaleString("ru-RU")
                            : new Date(user.createdAt).toLocaleString("ru-RU")}
                        </Button>

                        {/* Выйти из аккаунта */}
                        <Button {...buttonConfigs.userInfo} onClick={logout}>
                          Выйти
                        </Button>
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
