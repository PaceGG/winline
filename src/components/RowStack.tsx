import Stack, { type StackProps } from "@mui/material/Stack";

export default function RowStack(props: Omit<StackProps, "direction">) {
  const { children, alignItems = "center", gap = 2, ...other } = props;

  return (
    <Stack direction="row" alignItems={alignItems} gap={gap} {...other}>
      {children}
    </Stack>
  );
}
