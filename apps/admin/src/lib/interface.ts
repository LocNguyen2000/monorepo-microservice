import { ReactNode } from "react";
import { DASHBOARD_ROUTES } from "./constants/routes";

export interface ProviderDataType {
  providerCode?: number;
  providerName?: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  phoneNumber?: string;
  email?: string;
  contactAdress?: string;
  gender?: number;
  genderName?: string;
  role?: string;
  roomSize?: number;
  description?: string;
}

export interface TenantDataType {
  tenantCode?: number;
  firstName?: string;
  lastName?: string;
  tenantName?: string;
  dateOfBirth?: Date;
  genderName?: string;
  gender?: number;
  phoneNumber?: string;
  email?: string;
  contactAddress?: string;
  rentProviderId?: string;
  roomateCount?: number;
  description?: string;
}

export interface IAntdMenuItem {
  text: string;
  key: string;
  icon: ReactNode;
  path?: DASHBOARD_ROUTES;
  parentKey?: string;
  hidden?: boolean;
}
