import { FunctionComponent, ReactElement, PropsWithChildren } from "react";
import { AccountRoleEnum } from "../../lib/constant"
import { getGlobalContext } from "../../lib/context";

interface IProtectedRoles {
  children: ReactElement;
  roles: AccountRoleEnum[];
}

export const ProtectedRoles: FunctionComponent<IProtectedRoles> = ({
  children,
  roles,
}) => {
  const authUser = JSON.parse(localStorage.getItem('authUser') || '{}')
  const roleId = authUser?.role || AccountRoleEnum.User
  
  console.log(`${roles}.includes(${roleId})`, roles.includes(roleId));
  

  return roles.includes(roleId) ? children : null;
};