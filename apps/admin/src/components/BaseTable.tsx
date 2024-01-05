import { SettingTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { Empty, Table } from "antd";
import { ColumnsType } from "antd/es/table";
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
        // const editable = isEditing(record);
        return (
          <span
          // style={{ display: "flex", justifyContent: "center", width: "100%" }}
          >
            <SettingTwoTone
              style={{
                marginRight: "0.5rem",
                fontSize: "large",
                cursor: "pointer",
              }}
              color="primary"
            />
            <DeleteTwoTone
              style={{
                marginRight: "0.5rem",
                fontSize: "large",
                cursor: "pointer",
              }}
              color="primary"
            />
          </span>
        );
        // editable ? (
        //   <span>
        //     <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
        //       Save
        //     </Typography.Link>
        //     <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
        //       <a>Cancel</a>
        //     </Popconfirm>
        //   </span>
        // ) :
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
