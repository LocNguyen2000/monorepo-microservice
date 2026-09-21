import { FunctionComponent, useContext } from "react";
import { GlobalContext, getGlobalContext } from "../lib/context";
import { Navigate } from "react-router-dom";
import { ADMIN_ROLES } from "../lib/constants/roles";

interface IAuthenticatedRoute {
  children: JSX.Element;
}

export const AuthenticatedRoute: FunctionComponent<IAuthenticatedRoute> = ({
  children,
}) => {
  const { authUser } = getGlobalContext();

  if (!authUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

export const AdminOnlyRoute: FunctionComponent<IAuthenticatedRoute> = ({
  children,
}) => {
  const { authUser } = getGlobalContext();

  if (!authUser || !ADMIN_ROLES.includes(Number(authUser.role))) {
    return <Navigate to="/overview" replace />;
  }

  return children;
};
