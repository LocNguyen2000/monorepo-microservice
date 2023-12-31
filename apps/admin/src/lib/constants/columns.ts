import { ColumnsType } from "antd/es/table";
import { TenantDataType, ProviderDataType } from "../interface";

export const tenantColumns: ColumnsType<TenantDataType> = [
  {
    title: "Tenant Code",
    dataIndex: "tenantCode",
    key: "tenantCode",
  },
  {
    title: "Name",
    dataIndex: "tenantName",
    key: "tenantName",
  },
  {
    title: "DOB",
    dataIndex: "dateOfBirth",
    key: "dateOfBirth",
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
];

export const providerColumns: ColumnsType<ProviderDataType> = [
  {
    title: "Provider Code",
    dataIndex: "providerCode",
    key: "providerCode",
  },
  {
    title: "Provider Name",
    dataIndex: "providerName",
    key: "providerName",
  },
  {
    title: "Job Title",
    dataIndex: "role",
    key: "role",
  },
  {
    title: "DOB",
    dataIndex: "dateOfBirth",
    key: "dateOfBirth",
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
];
