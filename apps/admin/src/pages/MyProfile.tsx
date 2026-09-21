import { useEffect, useState } from "react";
import Card from "antd/es/card/Card";
import { getGlobalContext } from "../lib/context";
import {
  Badge,
  Button,
  Descriptions,
  DescriptionsProps,
  Select,
  Table,
  Tag,
} from "antd";
import { CheckOutlined, UserOutlined } from "@ant-design/icons";
import Typography from "antd/es/typography/Typography";
import { ADMIN_ROLES, UserRole } from "../lib/constants/roles";

interface Account {
  id: number;
  fullName: string;
  email: string;
  role: number;
  status: number;
}

const MyProfilePage = () => {
  const { authUser, serviceClient, useToast } = getGlobalContext();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [approvingId, setApprovingId] = useState<number>();
  const isAdmin = ADMIN_ROLES.includes(Number(authUser?.role));
  const isSuperAdmin = Number(authUser?.role) === UserRole.SuperAdministrator;

  const loadAccounts = async () => {
    setIsLoadingAccounts(true);
    try {
      const response = await serviceClient.get<Account[]>("auth/accounts");
      setAccounts(response.data);
    } catch (error: any) {
      useToast(
        "error",
        error?.response?.data?.message || "Unable to load accounts.",
      );
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadAccounts();
  }, [isAdmin]);

  const approveAccount = async (accountId: number) => {
    setApprovingId(accountId);
    try {
      await serviceClient.patch(`auth/${accountId}/approve`);
      setAccounts((accounts) =>
        accounts.map((account) =>
          account.id === accountId ? { ...account, status: 1 } : account,
        ),
      );
      useToast("success", "Account approved successfully.");
    } catch (error: any) {
      useToast(
        "error",
        error?.response?.data?.message || "Unable to approve this account.",
      );
    } finally {
      setApprovingId(undefined);
    }
  };

  const updateRole = async (accountId: number, role: UserRole) => {
    try {
      await serviceClient.patch(`auth/${accountId}/role`, { role });
      setAccounts((accounts) =>
        accounts.map((account) =>
          account.id === accountId ? { ...account, role } : account,
        ),
      );
      useToast("success", "Account role updated successfully.");
    } catch (error: any) {
      useToast(
        "error",
        error?.response?.data?.message || "Unable to update this account role.",
      );
    }
  };

  const roleLabels: Record<UserRole, string> = {
    [UserRole.SuperAdministrator]: "Super administrator",
    [UserRole.Administrator]: "Administrator",
    [UserRole.User]: "User",
  };

  const pendingColumns = [
    {
      title: "Full name",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: number) =>
        status === 1 ? (
          <Tag color="green">Approved</Tag>
        ) : (
          <Tag color="gold">Pending approval</Tag>
        ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: UserRole, account: Account) =>
        isSuperAdmin ? (
          <Select<UserRole>
            value={role}
            style={{ minWidth: 170 }}
            onChange={(nextRole) => updateRole(account.id, nextRole)}
            options={Object.values(UserRole)
              .filter((value): value is UserRole => typeof value === "number")
              .map((value) => ({ value, label: roleLabels[value] }))}
          />
        ) : (
          roleLabels[role] || "Unknown"
        ),
    },
    {
      title: "Action",
      key: "action",
      align: "center" as const,
      render: (_: unknown, account: Account) => (
        <Button
          type="primary"
          icon={<CheckOutlined />}
          loading={approvingId === account.id}
          onClick={() => approveAccount(account.id)}
          disabled={account.status === 1}
        >
          {account.status === 1 ? "Approved" : "Approve"}
        </Button>
      ),
    },
  ];

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Username",
      children: authUser.name,
      span: 1.5,
    },
    {
      key: "2",
      label: "User ID",
      children: authUser.userId,
      span: 1.5,
    },
    {
      key: "3",
      label: "Role",
      children: authUser.role,
      span: 1.5,
    },
    {
      key: "4",
      label: "Status",
      children: <Badge status="processing" text="Running" />,
      span: 1.5,
    },
    {
      key: "5",
      label: "Create on",
      children: new Date().toLocaleDateString(),
      span: 1.5,
    },
    {
      key: "6",
      label: "Create by",
      children: "admin",
      span: 1.5,
    },
  ];

  return (
    <>
      <Card style={{ width: "100%", minHeight: "15vh" }}>
        <Descriptions
          title={
            <div>
              <UserOutlined /> My Profile<Typography></Typography>
            </div>
          }
          bordered
          items={items}
        />
      </Card>
      {isAdmin && (
        <Card
          title="Account management"
          style={{ width: "100%", marginTop: "1rem" }}
        >
          <Table<Account>
            rowKey="id"
            columns={pendingColumns}
            dataSource={accounts}
            loading={isLoadingAccounts}
            locale={{ emptyText: "No registered accounts found." }}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      )}
    </>
  );
};

export default MyProfilePage;
