import Card from "antd/es/card/Card";
import Typography from "antd/es/typography/Typography";
import { FunctionComponent, useContext, useEffect, useReducer, useState } from "react";
import BaseTable from "../../components/BaseTable";
import Flex from "antd/es/flex";
import { Button, Divider, Pagination } from "antd";
import { DeleteOutlined, PlusCircleOutlined, ReloadOutlined } from "@ant-design/icons";
import { expenseColumns } from "../../lib/constants/columns";
import { PathContext, getGlobalContext } from "../../lib/context";
import { IPagination, ExpenseDataType, PaginatedResponse } from "../../lib/interface";
import { useNavigate } from "react-router-dom";
import { DASHBOARD_ROUTES } from "../../lib/constants/routes";
import { MENU_LIST } from "../Dashboard";
import ExpenseDetail from "./ExpenseDetail";
import { ACTION_ENUM } from "../../lib/constants";

export interface IExpenseListProps {}

const ExpenseList: FunctionComponent<IExpenseListProps> = () => {
  const [expense, setExpense] = useState<Partial<ExpenseDataType>>({});
  const [expenses, setExpenses] = useState<ExpenseDataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<IPagination>({
    total: 0,
    page: 1,
    size: 10,
  });
  const [isOpenForm, dispatch] = useReducer((_: boolean, action: ACTION_ENUM) => {
    return action == ACTION_ENUM.ADD || action == ACTION_ENUM.EDIT;
  }, false);
  const [action, setAction] = useState<ACTION_ENUM>(ACTION_ENUM.CLOSE);
  const { serviceClient, useToast, useConfirm } = getGlobalContext();
  const { setPathFromKey } = useContext(PathContext);
  const navigate = useNavigate();

  const setLoadingSekeleton = (callback?: () => void) => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (callback) callback();
    }, 500);
  };

  const openFormHandler = (action: ACTION_ENUM, data: Partial<ExpenseDataType>) => {
    console.log("FORM", action);
    console.log("isFormOpen", isOpenForm);

    setAction(action);
    dispatch(action);
    setExpense(data);
  };

  const deleteDataHandler = async (data: ExpenseDataType) => {
    serviceClient
      .delete(`/expense/${data.expenseCode}`)
      .then(() => {
        useToast("success", "Delete Location successfully");
        loadData();
      })
      .catch((err) => {
        useToast("error", "Delete Location failed");
      });
  };

  const loadData = () => {
    serviceClient
      .get(`/expense?page=${pagination.page}&size=${pagination.size}`)
      .then((json) => json.data)
      .then((response: PaginatedResponse<ExpenseDataType>) => {
        setLoadingSekeleton();
        setExpenses(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // ON MOUNTED
  useEffect(() => {
    setLoadingSekeleton();

    serviceClient
      .get(`/expense?page=${pagination.page}&size=${pagination.size}`)
      .then((json) => json.data)
      .then((response: PaginatedResponse<ExpenseDataType>) => {
        setExpenses(response.data);
        setPagination({ total: response.total, page: response.page, size: response.size });
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  // ON UPDATED
  useEffect(() => {
    loadData();
  }, [pagination]);
  return (
    <>
      <Card style={{ padding: "0.25rem" }}>
        <Flex style={{ alignItems: "center" }}>
          <div>
            <h2>Expenses</h2>
            <Typography>
              - Expenses (Services fees) must be assigned to Locations so that when billed, the tenant in the Location
              will be billed for that service.
            </Typography>
          </div>
          <div style={{ flex: 1 }}></div>
          <Button type="primary" style={{ marginRight: "0.5rem" }} onClick={() => openFormHandler(ACTION_ENUM.ADD, {})}>
            <PlusCircleOutlined /> Add Service
          </Button>
          <Button size="middle" onClick={() => loadData()}>
            <ReloadOutlined />
          </Button>
        </Flex>
        <Divider />

        <ExpenseDetail
          action={action}
          isOpen={isOpenForm}
          setIsFormOpen={openFormHandler}
          data={expense}
          setData={(d) => setExpense(d)}
        />

        <BaseTable
          columns={expenseColumns}
          data={expenses}
          isLoading={isLoading}
          editable
          size="small"
          // onDblClickRow={(t: TenantDataType) => openFormHandler(ACTION_ENUM.EDIT, t)}
          onDeleteRow={(t: ExpenseDataType) =>
            useConfirm(
              "warning",
              "Expense Deletion",
              `Do you want to delete expense ${t.expenseName}?`,
              async () => await deleteDataHandler(t)
            )
          }
        />

        <Pagination
          current={pagination.page}
          total={pagination.total}
          pageSize={pagination.size}
          pageSizeOptions={[10]}
          onChange={(page, size) => {
            setPagination({ ...pagination, page, size });
          }}
          style={{ marginTop: "1.5rem" }}
        />
      </Card>
    </>
  );
};

export default ExpenseList;
