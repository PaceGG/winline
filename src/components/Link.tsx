import { Link as MuiLink } from "@mui/material";
import { useLocation } from "react-router-dom";

export interface LinkProps {
  href?: string;
  label: string;
}

export default function Link({ href = "/", label }: LinkProps) {
  const locate = useLocation();

  return (
    <MuiLink
      href={href}
      sx={{
        color: locate.pathname === `/${href}` ? "" : "#222",
        fontWeight: 700,
        textTransform: "uppercase",
        textDecoration: "none",
        ":hover": {
          color: "primary.main",
        },
        transition: "0.1s",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </MuiLink>
  );
}
