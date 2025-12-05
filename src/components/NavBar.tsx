import { Box } from "@mui/material";
import type { LinkProps } from "./Link";
import Link from "./Link";

interface NavBarProps {
  links: LinkProps[];
}

export default function NavBar({ links }: NavBarProps) {
  return (
    <Box display="flex" gap={3}>
      {links.map((link, i) => (
        <Link href={link.href} label={link.label} key={i} />
      ))}
    </Box>
  );
}
