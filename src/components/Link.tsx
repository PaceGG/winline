import { Link as MuiLink } from "@mui/material";

export interface LinkProps {
  href?: string;
  label: string;
}

export default function Link({ href = "/", label }: LinkProps) {
  return (
    <MuiLink
      href={href}
      sx={{
        color: "#222",
        fontWeight: 700,
        textTransform: "uppercase",
        textDecoration: "none",
        ":hover": {
          color: "primary.main",
        },
        transition: "0.1s",
      }}
    >
      {label}
    </MuiLink>
  );
}
