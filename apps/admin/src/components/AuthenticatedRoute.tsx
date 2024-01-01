import { FunctionComponent, useContext } from "react";
import { GlobalContext, getGlobalContext } from "../lib/context";
import { Navigate } from "react-router-dom";

interface IAuthenticatedRoute {
  children: JSX.Element;
}

export const AuthenticatedRoute: FunctionComponent<IAuthenticatedRoute> = ({
  children,
}) => {
  const globalContext = getGlobalContext();

  if (!globalContext.authUser) {
    return <Navigate to="/login" />;
  }

  return children;
};
