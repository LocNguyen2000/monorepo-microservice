import { ReactNode } from "react";
import { DASHBOARD_ROUTES } from "./constants/routes";

export interface ProviderDataType {
  key: React.Key;
  providerCode: number;
  firstName?: string;
  lastName?: string;
  providerName?: string;
  role?: string;
  dateOfBirth?: Date;
  genderName?: string;
  phoneNumber?: string;
  email?: string;
  contactAdress?: string;
}

export interface TenantDataType {
  key: React.Key;
  tenantCode: number;
  firstName?: string;
  lastName?: string;
  tenantName?: string;
  role?: string;
  dateOfBirth?: Date;
  genderName?: string;
  phoneNumber?: string;
  email?: string;
  contactAdress?: string;
}

export interface IAntdMenuItem {
  text: string;
  key: string;
  icon: ReactNode;
  path?: DASHBOARD_ROUTES;
  parentKey?: string;
  hidden?: boolean;
}
