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
  Snackbar,
  Alert,
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
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Link as DomLink, useLocation, useNavigate } from "react-router-dom";

const navBarLinks: LinkProps[] = [
  {
    label: "Матчи",
    href: "matches",
  },
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

import { useModal, useModalWithError, useFormModal } from "../hooks/useModal";
import { toast } from "../utils/toast";

export default function Header() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  // Логика входа
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(location);
  }, [location]);

  const handleLogin = () => {
    localStorage.setItem("lastpath", location.pathname);
    navigate("/register");
  };

  // Логика регистрации
  const registerModal = useModalWithError();

  const registerFields: FormField[] = [
    { name: "login", label: "Имя", type: "text", required: true },
    { name: "email", label: "Почта", type: "text", required: true },
    { name: "password", label: "Пароль", type: "password", required: true },
  ];

  const handleRegister = () => {
    localStorage.setItem("lastpath", location.pathname);
    navigate("/login");
  };

  // Модалка пополнения баланса
  const balanceModal = useModal();

  const balanceFields: FormField[] = [
    {
      name: "amount",
      label: "Сумма пополнения",
      type: "number",
      required: true,
    },
  ];

  const handleBalance = async (data: Record<string, any>) => {
    if (!user) return;
    const response = await userAPI.increaseBalance(
      user.id,
      Number(data.amount)
    );
    dispatch(setUser(response.data));
    balanceModal.closeModal();
    toast.success("Баланс успешно пополнен");
  };

  // Модалка изменения логина
  const userLoginModal = useModal();

  const userLoginFields: FormField[] = [
    { name: "login", label: "Имя", type: "text", required: true },
  ];

  const handleUserLogin = async (data: Record<string, any>) => {
    if (!user) return;
    const response = await userAPI.updateLogin(user.id, data.login);
    dispatch(setUser(response.data));
    userLoginModal.closeModal();
    toast.success("Логин успешно изменен");
  };

  // Модалка изменения почты
  const mailModal = useModalWithError();

  const mailFields: FormField[] = [
    { name: "email", label: "Почта", type: "email", required: true },
  ];

  const handleMail = async (data: Record<string, any>) => {
    if (!user) return;
    try {
      const response = await userAPI.updateEmail(user.id, data.email);
      dispatch(setUser(response.data));
      mailModal.closeModalWithReset();
      toast.success("Email успешно изменен");
    } catch (error: any) {
      if (error.response.status == 409) {
        mailModal.setError("Пользователь с таким email уже существует");
      }
    }
  };

  // Модалка изменения пароля
  const passwordModal = useModalWithError();

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

  const handlePassword = async (data: Record<string, any>) => {
    if (!user) return;

    if (data.newPassword !== data.confirmPassword) {
      passwordModal.setError("Новые пароли не совпадают");
      return;
    }

    try {
      const response = await userAPI.updatePassword(
        user.id,
        data.currentPassword,
        data.newPassword
      );
      dispatch(setUser(response.data));
      passwordModal.closeModalWithReset();
      toast.success("Пароль успешно изменен");
    } catch (error) {
      console.error("Ошибка при изменении пароля:", error);
      passwordModal.setError(
        "Ошибка при изменении пароля. Проверьте текущий пароль."
      );
    }
  };

  // Информация о пользователе
  const [userInfoAnchorEl, setUserInfoAnchorEl] =
    useState<HTMLElement | null>();
  const userInfoOpen = Boolean(userInfoAnchorEl);

  const handleUserInfoClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserInfoAnchorEl(event.currentTarget);
  };

  const handleUserInfoClose = (event: React.MouseEvent<HTMLElement>) => {
    setUserInfoAnchorEl(null);
  };

  // ID
  const [copyUserIdInfoAnchorEl, setCopyUserIdInfoAnchorEl] =
    useState<HTMLElement | null>();
  const copyUserIdInfoOpen = Boolean(copyUserIdInfoAnchorEl);

  const copyUserId = (event: React.MouseEvent<HTMLElement>) => {
    navigator.clipboard.writeText(user?.id ?? "");
    setCopyUserIdInfoAnchorEl(event.currentTarget);
    toast.success("ID пользователя скопирован в буфер обмена");
    setTimeout(() => {
      setCopyUserIdInfoAnchorEl(null);
    }, 1500);
  };

  const logout = () => {
    dispatch(setUser(null));
    toast.success("Вы успешно вышли из аккаунта");
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

  return (
    <>
      <AppBar
        sx={{ bgcolor: "#edf0f5", color: "black", padding: "8px 0 !important" }}
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
            <DomLink to="/">
              <Logo />
            </DomLink>
            <NavBar links={navBarLinks} />
          </RowStack>

          <WithRole allowedRoles="NONE">
            <RowStack>
              <Button color="secondary" onClick={handleLogin}>
                Вход
              </Button>
              <Button onClick={handleRegister}>Регистрация</Button>
            </RowStack>
          </WithRole>

          <WithRole allowedRoles="USER">
            <RowStack>
              <Box>
                {user && (
                  <>
                    <Chip
                      label={`Баланс: ${user.balance}`}
                      onClick={balanceModal.openModal}
                      clickable
                      icon={<AddCircleOutlineIcon />}
                      color="success"
                      size="medium"
                      sx={{
                        flexDirection: "row-reverse",
                        color: "white",
                        "& .MuiChip-icon": {
                          marginLeft: "0px",
                          marginRight: "8px",
                        },
                      }}
                    />
                    <Modal
                      open={balanceModal.isOpen}
                      onClose={balanceModal.closeModal}
                    >
                      <FormComponent
                        title="Пополнение баланса"
                        fields={balanceFields}
                        onSubmit={handleBalance}
                        onCancel={balanceModal.closeModal}
                        submitText="Пополнить"
                        absolute
                      />
                    </Modal>
                  </>
                )}
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
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    transformOrigin={{ vertical: "top", horizontal: "right" }}
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
                          onClick={balanceModal.openModal}
                        >
                          Баланс: {user.balance}
                        </Button>

                        {/* Логин */}
                        <Button
                          {...buttonConfigs.userInfo}
                          onClick={userLoginModal.openModal}
                        >
                          {user.login}
                        </Button>
                        <Modal
                          open={userLoginModal.isOpen}
                          onClose={userLoginModal.closeModal}
                        >
                          <FormComponent
                            title="Изменение логина"
                            fields={userLoginFields}
                            onSubmit={handleUserLogin}
                            onCancel={userLoginModal.closeModal}
                            submitText="Изменить"
                            absolute
                          />
                        </Modal>

                        {/* Почта */}
                        <Button
                          {...buttonConfigs.userInfo}
                          onClick={mailModal.openModal}
                        >
                          {user.email}
                        </Button>
                        <Modal
                          open={mailModal.isOpen}
                          onClose={mailModal.closeModalWithReset}
                        >
                          <FormComponent
                            title="Изменение почты"
                            fields={mailFields}
                            onSubmit={handleMail}
                            onCancel={mailModal.closeModalWithReset}
                            submitText="Изменить"
                            absolute
                            errorMessage={mailModal.error}
                          />
                        </Modal>

                        {/* Пароль */}
                        <Button
                          {...buttonConfigs.userInfo}
                          onClick={passwordModal.openModal}
                        >
                          Изменить пароль
                        </Button>
                        <Modal
                          open={passwordModal.isOpen}
                          onClose={passwordModal.closeModalWithReset}
                        >
                          <FormComponent
                            title="Изменение пароля"
                            fields={passwordFields}
                            onSubmit={handlePassword}
                            onCancel={passwordModal.closeModalWithReset}
                            submitText="Изменить"
                            absolute
                            errorMessage={passwordModal.error}
                          />
                        </Modal>

                        {/* Роль и статус */}
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
