import React from "react";
import {
  AuthorizationContext,
  useAuthorization,
} from "../hooks/useAuthorization";
import { CircularProgress } from "@mui/material";

interface WithRoleProps {
  children: React.ReactNode;
  allowedRoles: string | string[];
  fallback?: React.ReactNode;
}

export const WithRole: React.FC<WithRoleProps> = React.memo(
  ({ children, allowedRoles, fallback = null }) => {
    const { hasRole } = useAuthorization();
    return hasRole(allowedRoles) ? <>{children}</> : <>{fallback}</>;
  }
);

WithRole.displayName = "WithRole";

interface AuthorizationProviderProps {
  children: React.ReactNode;
  getUserRoles: () => string[] | Promise<string[]>;
}

export const AuthorizationProvider: React.FC<AuthorizationProviderProps> = ({
  children,
  getUserRoles,
}) => {
  const [userRoles, setUserRoles] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRoles = async () => {
      try {
        const roles = await getUserRoles();
        setUserRoles(Array.isArray(roles) ? roles : [roles]);
      } catch (error) {
        console.error("Failed to fetch user roles:", error);
        setUserRoles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRoles();
  }, [getUserRoles]);

  const hasRole = React.useCallback(
    (roles: string | string[]): boolean => {
      if (loading) return false;

      const rolesToCheck = Array.isArray(roles) ? roles : [roles];
      return rolesToCheck.some((role) => userRoles.includes(role));
    },
    [userRoles, loading]
  );

  const contextValue = React.useMemo(() => ({ hasRole }), [hasRole]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <AuthorizationContext.Provider value={contextValue}>
      {children}
    </AuthorizationContext.Provider>
  );
};
