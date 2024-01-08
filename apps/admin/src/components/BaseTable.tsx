import { SettingTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { Empty, Table } from "antd";
import { ColumnGroupType, ColumnsType } from "antd/es/table";
import { FunctionComponent } from "react";

export interface IBaseTableProps {
  columns: ColumnsType<any>;
  data: any[];
  editable?: boolean;
  onRow?: any;
}

const BaseTable: FunctionComponent<IBaseTableProps> = ({
  columns,
  data,
  editable,
  onRow,
}) => {
  const withEditColumn = (columns: ColumnsType<any>) => {
    const editTableColumn = {
      title: "Action",
      dataIndex: "action",
      render: () => {
        return (
          <span>
            <SettingTwoTone
              style={{
                marginRight: "0.5rem",
                fontSize: "large",
                cursor: "pointer",
              }}
              color="primary"
              title="Double click here to open information"
            />
            <DeleteTwoTone
              style={{
                marginRight: "0.5rem",
                fontSize: "large",
                cursor: "pointer",
              }}
              color="primary"
              title="Click here to delete information"
            />
          </span>
        ) as unknown as ColumnsType<any>;
      },
    };
    return [...columns, editTableColumn];
  };

  return (
    <>
      {data.length > 0 ? (
        <Table
          style={{ marginRight: "16px" }}
          columns={editable ? withEditColumn(columns) : columns}
          dataSource={data}
          showSorterTooltip={true}
          bordered
          onRow={onRow}
        />
      ) : (
        <Table
          style={{ marginRight: "16px" }}
          columns={editable ? withEditColumn(columns) : columns}
          showSorterTooltip={true}
          bordered
        />
      )}
    </>
  );
};

export default BaseTable;
