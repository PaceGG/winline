import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Fade,
  Alert,
  useTheme,
  useMediaQuery,
  CircularProgress,
  alpha,
} from "@mui/material";
import {
  Email as EmailIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  PersonAdd as PersonAddIcon,
} from "@mui/icons-material";
import { keyframes } from "@emotion/react";
import Logo from "./Logo";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../api/endpoints/auth";
import { toast } from "../utils/toast";

// Типизация для props компонента
interface LoginFormData {
  email: string;
  password: string;
}

// Анимация пульсации фона
const pulseAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
`;

// Анимация градиента
const gradientAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

export default function LoginPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Имитация задержки API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Валидация
    if (!formData.email || !formData.password) {
      setError("Пожалуйста, заполните все поля");
      setIsLoading(false);
      return;
    }

    // if (!/\S+@\S+\.\S+/.test(formData.email)) {
    //   setError("Введите корректный email адрес");
    //   setIsLoading(false);
    //   return;
    // }

    const loginRequest = {
      email: formData.email,
      password: formData.password,
    };
    try {
      await authAPI.login(loginRequest);
      navigate("/matches");
      toast.success("Вы успешно вошли в аккаунт");
    } catch (error: any) {
      if (error.response?.status === 401) {
        setError("Неверная почта или пароль");
      } else {
        setError("Произошла ошибка при входе");
      }
    }

    console.log("Login attempt:", formData);
    setIsLoading(false);
  };

  const handleSignUp = () => {
    console.log("Redirect to sign up");
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `
          linear-gradient(
            -45deg,
            ${alpha(theme.palette.primary.main, 0.1)},
            ${alpha(theme.palette.secondary.main, 0.1)},
            ${alpha(theme.palette.success.main, 0.1)},
            ${alpha(theme.palette.info.main, 0.1)}
          )
        `,
        backgroundSize: "400% 400%",
        animation: `${gradientAnimation} 15s ease infinite`,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(
              circle at 20% 80%,
              ${alpha(theme.palette.primary.light, 0.15)} 0%,
              transparent 40%
            ),
            radial-gradient(
              circle at 80% 20%,
              ${alpha(theme.palette.secondary.light, 0.15)} 0%,
              transparent 40%
            ),
            radial-gradient(
              circle at 40% 40%,
              ${alpha(theme.palette.info.light, 0.1)} 0%,
              transparent 30%
            )
          `,
          animation: `${pulseAnimation} 8s ease-in-out infinite`,
        },
      }}
    >
      <Fade in timeout={800}>
        <Paper
          elevation={24}
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: isMobile ? "90vw" : 450,
            p: isMobile ? 3 : 4,
            borderRadius: 4,
            background: alpha("#ffffff", 0.95),
            backdropFilter: "blur(10px)",
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
            boxShadow: `
              0 20px 40px ${alpha(theme.palette.common.black, 0.1)},
              0 0 0 1px ${alpha(theme.palette.primary.light, 0.05)}
            `,
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: `linear-gradient(
                90deg,
                ${theme.palette.primary.main},
                ${theme.palette.secondary.main},
                ${theme.palette.success.main}
              )`,
              backgroundSize: "200% 100%",
              animation: `${gradientAnimation} 3s ease infinite`,
            },
          }}
        >
          {/* Декоративные элементы */}
          <Box
            sx={{
              position: "absolute",
              top: -50,
              right: -50,
              width: 100,
              height: 100,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha(
                theme.palette.primary.light,
                0.2
              )} 0%, transparent 70%)`,
              zIndex: 0,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -30,
              left: -30,
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: `radial-gradient(circle, ${alpha(
                theme.palette.secondary.light,
                0.2
              )} 0%, transparent 70%)`,
              zIndex: 0,
            }}
          />

          <Box sx={{ position: "relative", zIndex: 1 }}>
            {/* Заголовок */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Link to={"/matches"}>
                <Logo />
              </Link>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ opacity: 0.8 }}
              >
                Войдите в свою учетную запись чтобы продолжить
              </Typography>
            </Box>

            {/* Форма */}
            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
              {error && (
                <Fade in>
                  <Alert
                    severity="error"
                    sx={{ mb: 3, borderRadius: 2 }}
                    onClose={() => setError(null)}
                  >
                    {error}
                  </Alert>
                </Fade>
              )}

              <TextField
                fullWidth
                label="Email"
                name="email"
                // type="email"
                value={formData.email}
                onChange={handleChange}
                sx={{ mb: 2.5 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "primary.main", opacity: 0.8 }} />
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                size="medium"
                disabled={isLoading}
              />

              <TextField
                fullWidth
                label="Пароль"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "primary.main", opacity: 0.8 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        sx={{ color: "text.secondary" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                variant="outlined"
                size="medium"
                disabled={isLoading}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading}
                startIcon={
                  isLoading ? <CircularProgress size={20} /> : <LoginIcon />
                }
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: "1rem",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 30%, ${theme.palette.secondary.main} 90%)`,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                    boxShadow: `0 10px 20px ${alpha(
                      theme.palette.primary.main,
                      0.3
                    )}`,
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                }}
              >
                {isLoading ? "Вход..." : "Войти"}
              </Button>
            </Box>

            {/* Регистрация */}
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 1, opacity: 0.8 }}
              >
                Нет учетной записи?
              </Typography>
              <Button
                variant="text"
                onClick={handleSignUp}
                disabled={isLoading}
                startIcon={<PersonAddIcon />}
                sx={{
                  fontWeight: 600,
                  color: "primary.main",
                  "&:hover": {
                    background: alpha(theme.palette.primary.main, 0.05),
                  },
                }}
              >
                Зарегистрироваться
              </Button>
            </Box>

            {/* Footer */}
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                textAlign: "center",
                mt: 4,
                opacity: 0.6,
                fontSize: "0.75rem",
              }}
            >
              © 2025 Все права защищены. Точно супер мега ласт додеп.
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}
