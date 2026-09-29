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
import {
  CheckOutlined,
  StopOutlined,
  PlayCircleOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Typography from "antd/es/typography/Typography";
import { ADMIN_ROLES, AccountStatus, UserRole } from "../lib/constants/roles";

interface Account {
  id: number;
  fullName: string;
  email: string;
  role: number;
  status: AccountStatus;
}

const MyProfilePage = () => {
  const { authUser, serviceClient, useToast } = getGlobalContext();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [approvingId, setApprovingId] = useState<number>();
  const [updatingStatusId, setUpdatingStatusId] = useState<number>();
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
        error?.response?.data?.message || "Không thể tải danh sách tài khoản.",
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
          account.id === accountId
            ? { ...account, status: AccountStatus.Active }
            : account,
        ),
      );
      useToast("success", "Duyệt tài khoản thành công.");
    } catch (error: any) {
      useToast(
        "error",
        error?.response?.data?.message || "Không thể duyệt tài khoản này.",
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
      useToast("success", "Cập nhật vai trò tài khoản thành công.");
    } catch (error: any) {
      useToast(
        "error",
        error?.response?.data?.message || "Không thể cập nhật vai trò tài khoản.",
      );
    }
  };

  const updateStatus = async (accountId: number, status: AccountStatus) => {
    setUpdatingStatusId(accountId);
    try {
      await serviceClient.patch(`auth/${accountId}/status`, { status });
      setAccounts((accounts) =>
        accounts.map((account) =>
          account.id === accountId ? { ...account, status } : account,
        ),
      );
      useToast(
        "success",
        status === AccountStatus.Active
          ? "Kích hoạt tài khoản thành công."
          : "Vô hiệu hóa tài khoản thành công.",
      );
    } catch (error: any) {
      useToast(
        "error",
        error?.response?.data?.message || "Không thể cập nhật trạng thái tài khoản.",
      );
    } finally {
      setUpdatingStatusId(undefined);
    }
  };

  const roleLabels: Record<UserRole, string> = {
    [UserRole.SuperAdministrator]: "Siêu quản trị viên",
    [UserRole.Administrator]: "Quản trị viên",
    [UserRole.User]: "Người dùng",
    [UserRole.LocationOperator]: "Nhân viên vận hành",
  };

  const pendingColumns = [
    {
      title: "Họ và tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: AccountStatus) =>
        status === AccountStatus.Active ? (
          <Tag color="green">Đã duyệt</Tag>
        ) : (
          <Tag color="gold">Chờ duyệt</Tag>
        ),
    },
    {
      title: "Vai trò",
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
          roleLabels[role] || "Không xác định"
        ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center" as const,
      render: (_: unknown, account: Account) => (
        <>
          <Button
            type="primary"
            icon={<CheckOutlined />}
            loading={approvingId === account.id}
            onClick={() => approveAccount(account.id)}
            disabled={account.status === AccountStatus.Active}
          >
            Duyệt
          </Button>
          {isSuperAdmin &&
            account.id !== authUser?.userId &&
            account.role !== UserRole.SuperAdministrator && (
              <Button
                danger={account.status === AccountStatus.Active}
                type={
                  account.status === AccountStatus.Active
                    ? "default"
                    : "primary"
                }
                icon={
                  account.status === AccountStatus.Active ? (
                    <StopOutlined />
                  ) : (
                    <PlayCircleOutlined />
                  )
                }
                loading={updatingStatusId === account.id}
                onClick={() =>
                  updateStatus(
                    account.id,
                    account.status === AccountStatus.Active
                      ? AccountStatus.Inactive
                      : AccountStatus.Active,
                  )
                }
                style={{ marginLeft: 8 }}
              >
                {account.status === AccountStatus.Active
                  ? "Vô hiệu hóa"
                  : "Kích hoạt"}
              </Button>
            )}
        </>
      ),
    },
  ];

  const items: DescriptionsProps["items"] = [
    {
      key: "1",
      label: "Tên người dùng",
      children: authUser.name,
      span: 1.5,
    },
    {
      key: "2",
      label: "Mã người dùng",
      children: authUser.userId,
      span: 1.5,
    },
    {
      key: "3",
      label: "Vai trò",
      children:
        roleLabels[Number(authUser.role) as UserRole] || "Không xác định",
      span: 1.5,
    },
    {
      key: "4",
      label: "Trạng thái",
      children: <Badge status="processing" text="Đang hoạt động" />,
      span: 1.5,
    },
    {
      key: "5",
      label: "Ngày tạo",
      children: new Date().toLocaleDateString("vi-VN"),
      span: 1.5,
    },
    {
      key: "6",
      label: "Người tạo",
      children: "Quản trị viên",
      span: 1.5,
    },
  ];

  return (
    <>
      <Card style={{ width: "100%", minHeight: "15vh" }}>
        <Descriptions
          title={
            <div>
              <UserOutlined /> Hồ sơ của tôi<Typography></Typography>
            </div>
          }
          bordered
          items={items}
        />
      </Card>
      {isAdmin && (
        <Card
          title="Quản lý tài khoản"
          style={{ width: "100%", marginTop: "1rem" }}
        >
          <div className="list-page-table-scroll">
            <Table<Account>
              rowKey="id"
              columns={pendingColumns}
              dataSource={accounts}
              loading={isLoadingAccounts}
              locale={{ emptyText: "Chưa có tài khoản nào được đăng ký." }}
              pagination={{ pageSize: 10 }}
              scroll={{ x: "max-content" }}
            />
          </div>
        </Card>
      )}
    </>
  );
};

export default MyProfilePage;
