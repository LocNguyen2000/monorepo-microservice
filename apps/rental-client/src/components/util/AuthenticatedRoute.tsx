import { FunctionComponent } from "react";
import { getGlobalContext } from "../../lib/context";
import { Navigate } from "react-router-dom";
import { ScreenRoutes } from "../../lib/constant";
import { useSyncAuthUser } from "../../lib/hooks";

interface IAuthenticatedRoute {
  children: JSX.Element;
}

export const AuthenticatedRoute: FunctionComponent<IAuthenticatedRoute> = ({
  children,
}) => {
  const {authUser} = getGlobalContext()

  if (!authUser) {
    return <Navigate to={ScreenRoutes.Login} />;
  }

  return children;
};
