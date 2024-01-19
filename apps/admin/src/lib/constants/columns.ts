import { ColumnsType } from "antd/es/table";
import { TenantDataType, ProviderDataType, ExpenseDataType } from "../interface";

export const tenantColumns: ColumnsType<TenantDataType> = [
  {
    title: "Tenant Code",
    dataIndex: "tenantCode",
    key: "tenantCode",
    align: "center",
  },
  {
    title: "Tenant Name",
    dataIndex: "tenantName",
    key: "tenantName",
    fixed: "left",
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
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Contact Address",
    dataIndex: "contactAddress",
    key: "contactAddress",
  },
  {
    title: "Roomate Count",
    dataIndex: "roomateCount",
    key: "roomateCount",
  },
];

export const providerColumns: ColumnsType<ProviderDataType> = [
  {
    title: "Provider Code",
    dataIndex: "providerCode",
    key: "providerCode",
    align: "center",
  },
  {
    title: "Provider Name",
    dataIndex: "providerName",
    key: "providerName",
  },
  {
    title: "DOB",
    dataIndex: "dateOfBirth",
    key: "dateOfBirth",
    align: "center",
  },
  {
    title: "Phone Number",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
    align: "center",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    align: "left",
  },
  {
    title: "Address",
    dataIndex: "contactAddress",
    key: "contactAddress",
    align: "left",
  },
];

export const expenseColumns: ColumnsType<ExpenseDataType> = [
  {
    title: "Expense Code",
    dataIndex: "expenseCode",
    key: "expenseCode",
    align: "center",
    width: "150px",
  },
  {
    title: "Expense Name",
    dataIndex: "expenseName",
    key: "expenseName",
    align: "center",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    align: "center",
  },
  {
    title: "Price",
    dataIndex: "price",
    key: "price",
    align: "center",
  },
  {
    title: "Is Used",
    dataIndex: "inUsed",
    key: "inUsed",
    align: "center",
  },
];
