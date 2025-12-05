import React from "react";
import {
  Box,
  Button,
  TextField,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

// Типы для полей формы
export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "password" | "number" | "select" | "checkbox";
  required?: boolean;
  options?: { value: string; label: string }[]; // для select
  defaultValue?: string | number | boolean;
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
}

// Пропсы компонента
interface FormProps {
  title?: string;
  fields: FormField[];
  onSubmit: (data: Record<string, any>) => void;
  onCancel: () => void;
  submitText?: string;
  cancelText?: string;
  loading?: boolean;
  absolute?: boolean;
  errorMessage?: string;
}

const FormComponent: React.FC<FormProps> = ({
  title,
  fields,
  onSubmit,
  onCancel,
  submitText = "Сохранить",
  cancelText = "Отмена",
  loading = false,
  absolute = false,
  errorMessage,
}) => {
  const [formData, setFormData] = React.useState<Record<string, any>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Инициализация формы значениями по умолчанию
  React.useEffect(() => {
    const initialData: Record<string, any> = {};
    fields.forEach((field) => {
      initialData[field.name] = field.defaultValue || "";
    });
    setFormData(initialData);
  }, [fields]);

  const handleChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Очищаем ошибку при изменении поля
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: "",
      }));
    }
  };

  const validateField = (field: FormField, value: any): string => {
    if (field.required) {
      if (field.type === "checkbox") {
        if (value !== true) {
          return "Это поле обязательно для заполнения";
        }
      } else if (!value && value !== 0) {
        return "Это поле обязательно для заполнения";
      }
    }

    if (field.validation) {
      const { pattern, minLength, maxLength, min, max } = field.validation;

      if (pattern && typeof value === "string" && !pattern.test(value)) {
        return "Неверный формат";
      }

      if (minLength && typeof value === "string" && value.length < minLength) {
        return `Минимальная длина: ${minLength} символов`;
      }

      if (maxLength && typeof value === "string" && value.length > maxLength) {
        return `Максимальная длина: ${maxLength} символов`;
      }

      if (min !== undefined || max !== undefined) {
        const numValue = parseFloat(value);

        if (isNaN(numValue)) {
          return "Введите число";
        }

        if (min !== undefined && numValue < min) {
          return `Минимальное значение: ${min}`;
        }

        if (max !== undefined && numValue > max) {
          return `Максимальное значение: ${max}`;
        }
      }
    }

    return "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация всех полей
    const newErrors: Record<string, string> = {};
    let isValid = true;

    fields.forEach((field) => {
      const error = validateField(field, formData[field.name]);
      if (error) {
        newErrors[field.name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (isValid) {
      onSubmit(formData);
    }
  };

  const renderField = (field: FormField) => {
    const commonProps = {
      label: field.label,
      required: field.required,
      error: !!errors[field.name],
      helperText: errors[field.name],
      disabled: loading,
      fullWidth: true,
    };

    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "number":
        return (
          <TextField
            id={field.name}
            {...commonProps}
            type={field.type}
            value={formData[field.name] || ""}
            onChange={(e) => handleChange(field.name, e.target.value)}
          />
        );

      case "select":
        return (
          <FormControl
            fullWidth
            error={!!errors[field.name]}
            disabled={loading}
          >
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={formData[field.name] || ""}
              label={field.label}
              onChange={(e) => handleChange(field.name, e.target.value)}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {errors[field.name] && (
              <Typography variant="caption" color="error">
                {errors[field.name]}
              </Typography>
            )}
          </FormControl>
        );

      case "checkbox":
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={!!formData[field.name]}
                onChange={(e) => handleChange(field.name, e.target.checked)}
                disabled={loading}
              />
            }
            label={field.label}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        ...(absolute && {
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }),
        p: 3,
      }}
    >
      {title && (
        <Typography variant="h5" component="h2" gutterBottom>
          {title}
        </Typography>
      )}

      {errorMessage && (
        <Typography gutterBottom color="error">
          {errorMessage}
        </Typography>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Grid container spacing={3} direction={"column"}>
          {fields.map((field) => (
            <Grid item xs={12} key={field.name}>
              {renderField(field)}
            </Grid>
          ))}

          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? "Загрузка..." : submitText}
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={onCancel}
                disabled={loading}
              >
                {cancelText}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default FormComponent;
