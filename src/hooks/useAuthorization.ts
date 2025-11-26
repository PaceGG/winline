import React from "react";

interface AuthorizationContextType {
  hasRole: (roles: string | string[]) => boolean;
}

export const AuthorizationContext = React.createContext<
  AuthorizationContextType | undefined
>(undefined);

export const useAuthorization = (): AuthorizationContextType => {
  const context = React.useContext(AuthorizationContext);
  if (context === undefined) {
    throw new Error(
      "useAuthorization must be used within an AuthorizationProvider"
    );
  }
  return context;
};
