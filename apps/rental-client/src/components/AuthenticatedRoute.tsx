import { FunctionComponent, useContext } from "react";
import { GlobalContext, getGlobalContext } from "../lib/context";
import { Navigate } from "react-router-dom";
import { ScreenRoutes } from "../lib/constant";

interface IAuthenticatedRoute {
  children: JSX.Element;
}

export const AuthenticatedRoute: FunctionComponent<IAuthenticatedRoute> = ({
  children,
}) => {
  const globalContext = getGlobalContext();

  if (!globalContext.authUser) {
    return <Navigate to={ScreenRoutes.Login} />;
  }

  return children;
};
