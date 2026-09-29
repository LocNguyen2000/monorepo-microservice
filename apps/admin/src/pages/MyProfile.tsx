import { useEffect, useState } from "react";
import Card from "antd/es/card/Card";
import { getGlobalContext } from "../lib/context";
import {
  Badge,
  Button,
  Descriptions,
  DescriptionsProps,
  InputNumber,
  Select,
  Space,
  Table,
  Tag,
  Popconfirm,
} from "antd";
import {
  CheckOutlined,
  StopOutlined,
  PlayCircleOutlined,
  UserOutlined,
  ShareAltOutlined,
  DeleteOutlined,
  PlusOutlined,
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

interface AccountShareGrant {
  ownerAccountId: number;
  sharedAccountId: number;
  alreadyShared: boolean;
}

interface AccountShareRevocation {
  ownerAccountId: number;
  sharedAccountId: number;
  revoked: boolean;
}

/** Normalize GET /account-shares payload (array or { accountIds }). */
function parseSharedAccountIds(data: unknown): number[] {
  if (Array.isArray(data)) {
    return data.map(Number).filter((n) => !Number.isNaN(n));
  }
  if (data && typeof data === "object" && "accountIds" in data) {
    const ids = (data as { accountIds: unknown }).accountIds;
    if (Array.isArray(ids)) {
      return ids.map(Number).filter((n) => !Number.isNaN(n));
    }
  }
  return [];
}

const MyProfilePage = () => {
  const { authUser, serviceClient, useToast } = getGlobalContext();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [approvingId, setApprovingId] = useState<number>();
  const [updatingStatusId, setUpdatingStatusId] = useState<number>();
  const isAdmin = ADMIN_ROLES.includes(Number(authUser?.role));
  const isSuperAdmin = Number(authUser?.role) === UserRole.SuperAdministrator;

  // --- Account sharing state ---
  const [sharedAccountIds, setSharedAccountIds] = useState<number[]>([]);
  const [isLoadingShares, setIsLoadingShares] = useState(false);
  const [shareTargetId, setShareTargetId] = useState<number | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [revokingId, setRevokingId] = useState<number>();

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

  const loadSharedAccounts = async () => {
    setIsLoadingShares(true);
    try {
      // API: GET /account-shares
      const response = await serviceClient.get("account-shares");
      setSharedAccountIds(parseSharedAccountIds(response.data));
    } catch (error: any) {
      useToast(
        "error",
        error?.response?.data?.message ||
          "Không thể tải danh sách chia sẻ tài khoản.",
      );
    } finally {
      setIsLoadingShares(false);
    }
  };

  useEffect(() => {
    if (isAdmin) loadAccounts();
  }, [isAdmin]);

  useEffect(() => {
    if (authUser?.userId) loadSharedAccounts();
  }, [authUser?.userId]);

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
        error?.response?.data?.message ||
          "Không thể cập nhật vai trò tài khoản.",
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
        error?.response?.data?.message ||
          "Không thể cập nhật trạng thái tài khoản.",
      );
    } finally {
      setUpdatingStatusId(undefined);
    }
  };

  // API: POST /account-shares
  const shareAccount = async () => {
    if (shareTargetId == null || Number.isNaN(shareTargetId)) {
      useToast("error", "Vui lòng chọn hoặc nhập mã tài khoản cần chia sẻ.");
      return;
    }
    if (shareTargetId === authUser?.userId) {
      useToast("error", "Không thể chia sẻ với chính tài khoản của bạn.");
      return;
    }
    if (sharedAccountIds.includes(shareTargetId)) {
      useToast("info", "Tài khoản này đã được chia sẻ quyền đọc.");
      return;
    }

    setIsSharing(true);
    try {
      const response = await serviceClient.post<AccountShareGrant>(
        "account-shares",
        { sharedAccountId: shareTargetId }, // adjust field name if OpenAPI uses another key
      );
      const grant = response.data;
      if (grant.alreadyShared) {
        useToast("info", "Tài khoản này đã được chia sẻ trước đó.");
      } else {
        useToast("success", "Đã cấp quyền đọc cho tài khoản.");
      }
      setSharedAccountIds((prev) =>
        prev.includes(grant.sharedAccountId)
          ? prev
          : [...prev, grant.sharedAccountId],
      );
      setShareTargetId(null);
    } catch (error: any) {
      const status = error?.response?.status;
      const message =
        error?.response?.data?.message ||
        (status === 404
          ? "Không tìm thấy tài khoản đích."
          : status === 409
            ? "Chia sẻ đã tồn tại hoặc xung đột."
            : "Không thể chia sẻ tài khoản.");
      useToast("error", message);
    } finally {
      setIsSharing(false);
    }
  };

  // API: DELETE /account-shares/{sharedAccountId}
  const revokeShare = async (sharedAccountId: number) => {
    setRevokingId(sharedAccountId);
    try {
      const response = await serviceClient.delete<AccountShareRevocation>(
        `account-shares/${sharedAccountId}`,
      );
      if (response.data?.revoked !== false) {
        setSharedAccountIds((prev) =>
          prev.filter((id) => id !== sharedAccountId),
        );
        useToast("success", "Đã thu hồi quyền đọc.");
      } else {
        useToast("info", "Chia sẻ không tồn tại hoặc đã được thu hồi.");
      }
    } catch (error: any) {
      useToast(
        "error",
        error?.response?.data?.message || "Không thể thu hồi chia sẻ.",
      );
    } finally {
      setRevokingId(undefined);
    }
  };

  const roleLabels: Record<UserRole, string> = {
    [UserRole.SuperAdministrator]: "Siêu quản trị viên",
    [UserRole.Administrator]: "Quản trị viên",
    [UserRole.User]: "Người dùng",
    [UserRole.LocationOperator]: "Nhân viên vận hành",
  };

  const accountById = (id: number) =>
    accounts.find((a) => a.id === id);

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

  const shareColumns = [
    {
      title: "Mã tài khoản",
      dataIndex: "id",
      key: "id",
      width: 120,
    },
    {
      title: "Họ và tên",
      key: "fullName",
      render: (_: unknown, row: { id: number }) =>
        accountById(row.id)?.fullName ?? "—",
    },
    {
      title: "Email",
      key: "email",
      render: (_: unknown, row: { id: number }) =>
        accountById(row.id)?.email ?? "—",
    },
    {
      title: "Quyền",
      key: "permission",
      render: () => <Tag color="blue">Chỉ đọc</Tag>,
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center" as const,
      render: (_: unknown, row: { id: number }) => (
        <Popconfirm
          title="Thu hồi quyền đọc?"
          description="Tài khoản này sẽ không còn xem được dữ liệu của bạn."
          onConfirm={() => revokeShare(row.id)}
          okText="Thu hồi"
          cancelText="Hủy"
        >
          <Button
            danger
            icon={<DeleteOutlined />}
            loading={revokingId === row.id}
          >
            Thu hồi
          </Button>
        </Popconfirm>
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

  const shareableAccounts = accounts.filter(
    (a) =>
      a.id !== authUser?.userId &&
      a.status === AccountStatus.Active &&
      !sharedAccountIds.includes(a.id),
  );

  return (
    <>
      <Card style={{ width: "100%", minHeight: "15vh" }}>
        <Descriptions
          title={
            <div>
              <UserOutlined /> Hồ sơ của tôi
              <Typography></Typography>
            </div>
          }
          bordered
          items={items}
        />
      </Card>

      {/* Account-level read sharing */}
      <Card
        title={
          <span>
            <ShareAltOutlined /> Chia sẻ dữ liệu tài khoản (chỉ đọc)
          </span>
        }
        style={{ width: "100%", marginTop: "1rem" }}
      >
        <Typography style={{ marginBottom: 16 }}>
          Cấp quyền đọc toàn bộ dữ liệu thuộc tài khoản của bạn cho tài khoản
          khác. Quyền sở hữu vẫn thuộc về bạn; tài khoản được chia sẻ chỉ xem,
          không tạo / sửa / xóa.
        </Typography>

        <Space wrap style={{ marginBottom: 16 }} align="start">
          {isAdmin && shareableAccounts.length > 0 ? (
            <Select
              showSearch
              placeholder="Chọn tài khoản để chia sẻ"
              style={{ minWidth: 280 }}
              value={shareTargetId ?? undefined}
              onChange={(v) => setShareTargetId(v)}
              optionFilterProp="label"
              options={shareableAccounts.map((a) => ({
                value: a.id,
                label: `${a.fullName} (${a.email}) — #${a.id}`,
              }))}
              allowClear
            />
          ) : (
            <InputNumber
              placeholder="Mã tài khoản đích"
              min={1}
              style={{ width: 200 }}
              value={shareTargetId ?? undefined}
              onChange={(v) => setShareTargetId(v == null ? null : Number(v))}
            />
          )}
          <Button
            type="primary"
            icon={<PlusOutlined />}
            loading={isSharing}
            onClick={shareAccount}
            disabled={shareTargetId == null}
          >
            Chia sẻ
          </Button>
        </Space>

        <div className="list-page-table-scroll">
          <Table
            rowKey="id"
            columns={shareColumns}
            dataSource={sharedAccountIds.map((id) => ({ id }))}
            loading={isLoadingShares}
            locale={{
              emptyText: "Chưa chia sẻ quyền đọc cho tài khoản nào.",
            }}
            pagination={{ pageSize: 5 }}
            size="small"
          />
        </div>
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