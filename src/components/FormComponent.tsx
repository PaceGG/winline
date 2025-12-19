// FormComponent.tsx
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
  Autocomplete,
  IconButton,
  Card,
  CardContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export interface FormField {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "password"
    | "number"
    | "select"
    | "checkbox"
    | "autocomplete"
    | "array"
    | "object";
  required?: boolean;
  options?: { value: string; label: string }[]; // для select и autocomplete
  defaultValue?: string | number | boolean | any[];
  validation?: {
    pattern?: RegExp;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  strictMatch?: boolean; // для autocomplete
  fields?: FormField[]; // для type: "array" или "object"
  arrayItemLabel?: string; // для type: "array"
}

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

type AnyObject = Record<string, any>;

/* ----------------- Вспомогательные функции для работы с путями ----------------- */

/**
 * Разбирает путь вида "user.items[0].name" на массив частей: ['user','items',0,'name']
 */
function parsePath(path: string): Array<string | number> {
  const parts: Array<string | number> = [];
  const regex = /([^[.\]]+)|\[(\d+)\]/g;
  let match;
  while ((match = regex.exec(path))) {
    if (match[1]) parts.push(match[1]);
    else if (match[2]) parts.push(Number(match[2]));
  }
  return parts;
}

/**
 * Небольшая утилита: получает значение из объекта по пути (поддерживает массивы).
 */
function getValue(obj: AnyObject, path: string) {
  if (!path) return undefined;
  const parts = parsePath(path);
  let cur: any = obj;
  for (const p of parts) {
    if (cur === undefined || cur === null) return undefined;
    cur = cur[p as any];
  }
  return cur;
}

/**
 * Иммутабельно устанавливает value по path в объекте state и возвращает новый объект.
 */
function setValueImmutable(
  obj: AnyObject,
  path: string,
  value: any
): AnyObject {
  const parts = parsePath(path);
  if (parts.length === 0) return obj;
  const newRoot = Array.isArray(obj) ? [...(obj as any)] : { ...(obj || {}) };

  let curNew: any = newRoot;
  let curOld: any = obj;

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    const isLast = i === parts.length - 1;

    if (typeof part === "number") {
      // array index
      curOld = curOld ? curOld[part] : undefined;
      if (!Array.isArray(curNew)) {
        // convert to array if needed
        // We are at previous level; ensure it is array
        // This case shouldn't often happen, but handle gracefully
        curNew = [];
      }
      if (isLast) {
        curNew[part] = value;
      } else {
        const nextOld = curOld || {};
        const nextNew = Array.isArray(nextOld)
          ? [...nextOld]
          : { ...(nextOld || {}) };
        // assign copy
        curNew[part] = nextNew;
        curNew = curNew[part];
        curOld = nextOld;
      }
    } else {
      // string key
      if (isLast) {
        curNew[part] = value;
      } else {
        const nextOld = curOld ? curOld[part] : undefined;
        const nextNew = Array.isArray(nextOld)
          ? [...nextOld]
          : { ...(nextOld || {}) };
        curNew[part] = nextNew;
        curNew = curNew[part];
        curOld = nextOld;
      }
    }
  }

  return newRoot;
}

/* ----------------- Инициализация данных формы из описания полей ----------------- */

function buildInitialData(fields: FormField[]): AnyObject {
  const result: AnyObject = {};
  const set = (path: string, value: any) => {
    const prev = result;
    const updated = setValueImmutable(prev, path, value);
    // copy updated back to result reference
    Object.assign(result, updated);
  };

  const initializeField = (field: FormField, basePath = "") => {
    const path = basePath ? `${basePath}.${field.name}` : field.name;
    if (field.type === "array") {
      const arr = Array.isArray(field.defaultValue) ? field.defaultValue : [];
      set(path, arr);
      // if there are template fields and default array provided, initialize items
      if (field.fields && arr.length > 0) {
        arr.forEach((item: any, idx: number) => {
          for (const sf of field.fields!) {
            // if item has value for subfield - keep, else init by defaultValue
            const subPath = `${path}[${idx}].${sf.name}`;
            const v =
              item && item[sf.name] !== undefined
                ? item[sf.name]
                : sf.defaultValue ??
                  (sf.type === "array" ? [] : sf.type === "object" ? {} : "");
            set(subPath, v);
            if (sf.type === "object" && sf.fields) {
              initializeField(sf, `${path}[${idx}]`);
            }
          }
        });
      }
    } else if (field.type === "object") {
      set(path, {});
      if (field.fields) {
        for (const sf of field.fields) {
          initializeField(sf, path);
        }
      }
    } else if (field.type === "checkbox") {
      set(path, field.defaultValue ?? false);
    } else {
      set(path, field.defaultValue ?? "");
    }
  };

  for (const f of fields) initializeField(f);
  return result;
}

/* ----------------- Валидация ----------------- */

function validateFieldValue(field: FormField, value: any): string {
  // required
  if (field.required) {
    if (field.type === "checkbox") {
      if (value !== true) return "Это поле обязательно для заполнения";
    } else if (field.type === "array") {
      if (!value || !Array.isArray(value) || value.length === 0)
        return "Необходимо добавить хотя бы один элемент";
    } else if (field.type === "autocomplete") {
      if (value === "" || value === null || value === undefined)
        return "Это поле обязательно для заполнения";
      if (field.strictMatch && field.options) {
        const found = field.options.find(
          (opt) => opt.value === value || opt.label === value
        );
        if (!found) return "Выберите значение из списка";
      }
    } else {
      if (
        (value === "" || value === null || value === undefined) &&
        value !== 0
      )
        return "Это поле обязательно для заполнения";
    }
  }

  if (field.validation) {
    const { pattern, minLength, maxLength, min, max } = field.validation;
    if (pattern && typeof value === "string" && !pattern.test(value))
      return "Неверный формат";
    if (minLength && typeof value === "string" && value.length < minLength)
      return `Минимальная длина: ${minLength} символов`;
    if (maxLength && typeof value === "string" && value.length > maxLength)
      return `Максимальная длина: ${maxLength} символов`;
    if (
      (min !== undefined || max !== undefined) &&
      value !== "" &&
      value !== null &&
      value !== undefined
    ) {
      const numValue = parseFloat(value as any);
      if (isNaN(numValue)) return "Введите число";
      if (min !== undefined && numValue < min)
        return `Минимальное значение: ${min}`;
      if (max !== undefined && numValue > max)
        return `Максимальное значение: ${max}`;
    }
  }

  // autocomplete strict match, even if not required (check when value present)
  if (
    field.type === "autocomplete" &&
    field.strictMatch &&
    field.options &&
    value !== "" &&
    value !== null &&
    value !== undefined
  ) {
    const found = field.options.find(
      (opt) => opt.value === value || opt.label === value
    );
    if (!found) return "Выберите значение из списка";
  }

  return "";
}

/* ----------------- FieldRenderer (мемоизированный, рендерит один field) ----------------- */

interface FieldRendererProps {
  field: FormField;
  path: string;
  value: any;
  error?: string;
  onChange: (path: string, value: any) => void;
  addArrayItem: (path: string, template?: AnyObject) => void;
  removeArrayItem: (path: string, index: number) => void;
  loading?: boolean;
}

const FieldRenderer: React.FC<FieldRendererProps> = React.memo(
  function FieldRenderer({
    field,
    path,
    value,
    error,
    onChange,
    addArrayItem,
    removeArrayItem,
    loading,
  }) {
    const fullPath = path ? `${path}.${field.name}` : field.name;
    const commonProps = {
      label: field.label,
      required: !!field.required,
      error: !!error,
      helperText: error || undefined,
      disabled: !!loading,
      fullWidth: true,
    };

    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "number": {
        return (
          <TextField
            id={fullPath}
            {...commonProps}
            type={field.type}
            value={value ?? ""}
            onChange={(e) => onChange(fullPath, e.target.value)}
          />
        );
      }

      case "select": {
        return (
          <FormControl fullWidth error={!!error} disabled={loading}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value ?? ""}
              label={field.label}
              onChange={(e) => onChange(fullPath, e.target.value)}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && (
              <Typography variant="caption" color="error">
                {error}
              </Typography>
            )}
          </FormControl>
        );
      }

      case "checkbox": {
        return (
          <FormControlLabel
            control={
              <Checkbox
                checked={!!value}
                onChange={(e) => onChange(fullPath, e.target.checked)}
                disabled={loading}
              />
            }
            label={field.label}
          />
        );
      }

      case "autocomplete": {
        // represent options as objects; store value as option.value or string
        const options = field.options || [];
        const selectedOption =
          options.find((opt) => opt.value === value || opt.label === value) ??
          null;

        return (
          <Autocomplete
            id={fullPath}
            options={options}
            getOptionLabel={(opt) =>
              typeof opt === "string" ? opt : opt.label
            }
            isOptionEqualToValue={(opt, val) => {
              if (!opt || !val) return false;
              // val can be an object or primitive
              return (
                opt.value === (val as any).value ||
                opt.value === val ||
                opt.label === val
              );
            }}
            value={selectedOption}
            onChange={(_, newVal) => {
              if (newVal == null) onChange(fullPath, "");
              else
                onChange(
                  fullPath,
                  (newVal as any).value ?? (newVal as any).label ?? newVal
                );
            }}
            onInputChange={(_, newInput) => {
              if (!field.strictMatch) {
                onChange(fullPath, newInput);
              }
            }}
            freeSolo={!field.strictMatch}
            renderInput={(params) => (
              <TextField
                {...params}
                {...commonProps}
                error={!!error}
                helperText={error || undefined}
              />
            )}
            disabled={loading}
            fullWidth
          />
        );
      }

      case "array": {
        const arrayVal: any[] = Array.isArray(value) ? value : [];
        return (
          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {field.label}
              </Typography>

              {arrayVal.map((item: any, index: number) => (
                <Box
                  key={index}
                  sx={{
                    mb: 2,
                    p: 2,
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle1">
                      {field.arrayItemLabel ?? "Элемент"} #{index + 1}
                    </Typography>
                    <IconButton
                      onClick={() => removeArrayItem(fullPath, index)}
                      disabled={loading}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Grid container spacing={2}>
                    {field.fields?.map((sub) => (
                      <Grid item xs={12} key={sub.name}>
                        {/* при рендере вложенных полей используем путь `${fullPath}[index]` как base */}
                        <FieldRenderer
                          field={sub}
                          path={`${fullPath}[${index}]`}
                          value={getValue(item, sub.name)}
                          error={undefined} // ошибки будут показываться при сабмите; можно передать конкретные ошибки если нужно
                          onChange={(p, v) => {
                            // p будет как `${fullPath}[index].subname` или `...` поэтому мы можем вычислить relative path inside item
                            // Но проще: вычисляем absolute path and call onChange
                            onChange(p, v);
                          }}
                          addArrayItem={addArrayItem}
                          removeArrayItem={removeArrayItem}
                          loading={loading}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}

              <Button
                startIcon={<AddIcon />}
                onClick={() => {
                  // шаблон элемента: заполнить поля по defaultValue
                  const template: AnyObject = {};
                  if (field.fields) {
                    for (const sf of field.fields) {
                      if (sf.type === "array")
                        template[sf.name] = Array.isArray(sf.defaultValue)
                          ? sf.defaultValue
                          : [];
                      else if (sf.type === "object") template[sf.name] = {};
                      else if (sf.type === "checkbox")
                        template[sf.name] = sf.defaultValue ?? false;
                      else template[sf.name] = sf.defaultValue ?? "";
                    }
                  }
                  addArrayItem(fullPath, template);
                }}
                disabled={loading}
                variant="outlined"
                size="small"
              >
                Добавить {field.arrayItemLabel ?? "элемент"}
              </Button>
            </CardContent>
          </Card>
        );
      }

      case "object": {
        const objVal = value || {};
        return (
          <Card variant="outlined" sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {field.label}
              </Typography>

              <Grid container spacing={2}>
                {field.fields?.map((sub) => (
                  <Grid item xs={12} key={sub.name}>
                    <FieldRenderer
                      field={sub}
                      path={fullPath}
                      value={getValue(objVal, sub.name)}
                      error={undefined}
                      onChange={onChange}
                      addArrayItem={addArrayItem}
                      removeArrayItem={removeArrayItem}
                      loading={loading}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        );
      }

      default:
        return null;
    }
  },
  // кастомная проверка пропсов: перерисовывать только когда value или error или loading поменялись
  (prev, next) => {
    return (
      prev.value === next.value &&
      prev.error === next.error &&
      prev.loading === next.loading
    );
  }
);

/* ----------------- Главный компонент ----------------- */

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
  const [formData, setFormData] = React.useState<AnyObject>(() =>
    buildInitialData(fields)
  );
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // обновление initial при смене полей
  React.useEffect(() => {
    setFormData((prev) => {
      const initial = buildInitialData(fields);
      // merge existing values onto initial to preserve user input if shape same
      return { ...initial, ...prev };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields]);

  const setPathValue = React.useCallback((path: string, value: any) => {
    setFormData((prev) => setValueImmutable(prev, path, value));
    // очищаем ошибку при изменении
    setErrors((prev) => {
      if (!prev[path]) return prev;
      const next = { ...prev };
      delete next[path];
      return next;
    });
  }, []);

  const addArrayItem = React.useCallback(
    (path: string, template?: AnyObject) => {
      const arr = getValue(formData, path) || [];
      const newItem = template ?? {};
      const newArr = [...arr, newItem];
      setFormData((prev) => setValueImmutable(prev, path, newArr));
    },
    [formData]
  );

  const removeArrayItem = React.useCallback((path: string, index: number) => {
    const arr = getValue(formData, path) || [];
    const newArr = arr.slice(0, index).concat(arr.slice(index + 1));
    setFormData((prev) => setValueImmutable(prev, path, newArr));
  }, []);

  const collectValidationErrors = React.useCallback((): Record<
    string,
    string
  > => {
    const newErrors: Record<string, string> = {};

    const walk = (fl: FormField[], base = "") => {
      for (const f of fl) {
        const p = base ? `${base}.${f.name}` : f.name;
        const val = getValue(formData, p);
        const err = validateFieldValue(f, val);
        if (err) newErrors[p] = err;

        if (f.type === "object" && f.fields) {
          walk(f.fields, p);
        } else if (f.type === "array" && f.fields) {
          const arr = Array.isArray(val) ? val : [];
          if (arr.length === 0 && f.required) {
            // already handled by validateFieldValue
          } else {
            arr.forEach((item: any, idx: number) => {
              // for each subfield validate using path `${p}[idx].subname`
              for (const sf of f.fields!) {
                const subPath = `${p}[${idx}].${sf.name}`;
                const subVal = getValue(formData, subPath);
                const subErr = validateFieldValue(sf, subVal);
                if (subErr) newErrors[subPath] = subErr;
                if (
                  (sf.type === "object" || sf.type === "array") &&
                  sf.fields
                ) {
                  // deeper validation: we can recursively walk using derived base
                  if (sf.type === "object") {
                    // call walk with base `${p}[${idx}].${sf.name}` and fields sf.fields
                    const nestedBase = `${p}[${idx}].${sf.name}`;
                    const recursiveWalk = (fs: FormField[], b: string) => {
                      for (const fff of fs) {
                        const pp = `${b}.${fff.name}`;
                        const vv = getValue(formData, pp);
                        const ee = validateFieldValue(fff, vv);
                        if (ee) newErrors[pp] = ee;
                        if (
                          (fff.type === "object" || fff.type === "array") &&
                          fff.fields
                        ) {
                          recursiveWalk(fff.fields, pp);
                        }
                      }
                    };
                    recursiveWalk(sf.fields, nestedBase);
                  } else {
                    // array inside array item
                    // We'll validate array items when they exist (above)
                  }
                }
              }
            });
          }
        }
      }
    };

    walk(fields);
    return newErrors;
  }, [fields, formData]);

  const handleSubmit = React.useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors = collectValidationErrors();
      setErrors(newErrors);
      if (Object.keys(newErrors).length === 0) {
        onSubmit(formData);
      } else {
        // focus first error field? (optional)
        const firstKey = Object.keys(newErrors)[0];
        // можно попытаться сфокусировать поле по id = firstKey
        const el = document.getElementById(firstKey);
        if (el && typeof (el as any).focus === "function") {
          (el as any).focus();
        }
      }
    },
    [collectValidationErrors, formData, onSubmit]
  );

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
        maxHeight: "80vh",
        overflow: "auto",
        p: 3,
        maxWidth: 900,
        width: "100%",
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
          {fields.map((f) => (
            <Grid item xs={12} key={f.name}>
              <FieldRenderer
                field={f}
                path={""}
                value={getValue(formData, f.name)}
                error={errors[f.name]}
                onChange={(p, v) => setPathValue(p, v)}
                addArrayItem={(p, template) => addArrayItem(p, template)}
                removeArrayItem={(p, idx) => removeArrayItem(p, idx)}
                loading={loading}
              />
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
