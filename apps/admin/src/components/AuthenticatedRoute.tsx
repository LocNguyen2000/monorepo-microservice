import { FunctionComponent, useContext } from "react";
import { GlobalContext, getGlobalContext } from "../lib/context";
import { Navigate } from "react-router-dom";

interface IAuthenticatedRoute {
  children: JSX.Element;
}

export const AuthenticatedRoute: FunctionComponent<IAuthenticatedRoute> = ({
  children,
}) => {
  const {authUser} = getGlobalContext();

  if (!authUser) {
    return <Navigate to="/login" />;
  }

  return children;
};
